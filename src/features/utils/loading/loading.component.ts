import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  moduleId: module.id,
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit, OnDestroy {
  public loading$: BehaviorSubject<any>;

  constructor(private loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }

  // tslint:disable-next-line
  ngOnInit() { }

  ngOnDestroy() {
    if (this.loading$) {
      this.loading$.unsubscribe();
    }
  }
}
