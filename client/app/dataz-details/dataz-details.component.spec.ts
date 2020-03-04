import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatazDetailsComponent } from './dataz-details.component';

describe('DatazDetailsComponent', () => {
  let component: DatazDetailsComponent;
  let fixture: ComponentFixture<DatazDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatazDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatazDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
