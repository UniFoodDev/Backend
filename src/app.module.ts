import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeModule } from './modules/attribute/attribute.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { VariantModule } from './modules/variant/variant.module';
import { CartModule } from './modules/cart/cart.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { MailModule } from './modules/mail/mail.module';
import { TagModule } from './modules/tag/tag.module';
import { AttributeValueModule } from './modules/attribute-value/attribute-value.module';
import { AdminModule } from './modules/admin/admin.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true, ttl: 600 }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_POSTGRES_HOST'),
        port: parseInt(configService.get<string>('DATABASE_POSTGRES_PORT')),
        username: configService.get<string>('DATABASE_POSTGRES_USERNAME'),
        password: configService.get<string>('DATABASE_POSTGRES_PASSWORD'),
        database: configService.get<string>('DATABASE_POSTGRES_NAME'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        migrationsTableName: 'migrations',
        migrations: [join(__dirname, '..', 'database/migrations/*{.js,.ts}')],
        seeds: [join(__dirname, '..', 'database/seeds/*{.js,.ts}')],
        factories: [join(__dirname, '..', 'database/factories/*{.js,.ts}')],
        subscribers: [join(__dirname, '..', 'modules/**/*.subscriber.{ts,js}')],
      }),
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    AttributeModule,
    OrderModule,
    VariantModule,
    CartModule,
    WebhookModule,
    MailModule,
    TagModule,
    AttributeModule,
    AttributeValueModule,
    AdminModule,
  ],
})
export class AppModule {}
