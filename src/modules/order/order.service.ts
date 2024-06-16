import { HttpService } from '@nestjs/axios';
import {
  HttpStatus,
  Injectable,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHmac } from 'crypto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { firstValueFrom } from 'rxjs';
import { Like, Raw, Repository } from 'typeorm';
import { OrderStatus } from '../../enums';
import { CreateOrderDto } from './dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { AttributeValueVariant } from '../attribute-value/entities/attribute_value_variant.entity';
import { User } from '../user/entities/user.entity';
import { AttributeValue } from '../attribute-value/entities/attribute-value.entity';
import { Product } from '../product/entities/product.entity';
import { Variant } from '../variant/entities/variant.entity';
import { VariantService } from '../variant/variant.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private ordersRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepo: Repository<OrderItem>,
    private readonly httpService: HttpService,
    @InjectRepository(AttributeValueVariant)
    private attributeValueVariantRepo: Repository<AttributeValueVariant>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(AttributeValue)
    private attributeValueRepo: Repository<AttributeValue>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Variant)
    private variantRepo: Repository<Variant>,
    private variantService: VariantService,
    @Inject(CACHE_MANAGER)
    private cacheService: Cache,
    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    let newUser = createOrderDto.user;
    if (newUser.id === 0) {
      const exist = await this.usersRepo.findOneBy({
        phone: createOrderDto.phone,
      });
      if (exist) {
        newUser = exist;
      } else {
        newUser = await this.usersRepo.save({
          phone: createOrderDto.phone,
          fullName: createOrderDto.fullName,
        });
      }
    }
    const { user, productArrayDTOWrapper, ...orderData } = createOrderDto;
    const order = await this.ordersRepo.save({
      ...orderData,
      user: newUser,
    });
    let totalProduct = 0;
    const orderItems = await Promise.all(
      createOrderDto.productArrayDTOWrapper.map(async (item) => {
        const variant = await this.variantService.create(item);
        const product = await this.productRepo.findOne({
          where: { id: item.product.id },
        });
        if (product.amount > 0 && product.amount > +item.product.count) {
          totalProduct += +item.product.count;
          product.amount -= +item.product.count;
          await this.productRepo.save(product);
          const orderedPri = +variant.price * +item.product.count;
          const orderItem = await this.orderItemsRepo.save({
            variant: variant,
            order: order,
            quantity: item.product.count,
            orderedPrice: orderedPri.toString(),
          });
          return orderItem;
        } else {
          throw new InternalServerErrorException(
            'Product out of stock. Please try again later.',
          );
        }
      }),
    );
    const total = orderItems.reduce((acc, item) => acc + +item.orderedPrice, 0);
    order.totalPrice = total.toString();
    let ship = 0;
    if (+order.totalPrice >= 100000) {
      ship = 0;
    } else {
      ship = 20000;
    }
    order.shippingCost = ship.toString();
    order.totalQuantity = totalProduct.toString();
    await this.ordersRepo.save(order);
    await this.cacheService.set(`order-${order.id}`, order);
    console.log(await this.cacheService.get(`order-${order.id}`));
    return {
      status: 201,
      message: 'Order success',
      data: order,
    };
  }

  async countPrice(createOrderDto: CreateOrderDto) {
    const { user, productArrayDTOWrapper, ...orderData } = createOrderDto;
    let price = 0;

    // Sử dụng Promise.all để đợi tất cả các truy vấn hoàn thành
    await Promise.all(
      productArrayDTOWrapper.map(async (item) => {
        const product = await this.productRepo.findOne({
          where: { id: item.product.id },
        });
        if (product.amount > 0 && product.amount > +item.product.count) {
          const variant = await this.variantService.create(item);
          price += +variant.price * +item.product.count;
        } else {
          throw new InternalServerErrorException(
            'Product out of stock. Please try again later.',
          );
        }
      }),
    );

    let ship = 0;
    if (price >= 100000) {
      ship = 0;
    } else {
      ship = 20000;
    }

    return {
      status: 200,
      message: 'Count price success',
      data: {
        totalPrice: price,
        shippingCost: ship,
      },
    };
  }

  // To do : cần làm lại cập nhật số lượng sản phẩm sau khi hủy đơn hàng
  async updateOrderStatus(id: number, updateOrderStatus: UpdateOrderStatusDto) {
    const exist = await this.ordersRepo.findOneBy({ id });
    if (!exist) {
      return {
        status: 404,
        message: 'Order not found.',
      };
    }
    const order = await this.ordersRepo.save({
      id,
      orderStatus: updateOrderStatus.orderStatus,
      isPaid: updateOrderStatus.isPaid,
      paidDate: updateOrderStatus.paidDate,
    });
    const orderItems = await this.orderItemsRepo.find({
      where: { order: { id } },
      relations: ['variant'],
    });
    if (order.orderStatus === OrderStatus.Cancel) {
      await Promise.all(
        orderItems.map(async (item) => {
          const variant = await this.variantRepo.findOne({
            where: { id: item.variant.id },
            relations: ['product'],
          });
          const products = variant.product;
          if (products) {
            products.amount += +item.quantity;
            await this.productRepo.save(products);
          }
        }),
      );
    }
    return {
      status: 200,
      message: 'Update success',
      data: order,
    };
  }

  async finishOrder(id: number) {
    const exist = await this.ordersRepo.findOneBy({ id });
    if (!exist) {
      return {
        status: 404,
        message: 'Order not found.',
      };
    }
    const order = await this.ordersRepo.save({
      id,
      orderStatus: OrderStatus.Delivered,
      isPaid: true,
      paidDate: new Date(),
    });
    return {
      status: 200,
      message: 'Update success',
      data: order,
    };
  }

  async findAll(
    options: IPaginationOptions,
    name: string,
  ): Promise<Pagination<Order>> {
    return paginate<Order>(this.ordersRepo, options, {
      where: [
        {
          id: Raw((alias) => `CAST(${alias} as char(20)) Like '%${name}%'`), // Ép id kiểu int thành string, tìm kiếm gần giống
        },
        {
          fullName: Like(`%${name}%`),
        },
        {
          user: {
            username: Like(`%${name}%`),
          },
        },
      ],
      relations: {
        orderItems: true,
        user: true,
      },
      order: {},
    });
  }

  async findUserOrders(
    options: IPaginationOptions,
    type: number,
    userId: number,
  ): Promise<Pagination<Order>> {
    let orderStatus = null;
    switch (type) {
      case 1:
        orderStatus = OrderStatus.Processing;
        break;
      case 2:
        orderStatus = OrderStatus.Delivering;
        break;
      case 3:
        orderStatus = OrderStatus.Delivered;
        break;
      case 4:
        orderStatus = OrderStatus.Cancel;
        break;
      case 5:
        orderStatus = OrderStatus.Return;
        break;
      case 6:
        orderStatus = OrderStatus.Refund;
        break;
    }

    return paginate<Order>(this.ordersRepo, options, {
      where: {
        user: {
          id: userId,
        },
        orderStatus,
      },
      relations: {
        orderItems: {
          variant: {
            product: true,
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<Order> {
    const exist = await this.ordersRepo.findOne({
      where: { id },
      relations: {
        user: true,
        orderItems: {
          variant: {
            product: {
              images: true,
            },
          },
        },
      },
    });
    if (!exist) {
      throw new NotFoundException('Order not found.');
    }

    delete exist.user.password;

    return exist;
  }

  async remove(id: number) {
    const exist = await this.ordersRepo.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Order not found.');
    }

    return this.ordersRepo.delete({ id }).then((res) => ({
      statusCode: HttpStatus.OK,
      message: 'Delete success',
    }));
  }

  async calculateTotalRevenue() {
    return await this.ordersRepo
      .createQueryBuilder('order')
      .select('SUM(order.totalPrice)', 'totalRevenue')
      .where('order.isPaid = true')
      .getRawOne();
  }

  async salesStatistic(year: string) {
    // Select paymentMethod as method, SUM(totalPrice) as total
    // from Order
    // where isPaid = true and paidDate IS NOT NULL and YEAR(paidDate) = @year
    // group by paymentMethod

    return this.ordersRepo
      .createQueryBuilder('order')
      .select('paymentMethod', 'method')
      .addSelect('MONTH(paidDate)', 'month')
      .addSelect('SUM(totalPrice)', 'total')
      .where(
        `isPaid = true and paidDate IS NOT NULL and YEAR(paidDate) = ${year}`,
      )
      .groupBy('paymentMethod, MONTH(paidDate)')
      .getRawMany();
  }

  async count() {
    return await this.ordersRepo.count();
  }

  async overview() {
    return await this.ordersRepo
      .createQueryBuilder('order')
      .select('orderStatus')
      .addSelect('COUNT(order.id)', 'total')
      .groupBy('orderStatus')
      .getRawMany();
  }

  async createZaloPayOrder(order) {
    const yy = new Date().getFullYear().toString().slice(-2);
    const mm = String(new Date(Date.now()).getMonth() + 1).padStart(2, '0');
    const dd = String(new Date(Date.now()).getUTCDate()).padStart(2, '0');

    const items = order.orderItems.map((o) => {
      let attributes = '';

      for (const [i, at] of o.variant.attributeValues.entries() as any) {
        attributes += i === 0 ? ' - ' : ', ';
        attributes += `${at.value}`;
      }

      const itemname = o.variant.product?.name + attributes;

      return {
        itemid: o.id,
        itemname,
        itemprice: o.orderedPrice,
        itemquantity: o.orderedQuantity,
      };
    });

    const server_uri =
      process.env.NODE_ENV === 'development'
        ? 'https://57c4-101-99-32-135.ap.ngrok.io'
        : process.env.SERVER;
    // ngrok http --host-header=localhost http://localhost:4000
    const callback_url = `${server_uri}/order/zalopay/callback`;

    const params = {
      app_id: 2553,
      app_user: order.fullName,
      app_trans_id: `${yy}${mm}${dd}_${order.id}_${Date.now()}`,
      embed_data: JSON.stringify({
        redirecturl: `${process.env.CLIENT}/order/${order.id}`,
        orderId: order.id,
      }),
      amount: 50000,
      item: JSON.stringify(items),
      app_time: Date.now(),
      bank_code: 'zalopayapp',
      phone: order.phone.toString(),
      address: order.address,
      description: `Thanh toán đơn hàng ${order.id}`,
      mac: '',
      callback_url,
    };

    const data =
      params.app_id +
      '|' +
      params.app_trans_id +
      '|' +
      params.app_user +
      '|' +
      params.amount +
      '|' +
      params.app_time +
      '|' +
      params.embed_data +
      '|' +
      params.item;

    const key1 = process.env.ZALO_KEY1;

    // const mac = CryptoJS.HmacSHA256(data, key1).toString();
    const mac = createHmac('sha256', key1).update(data).digest('hex');
    params.mac = mac;

    try {
      return (
        await firstValueFrom(
          this.httpService.post('https://sb-openapi.zalopay.vn/v2/create', {
            ...params,
          }),
        )
      ).data;
    } catch (error) {
      // console.log(error);
      throw new InternalServerErrorException('ZaloPay Error');
    }
  }

  async checkOrderUser(data) {
    const exist = await this.ordersRepo.findOne({
      where: { id: data.orderId, user: { id: data.userId } },
    });
    if (!exist) {
      throw new NotFoundException('Not found.');
    }

    return exist;
  }

  async getOrderById(id: number) {
    const order = await this.ordersRepo.findOne({
      where: { id },
      relations: [
        'orderItems',
        'orderItems.variant.product',
        'orderItems.variant.attributeValueVariant.attributeValue',
        'user',
      ],
    });
    if (!order) {
      return {
        status: 404,
        message: 'Order not found.',
      };
    }
    return {
      status: 200,
      message: 'Get order success',
      data: order,
    };
  }

  async getOrdersByUserId(@Req() req) {
    const userId = req.user.id;
    const orders = await this.ordersRepo.find({
      where: { user: { id: userId } },
      relations: [
        'orderItems',
        'orderItems.variant.product',
        'orderItems.variant.attributeValueVariant.attributeValue',
        'user',
      ],
    });
    if (!orders) {
      return {
        status: 404,
        message: 'Order not found.',
      };
    }
    return {
      status: 200,
      message: 'Get order success',
      data: orders,
    };
  }

  getOrdersByMobilePhone(phone: string) {
    const orders = this.ordersRepo.find({
      where: { phone },
      relations: [
        'orderItems',
        'orderItems.variant.product',
        'orderItems.variant.attributeValueVariant.attributeValue',
        'user',
      ],
    });
    if (!orders) {
      return {
        status: 404,
        message: 'Order not found.',
      };
    }
    return {
      status: 200,
      message: 'Get order success',
      data: orders,
    };
  }

  async adminGetAllOrders() {
    const orders = await this.ordersRepo.find({
      relations: [
        'orderItems',
        'orderItems.variant.product',
        'orderItems.variant.attributeValueVariant.attributeValue',
        'user',
      ],
      order: {
        createdAt: 'DESC',
      },
    });
    if (!orders) {
      return {
        status: 404,
        message: 'Order not found.',
      };
    }
    return {
      status: 200,
      message: 'Get order success',
      data: orders,
    };
  }

  // tính tổng doanh thu, tổng đơn hàng và tổng sản phẩm đã bán
  async getAllPriceAndOrder() {
    try {
      const { totalShippingCost, totalRevenue, totalOrder } =
        await this.ordersRepo
          .createQueryBuilder('order')
          .select('SUM(CAST(order.totalPrice AS DECIMAL))', 'totalRevenue')
          .addSelect(
            'SUM(CAST(order.shippingCost AS DECIMAL))',
            'totalShippingCost',
          )
          .addSelect('COUNT(order.id)', 'totalOrder')
          .getRawOne();
      return {
        status: 200,
        message: 'Get success',
        data: {
          totalShippingCost: totalShippingCost || 0,
          totalRevenue: totalRevenue || 0,
          totalOrder: totalOrder || 0,
        },
      };
    } catch (e) {
      return {
        status: 500,
        message: 'Internal server error',
      };
    }
  }

  async getBestSellingProduct() {
    const top10BestSellingProducts = await this.orderItemRepo
      .createQueryBuilder('orderItems')
      .innerJoin('orderItems.variant', 'variant')
      .innerJoin('variant.product', 'product')
      .select('product.id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('SUM(CAST(orderItems.quantity AS DECIMAL))', 'totalQuantity')
      .groupBy('product.id')
      .addGroupBy('product.name')
      .orderBy('SUM(CAST(orderItems.quantity AS DECIMAL))', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      status: 200,
      message: 'Get success',
      data: top10BestSellingProducts,
    };
  }

  async getMonthlyCostsAndRevenue(year: string) {
    const monthlyCostsAndRevenue = await this.ordersRepo
      .createQueryBuilder('order')
      .select([
        'EXTRACT(MONTH FROM order.createdAt) AS month',
        'SUM(CAST(order.shippingCost AS DECIMAL)) AS totalShippingCost',
        'SUM(CAST(order.totalPrice AS DECIMAL)) AS totalRevenue',
      ])
      .where(`TO_CHAR(order.createdAt, 'YYYY') = :year`, { year })
      .groupBy('month')
      .orderBy('month')
      .getRawMany();
    return {
      status: 200,
      message: 'Monthly costs and revenue retrieved successfully',
      data: monthlyCostsAndRevenue,
    };
  }
}
