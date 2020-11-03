import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';

export interface IProductData {
  expiry: String;
  sizeString: string;
  carrier: string;
  logo: String;
  country: String;
  link: string;
  size: number;
  expiryDate: String;
}

@Injectable({
  providedIn: 'root'
})


export class ProductDataService {

  private countries = require("i18n-iso-countries");
  private products;

  constructor(private apiService : ApiServiceService) { }

  public async getProductData() : Promise<IProductData[]> {
    this.products = await this.apiService.getProducts();
    this.countries.registerLocale(require("i18n-iso-countries/langs/en.json"));    
    return Array.from({length: this.products.length}, (_, k) => this.createData(k));
    
  }

  private createData(index) : IProductData{
    return{
      size: (this.products[index].plan.unit == 'GB' ? this.products[index].plan.size*1000 : this.products[index].plan.size), //+ ' ' + this.products[index].plan.unit,
      sizeString: this.products[index].plan.size + ' ' + this.products[index].plan.unit,
      carrier: this.products[index].carrier.name,
      logo: 'https://craterapi.com' + this.products[index].carrier.imageUrl,
      country: this.countries.getName(this.products[index].carrier.country_code, "en", {select: "official"}),
      link: this.products[index].plan.tnc_url,
      expiry: this.products[index].plan.expiry_type,
      expiryDate: (new Date((new Date()).getTime()+this.products[index].plan.expiry*60000)).toLocaleDateString("en-US")
    }
  }
}
