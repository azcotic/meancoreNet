import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZcardComponent } from './zcard.component';

describe('ZcardComponent', () => {
  let component: ZcardComponent;
  let fixture: ComponentFixture<ZcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
