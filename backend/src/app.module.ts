import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from '@nestjs/config';
import { UserModule } from "./users/users.module";
import { CategoryModule } from "./categories/categories.module";
import { CardsModule } from "./cards/cards.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.MONGO_URI),
        AuthModule,
        UserModule,
        CategoryModule,
        CardsModule,
    ],
    controllers: [],
    providers: [],
})

export class AppModule { }