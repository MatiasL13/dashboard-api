import { Injectable } from '@nestjs/common';
import { Wallet } from './interfaces/wallet.interface';
import { promises } from 'dns';
import { ConfigService } from '@nestjs/config';
import { RatesService } from 'src/rates/rates.service';

const moment = require('moment');
const axios = require('axios');
const web3 = require('web3');
const fromWei = web3.utils.fromWei;

@Injectable()
export class WalletsService {
  constructor(
    private configService: ConfigService,
    private ratesService: RatesService,
  ) {}

  private readonly wallets: Wallet[] = [{
      address: '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
      balance: 0
  },
  {
      address:'0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a',
      balance: 0
  },
  {
      address: '0x2c1ba59d6f58433fb1eaee7d20b26ed83bda51a3',
      balance: 0
  }
];

  findAll(): Wallet[] {
    return this.wallets;
  }

  async getBalance(address): Promise<number> {
    const url = `${this.configService.get<string>(
      'ETHERSCAN_API_URL',
    )}?module=account&action=balance&address=${address}&tag=latest&apikey=${this.configService.get<
      string
    >('ETHERSCAN_API_KEY')}`;
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then(res => {
          if (res.data.result.length > 0) {
            resolve(fromWei(res.data.result));
          }
          reject({
            statusCode: 404,
            message: `The address has not balance`,
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  async getBalanceInCurrency(address, currency): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getBalance(address).then(eth => {
        return this.ratesService
          .getExchangeRate(currency)
          .then(exchangeRate => {
            resolve((exchangeRate * eth).toFixed(2));
          });
      });
    });
  }

  async getStatus(address): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.getTransactions(address)
        .then(res => {
          if (res.result.length > 0) {
            const firstTransaction = res.result[0];
            const timeStamp = moment.unix(firstTransaction.timeStamp);
            const isOld = moment().diff(timeStamp, 'days') > 365;
            resolve(isOld);
          }
          reject({
            statusCode: 404,
            message: `The address has not transactions`,
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  private async getTransactions(address): Promise<any> {
    const url = `${this.configService.get<string>(
      'ETHERSCAN_API_URL',
    )}?module=account&action=txlist&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&startblock=0&endblock=99999999&sort=asc&apikey=${this.configService.get<
      string
    >('ETHERSCAN_API_KEY')}`;
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
