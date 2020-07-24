import { Injectable } from '@nestjs/common';
import { Wallet } from './interfaces/wallet.interface';
import { promises } from 'dns';
import { ConfigService } from '@nestjs/config';

const moment = require("moment");
const axios = require("axios");

@Injectable()
export class WalletsService {
    constructor(private configService: ConfigService) {}

    private readonly wallets: Wallet[] = [];

    findAll(): Wallet[] {
        return this.wallets;
    }

    async getBalance(address): Promise<any>{
        const url = `${this.configService.get<string>('ETHERSCAN_API_URL')}?module=account&action=balance&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&tag=latest&apikey=${this.configService.get<string>('ETHERSCAN_API_KEY')}`
        return new Promise((resolve, reject) => {
            axios
            .get(url)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
        });
    }

    async getStatus(address) : Promise<boolean>{
        return new Promise((resolve, reject) => {
            this.getTransactions(address)
            .then((res) =>{
                if (res.result.length > 0) {
                    const firstTransaction = res.result[0];
                    const timeStamp = moment.unix(firstTransaction.timeStamp);
                    const isOld = moment().diff(timeStamp, "days") > 365;
                    resolve(isOld)
                }
            })
            .catch((err) => {
                reject(err);
            });
        });
        
    }

    private async getTransactions(address): Promise<any>{
        const url = `${this.configService.get<string>('ETHERSCAN_API_URL')}?module=account&action=txlist&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&startblock=0&endblock=99999999&sort=asc&apikey=${this.configService.get<string>('ETHERSCAN_API_KEY')}`
        return new Promise((resolve, reject) => {
            axios
            .get(url)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
        });
    }

}
