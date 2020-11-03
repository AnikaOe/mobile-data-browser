import { Component, ViewChild } from '@angular/core';
import { ApiServiceService } from './service/api-service.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

interface IProductData {
  expiry: String;
  sizeString: string;
  carrier: string;
  logo: String;
  country: String;
  link: string;
  size: number;
  expiryDate: String;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['carrier' , 'logo', 'expiry' , 'size', 'country' , 'link'];
  public dataSource: MatTableDataSource<IProductData>;
  private countries = require("i18n-iso-countries");
  private products;

  constructor(private apiService : ApiServiceService){}

  async ngOnInit(){
    this.products = await this.apiService.getProducts();
    this.countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
    const productData = Array.from({length: this.products.length}, (_, k) => this.createData(k));
    this.dataSource = new MatTableDataSource(productData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createData(index) : IProductData{
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
