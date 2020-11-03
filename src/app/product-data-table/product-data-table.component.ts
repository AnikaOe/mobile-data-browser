import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IProductData } from '../service/product-data.service';
import { ProductDataService } from '../service/product-data.service';

@Component({
  selector: 'app-product-data-table',
  templateUrl: './product-data-table.component.html',
  styleUrls: ['./product-data-table.component.css']
})
export class ProductDataTableComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['carrier' , 'logo', 'expiry' , 'size', 'country' , 'link'];
  public dataSource: MatTableDataSource<IProductData>;


  constructor(private productDataService : ProductDataService){}

  async ngOnInit(){
    const productData = await this.productDataService.getProductData();
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

}
