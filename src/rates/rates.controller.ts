import { Controller, Get, Param, Put, Body,HttpException,HttpStatus} from '@nestjs/common';
import {RatesService} from './rates.service';
import {  UpdateExchangeRateDto } from './dto/update-exchange-rate.dto';




@Controller('rates')
export class RatesController {
    constructor(private ratesService: RatesService) {}

    @Get(':currency')
    async getExchangeRate(@Param('currency') currency): Promise<number>{
        if(currency == 'usd' || currency == 'eur' )
            return this.ratesService.getExchangeRate(currency);
        throw new HttpException('Wrong Currency', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @Put(':currency')
    async updateExchangeRate(@Param('currency') currency: string, @Body() updateExchangeRateDto: UpdateExchangeRateDto): Promise<Boolean> {
        if(currency == 'usd' || currency == 'eur' )
            return this.ratesService.updateExchangeRate(currency, updateExchangeRateDto.amount);
        throw new HttpException('Wrong Currency', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    

}
