import { TestBed } from '@angular/core/testing';

import { SimulacreService } from './simulacre.service';

describe('SimulacreService', () => {
  let service: SimulacreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulacreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
