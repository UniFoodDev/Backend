import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import * as bcrypt from 'bcrypt';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Like, Raw, Repository } from 'typeorm';
import { Role } from '../../enums/role.enum';
import { CreateEmployeeDto } from './dto/create-employee';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';
import { UpdateAddressDto } from './dto/update-address.dto';

const saltOrRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );
    createUserDto.password = hashedPassword;

    return this.usersRepository.save(
      this.usersRepository.create(createUserDto as unknown as User),
    );
  }

  async save(user: User) {
    const userSave = await this.usersRepository.save(user);
    return userSave;
  }

  async createEmployee(createEmployeeDto: CreateEmployeeDto, req, res) {
    try {
      if (req.user.roles.includes(Role.Admin)) {
        const exist = await this.usersRepository.findOneBy({
          username: createEmployeeDto.username,
        });
        if (exist) {
          return res.status(401).json({
            status: 401,
            message: 'Username already exists',
          });
        }
        const hashedPassword = await bcrypt.hash(
          createEmployeeDto.password,
          saltOrRounds,
        );
        createEmployeeDto.password = hashedPassword;
        await this.usersRepository.save(createEmployeeDto);
        return res.status(201).json({
          status: 201,
          message: 'Register success',
        });
      } else if (req.user.roles.includes(Role.Manager)) {
        const exist = await this.usersRepository.findOneBy({
          username: createEmployeeDto.username,
        });
        if (exist) {
          return res.status(401).json({
            status: 401,
            message: 'Username already exists',
          });
        }
        const hashedPassword = await bcrypt.hash(
          createEmployeeDto.password,
          saltOrRounds,
        );
        createEmployeeDto.password = hashedPassword;
        if (createEmployeeDto.roles.includes(Role.Employee)) {
          await this.usersRepository.save(createEmployeeDto);
          return res.status(201).json({
            status: 201,
            message: 'Register success',
          });
        } else {
          return res.status(401).json({
            status: 401,
            message: 'Role not valid',
          });
        }
      } else {
        return res.status(403).json({
          status: 403,
          message: 'Forbidden',
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: 'Internal server error',
      });
    }
  }

  async findAllForAdmin(
    options: IPaginationOptions,
    name: string,
  ): Promise<Pagination<User>> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    queryBuilder
      .where([
        {
          id: Raw((alias) => `CAST(${alias} as char(20)) Like '%${name}%'`), // Ép id kiểu int thành string, tìm kiếm gần giống
        },
        {
          username: Like(`%${name}%`),
        },
      ])
      .andWhere(':role1 IN(user.roles) or :role2 IN(user.roles)', {
        role1: Role.Manager,
        role2: Role.Employee,
      })
      .orderBy('user.updatedDate', 'DESC'); // Or whatever you need to do

    return paginate<User>(queryBuilder, options);
  }

  async findOne(id: number): Promise<User> {
    const exist = await this.usersRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('User not found.');
    }

    return exist;
  }

  async findByName(username: string): Promise<User> {
    const exist = await this.usersRepository.findOneBy({ username });
    if (!exist) {
      throw new NotFoundException('User not found.');
    }

    return exist;
  }

  async update(@Req() req, updateUserDto: UpdateUserDto) {
    const id = req.user.userId;
    const exist = await this.usersRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('User not found.');
    }
    return this.usersRepository.update(id, updateUserDto).then(() => ({
      statusCode: HttpStatus.OK,
      message: 'Update success',
    }));
  }

  async updateAccount(id: number, updateAccountDto: UpdateAccountDto) {
    const exist = await this.usersRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('User not found.');
    }

    const hashedPassword = await bcrypt.hash(
      updateAccountDto.password,
      saltOrRounds,
    );
    updateAccountDto.password = hashedPassword;

    return this.usersRepository.update(id, updateAccountDto).then(() => ({
      statusCode: HttpStatus.OK,
      message: 'Update success',
    }));
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const user = await this.findOne(updatePasswordDto.userId);
    const result = await bcrypt.compare(
      updatePasswordDto.oldPass,
      user.username,
    );
    if (!result) {
      throw new BadRequestException('Password not exactly');
    }

    if (updatePasswordDto.newPass !== updatePasswordDto.confirmPass) {
      throw new BadRequestException('Confirm password not equal new password');
    }

    const hashedPassword = await bcrypt.hash(
      updatePasswordDto.newPass,
      saltOrRounds,
    );

    return this.usersRepository
      .update(updatePasswordDto.userId, { password: hashedPassword })
      .then(() => ({
        statusCode: HttpStatus.OK,
        message: 'Update password success',
      }));
  }

  async remove(id: number) {
    const exist = await this.usersRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('User not found.');
    }
    return this.usersRepository.delete(id).then(() => ({
      statusCode: HttpStatus.OK,
      message: 'Delete success',
    }));
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user) {
      return null;
    }
    return user;
  }
  async findEmployee(id: number) {
    const exist = await this.usersRepository.findOneBy({ id });
    if (!exist) {
      return {
        status: 404,
        message: 'Not found.',
      };
    }
    return {
      status: 200,
      message: 'Success',
      exist,
    };
  }

  async findAllUser(@Req() req) {
    const roles = req.user.roles;

    if (roles.includes(Role.Admin)) {
      const data = await this.usersRepository
        .createQueryBuilder('user')
        .where(':employeeRole = ANY(user.roles)', {
          employeeRole: Role.Employee,
        })
        .orWhere(':managerRole = ANY(user.roles)', {
          managerRole: Role.Manager,
        })
        .getMany();
      return {
        status: 200,
        message: 'Success',
        data,
      };
    } else if (roles.includes(Role.Manager)) {
      const data = await this.usersRepository
        .createQueryBuilder('user')
        .where(':employeeRole = ANY(user.roles)', {
          employeeRole: Role.Employee,
        })
        .getMany();
      return {
        status: 200,
        message: 'Success',
        data,
      };
    } else {
      return {
        status: 403,
        message: 'Forbidden',
      };
    }
  }

  async updateUser(id: number, updateUserDto: UpdateAccountDto, @Req() req) {
    try {
      const exist = await this.usersRepository.findOneBy({ id });
      if (!exist) {
        return {
          status: 404,
          message: 'User not found',
        };
      }

      const userRoles = req.user.roles;
      const isAdmin = userRoles.includes(Role.Admin);
      const isManager = userRoles.includes(Role.Manager);
      const isEmployeeRole = updateUserDto.roles.includes(Role.Employee);

      if (isAdmin) {
        await this.usersRepository.update(id, updateUserDto);
        return {
          status: 200,
          message: 'Success',
        };
      } else if (isManager) {
        if (isEmployeeRole) {
          await this.usersRepository.update(id, updateUserDto);
          return {
            status: 200,
            message: 'Success',
          };
        } else {
          return {
            status: 401,
            message: 'Role not valid',
          };
        }
      } else {
        return {
          status: 403,
          message: 'Forbidden',
        };
      }
    } catch (error) {
      return {
        status: 500,
        message: 'Internal server error',
      };
    }
  }

  async getUserByIds(@Req() req) {
    return this.usersRepository.find({
      where: {
        id: req.user.userId,
      },
    });
  }

  async createAdress(createAddressDto: CreateAddressDto, @Req() req) {
    const user = await this.usersRepository.findOne(req.user.userId);
    const address = await this.addressRepository.create({
      ...createAddressDto,
      user: user,
    });
    return this.addressRepository.save(address);
  }

  async updateAddress(id: number, updateAddressDto: UpdateAddressDto) {
    const exist = await this.addressRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Address not found.');
    }
    return this.addressRepository.update(id, updateAddressDto).then(() => ({
      status: 200,
      message: 'Update success',
    }));
  }

  async getAddresses(@Req() req) {
    try {
      const getAddresses = await this.addressRepository.find({
        where: {
          user: req.user.userId,
        },
      });
      return {
        status: 200,
        message: 'Success',
        data: getAddresses,
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Internal server error',
      };
    }
  }
}
