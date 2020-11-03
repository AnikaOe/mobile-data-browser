import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';

export interface IProductData {
  expiry: string;
  sizeString: string;
  carrier: string;
  logo: string;
  country: string;
  link: string;
  size: number;
  expiryDate: string;
}

@Injectable({
  providedIn: 'root'
})


export class ProductDataService {

  private countries = require('i18n-iso-countries');
  private products;
  private productData: IProductData[];

  constructor(private apiService: ApiServiceService) { }

  public async getProductData(): Promise<IProductData[]> {
    if (!this.productData){
      await this.loadData();
    }
    return this.productData;
  }

  private async loadData(): Promise<void>{
    this.products = await this.apiService.getProducts();
    this.countries.registerLocale(require('i18n-iso-countries/langs/en.json'));
    this.productData = Array.from({length: this.products.length}, (_, k) => this.createData(k));
  }

  private createData(index): IProductData{
    return{
      size: (this.products[index].plan.unit === 'GB' ? this.products[index].plan.size * 1000 : this.products[index].plan.size),
      sizeString: this.products[index].plan.size + ' ' + this.products[index].plan.unit,
      carrier: this.products[index].carrier.name,
      logo: 'https://craterapi.com' + this.products[index].carrier.imageUrl,
      country: this.countries.getName(this.products[index].carrier.country_code, 'en', {select: 'official'}),
      link: this.products[index].plan.tnc_url,
      expiry: this.products[index].plan.expiry_type,
      expiryDate: (new Date((new Date()).getTime() + this.products[index].plan.expiry * 60000)).toLocaleDateString('en-US')
    };
  }
}
