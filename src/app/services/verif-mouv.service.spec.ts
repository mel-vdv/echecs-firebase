import { TestBed } from '@angular/core/testing';

import { VerifMouvService } from './verif-mouv.service';

describe('VerifMouvService', () => {
  let service: VerifMouvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifMouvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
