import { Controller, Get, Param,HttpException,HttpStatus} from '@nestjs/common';
import {WalletsService} from './wallets.service';
import {Wallet} from './interfaces/wallet.interface';



@Controller('wallets')
export class WalletsController {
    constructor(private walletsService: WalletsService) {}


    @Get()
    async findAll(): Promise<Wallet[]> {
        return this.walletsService.findAll();
    }

    @Get(':address/age')
    async walletStatus(@Param('address') address): Promise<any>{
        return this.walletsService.getStatus(address);

    }

    @Get(':address/balance')
    async balance(@Param('address') address): Promise<any>{
        return this.walletsService.getBalance(address);
    }
    
    @Get(':address/balance/:currency')
    async getBalanceInCurrency(@Param() params): Promise<any>{
        if(params.currency == 'usd' || params.currency == 'eur' )
            return this.walletsService.getBalanceInCurrency(params.address,params.currency);
        throw new HttpException('Wrong Currency', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @Get(':id')
    findOne(@Param() params): string {
        console.log(params.id);
        return `This action returns a #${params.id} wallet`;
    }

    // @Get(':id')
    // findOne(@Param('id') id): string {
    //     return `This action returns a #${id} cat`;
    // }



}
