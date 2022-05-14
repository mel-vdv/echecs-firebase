import { TestBed } from '@angular/core/testing';

import { VerifEchecService } from './verif-echec.service';

describe('VerifEchecService', () => {
  let service: VerifEchecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifEchecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
