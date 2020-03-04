import { Component, OnInit } from '@angular/core';
import { DataZService } from '../data-z.service';

@Component({
  selector: 'app-dataz-details',
  templateUrl: './dataz-details.component.html',
  styleUrls: ['./dataz-details.component.scss']
})
export class DatazDetailsComponent implements OnInit {
  private dato = 56789;

  private last1:Last = {
        "num": "4504",
        "date": "14-124-53"
    }
      
  private data2:DataZ = {
        date: ""+Date.now(),
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
        last_fact: this.last1,
        last_doc_no_fi: this.last1,
        last_nc: this.last1
    }; 
  public jsonDataZ = {
    nombre: "NETSOFT TECHNOLOGY, C.A.",
    dir:"URBANICAZION CHILEMEX",
    dir2:"PUERTO ORDAZ",
    dir3:"",
    dir4:"",
    dir5:""
  }
  public md = "Bs "; //Moneda BS

  constructor(
    public dz: DataZService
    ) {

  }
  p(numero){ //Parsear entero
    parseInt(numero)
    return numero/100
  }
  totalIVA(index){
      let total = 0;
      if (index=="ventas"){
        for (var i =this.dz.detailedDataZ.alicuotas.length - 1; i >= 0; i--) {
          total += (parseInt(this.dz.detailedDataZ.bi[i])/100*parseInt(this.dz.detailedDataZ.alicuotas[i]))   
        }
      }else {
        if (index=="nc"){
          for (var i =this.dz.detailedDataZ.alicuotas.length - 1; i >= 0; i--) {
            total += (parseInt(this.dz.detailedDataZ.nc_bi[i])/100*parseInt(this.dz.detailedDataZ.alicuotas[i]))  
          }
        } else {
          if (index=="desc") {
            for (var i =this.dz.detailedDataZ.alicuotas.length - 1; i >= 0; i--) {
              total += (parseInt(this.dz.detailedDataZ.des_bi[i])/100*parseInt(this.dz.detailedDataZ.alicuotas[i]))  
            }
          }
        }
      }
      return total;
  }
  totalVentas(index){
    var total = 0;
    if (index=="ventas"){
        for (var i = this.dz.detailedDataZ.bi.length - 1; i >= 0; i--) {
          total +=parseInt(this.dz.detailedDataZ.bi[i]);
        }
        total+=parseInt(this.dz.detailedDataZ.exnt);
      }else {
        if (index=="nc"){
          for (var i = this.dz.detailedDataZ.nc_bi.length - 1; i >= 0; i--) {
            total +=parseInt(this.dz.detailedDataZ.nc_bi[i]);
          }
          total+=parseInt(this.dz.detailedDataZ.nc_exento);
        } else {
          if (index="desc") {
            for (var i = this.dz.detailedDataZ.des_bi.length - 1; i >= 0; i--) {
              total +=parseInt(this.dz.detailedDataZ.des_bi[i]);
            }
            total+=parseInt(this.dz.detailedDataZ.des_exnt);
          }
        }
      }
    return total
  }
  ngOnInit() {
    //console.log(this.data2);
    //console.log(this.dz.detailedDataZ);
  }

}
