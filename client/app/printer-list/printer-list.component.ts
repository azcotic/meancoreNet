import { Component, OnInit } from '@angular/core';
import { DataZService } from '../data-z.service';



@Component({
  selector: 'app-printer-list',
  templateUrl: './printer-list.component.html',
  styleUrls: ['./printer-list.component.scss']
})
export class PrinterListComponent implements OnInit {
	private printers: any = []
  constructor(
  	public dz: DataZService
  	) { }

  ngOnInit() {
  	let rif = {
        rif:"J294087264"
      }
      console.log("Traer todas las impresoras");
      //console.log(this.dz);
      const getAllPrinters = this.dz.GetPrinter(rif)
       .subscribe(
          (data) => {this.printers = data.datos
                     console.log(this.printers)

                   },
          (error) =>{console.log("Error al traer impresoras")});
  }

}
