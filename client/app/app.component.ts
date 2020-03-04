import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { SeoService } from '../features/utils';
import { ScriptInjectorService } from '../features/utils';
import { AuthService } from '../features/utils';

declare const gtag: (type: string, googleAnalyticsID: string, pageProperties: any) => void;

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: `app.component.html`
})

export class AppComponent implements OnInit {
  curYear: number = new Date().getFullYear();
  isLoggedIn = false;


  public constructor(
    private titleService: Title,
    private seoService: SeoService,
    private router: Router,
    private scriptInjectorService: ScriptInjectorService,

  ) {
    this.scriptInjectorService.load('gtag').catch(error => {
      console.log(error);
    });
  }

  ngOnInit() {

    this.seoService.generateTags({
            title: 'Netsoft Software Z'
        });
    this.router.events.pipe(
      distinctUntilChanged((previous: any, current: any) => {
        // Subscribe to any `NavigationEnd` events where the url has changed
        if (current instanceof NavigationEnd) {
          return previous.url === current.url;
        }
        return true;
      })
    ).subscribe((x: any) => {
        const title = this.titleService.getTitle();
        const path = x.url;

        gtag('config', environment.googleAnalyticsID, {
          page_title: title,
          page_path: path
        });
    });
  }
}
