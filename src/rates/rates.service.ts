import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RatesService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getExchangeRate(currency): Promise<number> {
    var res = await this.cacheManager.get(currency);
    if (res === undefined) {
      await this.initData();
      var res = await this.cacheManager.get(currency);
    }
    console.log(res); // logs "bar2"
    return res;
  }

  async updateExchangeRate(currency, amount): Promise<boolean> {
    await this.cacheManager.set(currency, amount);
    return true;
  }

  private async initData() {
    await this.cacheManager.set('usd', 270);
    await this.cacheManager.set('eur', 232.6);
  }
}
