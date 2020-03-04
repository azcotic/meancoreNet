import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  DataZ, Last, Convert } from "../assets/models/DataZ";
import { Observable } from '../../node_modules/rxjs';
const httpOptions = {
  headers: new HttpHeaders({ 
    'Access-Control-Allow-Origin':'*',
    'content-type':'application/json'
  })
};
var dataZFromUser2:any;
var dataprinterData:any;
@Injectable({
  providedIn: 'root'
})
export class DataZService {
	baseurl = 'http://localhost:3000';
	dataZFromUser = [];
	dataZFromUser3:any = false;
	dataprinters:any = false;
	detailedDataZ:any = false;
	serialDataZ:any = false;

  constructor(private http: HttpClient) { }
  	addDataZ( jsonDataZ:DataZ ) {
		let data = Convert.toDataZ(JSON.stringify(jsonDataZ));
	    this.http.post(`${this.baseurl}/DataZ/add`, data)
	        .subscribe(res => console.log('Done y lo que recibí fue, ',res));
  	}


  	getAllZdata(serial):Observable<any>{
  		let result = new EventEmitter<any>()
  		console.log("Serial",serial);
  		//this.serialDataZ = serial;
  		//console.log("Voy a traer los reportes de la impresora:", serial);
  		this.http.post(`${this.baseurl}/DataZ/GetAll`, serial)
	        .subscribe(res => {
	        	dataZFromUser2 = res;
	        	//console.log('Me traigo todos los dataZ, ',dataZFromUser2.datos);
	        	console.log("Meto los datos para exportar",this.dataZFromUser3=dataZFromUser2.datos)
	        	return result.emit(res);
	        });
	        return result;
  	}

  	getZdataFromUser(){}

  	GetPrinter(rif):Observable<any>{
  		let result = new EventEmitter<any>()
  		console.log("Rif",rif);
  		this.http.post(`${this.baseurl}/DataZ/GetPrinters`, rif)
	        .subscribe(res => {
	        	dataprinterData = res;
	        	//console.log('Me traigo todos los dataZ, ',dataZFromUser2.datos);
	        	console.log("Meto los datos para exportar",this.dataprinters=dataprinterData.datos)
	        	return result.emit(res);
	        });
	        return result;
      
    }
  	DeleteAll() {
	  	const headers = new HttpHeaders()
	        .set('content-type','application/json');
	      this.http.post(this.baseurl+'/DataZ/DeleteAll', {"Borrar":true}, {
	        headers:headers
	      })
	      .subscribe(
	        data => {
	          try {console.log("Se borró la BD.")
	          }
	          catch(err){
	            console.log("Error de json,",err);
	          }
	          //console.log(data.msgType);
	          //console.log(JSON.parse(data));
	          //console.log(JSON.stringify(data));
	        },
	        err => {
	            //this.jsonData.push({"Error":err})
	            console.log('HTTP Error', err);
	          })
    }
}





