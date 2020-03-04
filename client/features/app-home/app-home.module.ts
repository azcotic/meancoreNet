import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppHomeComponent } from './app-home.component';
import { ZcardComponent } from '../../../client/app/zcard/zcard.component';
import { PrinterListComponent } from '../../../client/app/printer-list/printer-list.component';
import { DatazDetailsComponent } from '../../../client/app/dataz-details/dataz-details.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule

  ],
  declarations: [
    AppHomeComponent,
    ZcardComponent,
    PrinterListComponent,
    DatazDetailsComponent
  ]
})

export class AppHomeModule {}
