import { Component, OnInit } from '@angular/core';
import { DataZService } from '../data-z.service';
import { AuthService } from '../../features/utils';
import { Router, NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-zcard',
  templateUrl: './zcard.component.html',
  styleUrls: ['./zcard.component.scss']
})
export class ZcardComponent implements OnInit {
	 public dataZs: any = []
   public serial = {
     serial:""
   }
  constructor(
  	public dz: DataZService,
  	public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  	) { }

  ngOnInit() {
  	 if (this.authService.user) {
            this.dz.detailedDataZ = "";
            this.route.params.subscribe(params => {
            this.serial.serial = params['serial'];
            //console.log("Serial",this.serial);
                })
            const getAll = this.dz.getAllZdata(this.serial)
            .subscribe(
              (data) => {this.dataZs = data.datos
                         //console.log(this.dataZs)
                       },
              (error) =>{console.log("Tuve un error DataZ")});
        }
        
    
      
    //Llamar al servicio y recibir la data, guardarla en un JSON y mostrarla en un NG repeat
  }
  ngOnChanges(){
  }
  getDetails(index){
    //console.log("Escogiste ver el detalle de la factura: ", index+1);
    this.dz.detailedDataZ=this.dz.dataZFromUser3[index];
    var o = this.dz.dataZFromUser3[index];
    var u = this.dz.detailedDataZ;
    //console.log(parseInt(JSON.parse(u.last_doc_no_fi).num))
    
    //console.log(this.dz.dataZFromUser3[index]);
    //console.log(this.dz.detailedDataZ); 
    //console.log(parseInt(o.exnt)/100)
     
      
    try {
        if (index>0){
      var o_minus = this.dz.dataZFromUser3[index-1];
      //console.log(parseInt(JSON.parse(o_minus.last_fact).num));
      //console.log(parseInt(JSON.parse(u.last_fact).num));
      u.fact_emit_num = parseInt(JSON.parse(u.last_fact).num)-parseInt(JSON.parse(o_minus.last_fact).num);
      //console.log(u.fact_emit_num);
      u.doc_no_fi_emit_num = parseInt(JSON.parse(u.last_doc_no_fi).num)-parseInt(JSON.parse(o_minus.last_doc_no_fi).num);
      //console.log(u.doc_no_fi_emit_num);
      u.nc_emit_num = parseInt(JSON.parse(u.last_nc).num)-parseInt(JSON.parse(o_minus.last_nc).num);
      //console.log(u.nc_emit_num);
    } else {
      //console.log("helado:",this.dz.detailedDataZ.doc_no_fi_emit_num);
    }
      //u.exnt = parseInt(o.exnt)/100;
      //last_fact num - last fact num del z anterior 
      //u.last_doc_no_fi.num = parseInt(JSON.parse(u.last_doc_no_fi).num);
      u.last_fact_date=JSON.parse(u.last_fact).date;
      u.last_doc_no_fi_date=JSON.parse(u.last_doc_no_fi).date;
      u.last_nc_date=JSON.parse(u.last_nc).date;
      u.last_doc_no_fi_num=parseInt(JSON.parse(u.last_doc_no_fi).num);
      u.last_nc_num=parseInt(JSON.parse(u.last_nc).num);
      u.last_fact_num=parseInt(JSON.parse(u.last_fact).num);
      u.des_bi=JSON.parse(JSON.stringify(o.des_bi.split(",")));
      u.nc_bi=JSON.parse(JSON.stringify(o.nc_bi.split(",")));
      u.alicuotas=JSON.parse(JSON.stringify(o.alicuotas.split(",")));
      u.bi=JSON.parse(JSON.stringify(o.bi.split(",")));
      u.desc_alicuotas=JSON.parse(JSON.stringify(o.desc_alicuotas.split(",")));
    } catch {
      //console.log("Helado");
    }
    this.dz.detailedDataZ = u;

        //this.dz.detailedDataZ.
    //console.log(this.dz.detailedDataZ);
  }
  ngRepeat() {
  }

}
