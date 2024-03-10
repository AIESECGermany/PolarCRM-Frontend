import { TestBed } from '@angular/core/testing';

import { DseService } from './dse.service';

describe('DseService', () => {
  let service: DseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
