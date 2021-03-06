import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';


const apiURL = 'https://craterapi.com';


@Injectable({
  providedIn: 'root'
})


export class ApiServiceService {

  constructor(private http: HttpClient , private snackBar: MatSnackBar ){ }


  public getProducts(){
    return new Promise(resolve => {
      this.http.post( apiURL.concat('/api/package/search'), {msisdn: ''}, {headers: {'Content-Type': 'application/json'}})
      .subscribe(data => {
        resolve(data);
      }, async error => {
        this.showError(error);
        resolve(error);
      });
    });
  }

  private showError(error): void{
    this.snackBar.open('Could not load data', 'OK', {
      duration: 2000,
    });
  }

}
