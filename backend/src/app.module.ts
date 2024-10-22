import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from "./users/users.module";
import { CategoryModule } from "./categories/categories.module";
import { CardsModule } from "./cards/cards.module";
import * as path from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: path.resolve(__dirname, '..', '.env'),
            load: [() => {
                const env = process.env;
                return env;
            }],
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI')
            }),
            inject: [ConfigService]
        }),
        AuthModule,
        UserModule,
        CategoryModule,
        CardsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }