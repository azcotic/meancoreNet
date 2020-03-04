import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { UnauthorizedComponent } from '../features/utils/unauthorized/unauthorized.component';
import { PageNotFoundComponent } from '../features/utils/page-not-found/page-not-found.component';

import { AppHomeModule } from '../features/app-home/app-home.module';
import { AppFooterModule } from '../features/app-footer/app-footer.module';
import { AppMenuModule } from '../features/app-menu/app-menu.module';
import { AppUsersModule } from '../features/app-users/app-users.module';
import { UserAccessControlModule } from '../features/user-access-control/uac-dashboard.module';

import {
  UtilsModule,
  AppLoadService,
  AuthGuard,
  AuthService,
  LoadingInterceptor,
  LoadingService,
  MessagingInterceptor,
  MessagingService,
  ScriptInjectorService,
  SeoService
} from '../features/utils';

import { TestComponent } from './test/test.component';
import { DataZService } from './data-z.service';
import { ZcardComponent } from './zcard/zcard.component';
import { PrinterListComponent } from './printer-list/printer-list.component';
import { DatazDetailsComponent } from './dataz-details/dataz-details.component';
import { registerLocaleData } from '@angular/common';
import localeVe from '@angular/common/locales/es-VE';

export function init_app(appLoadService: AppLoadService) {
  return () => appLoadService.initializeApp();
}
registerLocaleData(localeVe, 'es-VE');
@NgModule({
  declarations: [
    AppComponent,
    UnauthorizedComponent,
    PageNotFoundComponent,
    TestComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    UtilsModule,
    UserAccessControlModule,
    AppMenuModule,
    AppHomeModule,
    AppFooterModule,
    AppUsersModule
  ],
  exports: [
     TestComponent
  ],
  providers: [
    AppLoadService,
    {
      provide: APP_INITIALIZER,
      useFactory: init_app,
      deps: [AppLoadService],
      multi: true
    },
    AuthGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MessagingInterceptor,
      multi: true
    },
    LoadingService,
    MessagingService,
    ScriptInjectorService,
    DataZService,
    SeoService,
    {
      provide: '@env',
      useValue: environment
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

