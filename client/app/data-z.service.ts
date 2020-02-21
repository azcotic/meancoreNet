import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  DataZ, Last, Convert } from "../assets/models/DataZ";

const httpOptions = {
  headers: new HttpHeaders({ 
    'Access-Control-Allow-Origin':'*',
    'content-type':'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class DataZService {
	baseurl = 'http://localhost:3000';
  constructor(private http: HttpClient) { }
  addDataZ( jsonDataZ:DataZ ) {
    //console.log("imprimo lo que me llegó",jsonDataZ);
  	//console.log("imprimo algo de lo que me llegó",jsonDataZ.last_fact," y una variable del arreglo ",jsonDataZ.alicuotas[0]);
	//const data = {"saludo":"Hola vale"};
	let data = Convert.toDataZ(JSON.stringify(jsonDataZ));
    //console.log("imprimo antes de enviar al servidor",data);
    this.http.post(`${this.baseurl}/DataZ/add`, data)
        .subscribe(res => console.log('Done y lo que recibí fue, ',res));
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





