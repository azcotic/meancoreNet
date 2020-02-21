import { TestBed } from '@angular/core/testing';

import { DataZService } from './data-z.service';

describe('DataZService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataZService = TestBed.get(DataZService);
    expect(service).toBeTruthy();
  });
});
