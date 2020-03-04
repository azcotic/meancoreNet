import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import dataZ  from  '../../assets/js/dataz.json';
import { DataZ, Last, Convert, invalidValue } from '../../assets/models/DataZ';
import { DataZService } from '../data-z.service';
import { HandleErrorService } from '../../features/utils';
import { AuthService } from '../../features/utils';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Access-Control-Allow-Origin':'*',
    'content-type':'application/json'
  })
};

var contadornumrepz= 0;

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  isLoggedIn = false;
  public baseurl ="http://localhost:3000";
  public jsonData: any = []
  public dataZs: any = []
  constructor(
  	private http: HttpClient,
    private handleErrorService: HandleErrorService,
    private dz: DataZService,
    public authService: AuthService

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
   
    //console.log(contadornumrepz=contadornumrepz+1)
    const last2 = {
      "num": "",
      "date":""
    }
    const last1:Last = {
      "num": "4504",
      "date": "14-124-53"
    }
    
    const data2:DataZ = {
      date: ""+Date.now(),
      num_repz: "000"+contadornumrepz,
      rif: "J294087264",
      serial: "NST0000147",
      alicuotas: [
        "08",
        "16",
        "31",
        "0"],
      desc_alicuotas: [
        "R",
        "G",
        "A",
        "O",
      ],
      exnt: "160000",
      bi: [
      "40.000",
      "30.000",
      "20.000",
      "10.000",
      ],
      nc_exento: "3250000",
      nc_bi: [
      "08",
      "16",
      "31",
      "0",
      ],
      des_exnt: "6700000",
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

    let jsonRecibido = data2;
    console.log(jsonRecibido);
    console.log("Envio y salvo el json",jsonRecibido);
    this.dz.addDataZ(jsonRecibido);
    

  }
  DeleteAllJson(){
    console.log("Borrar toda la data BD");
    this.dz.DeleteAll(); 
  }

  GetAllJson(){
    let serial = {
      serial:"NST0000147"
    }
    //console.log("Traer todos los Z y listar");
    const getAll = this.dz.getAllZdata(serial)
      .subscribe(
        (data) => {this.dataZs = data.datos
                   //console.log(this.dataZs)
                 },
        (error) =>{console.log("Tuve un error DataZ")});
  }
  ngOnChanges(){
  }
  ngOnInit() {
    
  }
}

