import { Routes } from '@angular/router';

import { AppHomeComponent } from './app-home.component';

import { ZcardComponent } from '../../../client/app/zcard/zcard.component';
import { PrinterListComponent } from '../../../client/app/printer-list/printer-list.component';

export const AppHomeRoutes: Routes = [
  {
    path: '',
    component: AppHomeComponent
  },
  {
    path: 'printers',
    component: PrinterListComponent,
  },
  {
    path: 'zcards/:serial',
    component: ZcardComponent,
  }
];
