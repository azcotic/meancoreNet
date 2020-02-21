import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import dataZ  from  '../../assets/js/dataz.json';
import { DataZ, Last, Convert, invalidValue } from '../../assets/models/DataZ';
import { DataZService } from '../data-z.service';
import { HandleErrorService } from '../../features/utils';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Access-Control-Allow-Origin':'*',
    'content-type':'application/json'
  })
};

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

    public baseurl ="http://localhost:3000";
    public jsonData: any = []
    constructor(
    	private http: HttpClient,
      private handleErrorService: HandleErrorService,
      private dz: DataZService

    ) { } 

    callServer(){
      //console.log(dataZ);
    	const headers = new HttpHeaders()
    		.set('content-type','application/json');
    	this.http.post(this.baseurl+'/zServices', JSON.stringify(dataZ), {
    		headers:headers
    	})
    	.subscribe(
        data => {
          console.log((JSON.parse(JSON.stringify(data))).env)
          try {var json = Convert.toDataZ((JSON.parse(JSON.stringify(data))).datos)
            this.jsonData.push(json);
          }
          catch(err){
            console.log("Error de json,",err);
          }
          
          
          
          //console.log(data.msgType);
    		  //console.log(JSON.parse(data));
          //console.log(JSON.stringify(data));
        },
        err => {
            this.jsonData.push({"Error":err})
            console.log('HTTP Error', err);
          })
    }
    callConsoles(){
        const televisor = 2;
        console.log("Hola guapo");
    }
    userAPI(): Observable<any> {
          return this.http.post(this.baseurl, "hola", httpOptions)
            .pipe(
              tap((result) => console.log('result-->',result)),
              catchError(this.handleErrorService.handleError('error', []))
            );
    }

    SaveBD(){
      const last1:Last = {
        "num": "4504",
        "date": "14-124-53"
      }
      const last2 = {
        "num": "",
        "date":""
      }
      const data2:DataZ = {
        date: "datastamp",
        num_repz: "0001",
        rif: "J00000000000",
        serial: "NST0000147",
        alicuotas: [
          "08",
          "16",
          "31",
          "0"],
        desc_alicuotas: [
          "G",
          "R",
          "B",
          "O",
        ],
        exnt: "40000",
        bi: [
        "08",
        "16",
        "31",
        "0",
        ],
        nc_exento: "4534343434",
        nc_bi: [
        "08",
        "16",
        "31",
        "0",
        ],
        des_exnt: "23232323",
        des_bi: [
        "08",
        "16",
        "31",
        "0",
        ],
        last_fact: last1,
        last_doc_no_fi: last1,
        last_nc: last1
      };
      const data3 = {
      "num_repz": "0001",
      "rif": "J00000000000",
      "serial": "NST00006",
      "alicuotas": [
        "08",
        "16",
        "31",
        "0"
      ],
      "desc_alicuotas": [
        "R",
        "G",
        "A",
        "O"
      ],
      "exnt": "40.000",
      "bi": [
        "40.000",
        "40.000",
        "40.000",
        "40.000"
      ],
      "nc_exento": "40.000",
      "nc_bi": [
        "40.000",
        "40.000",
        "40.000",
        "40.000"
      ],
      "des_exnt": "40.000",
      "des_bi": [
        "40.000",
        "40.000",
        "40.000",
        "40.000"
      ],
      "last_fact": {
        "num": "00005",
        "date": "timestamp"
      },
      "last_doc_no_fi": {
        "num": "00005",
        "date": "timestamp"
      },
      "last_nc": {
        "num": "00005",
        "date": "timestamp"
      }
      }
      let jsonRecibido = data2;
      console.log(jsonRecibido);
      console.log("Envio y salvo el json",jsonRecibido);
      this.dz.addDataZ(jsonRecibido);
      

    }
    DeleteAllJson(){
      console.log("Borrar toda la data BD");
      this.dz.DeleteAll();
      
    }


    ngOnInit() {

        }
    }

