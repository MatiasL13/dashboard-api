import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletsController } from './wallets/wallets.controller';
import { WalletsService } from './wallets/wallets.service';
import { ConfigModule } from '@nestjs/config';
import { RatesController } from './rates/rates.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, WalletsController, RatesController],
  providers: [ AppService, WalletsService],
})
export class AppModule {}
