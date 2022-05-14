import { TestBed } from '@angular/core/testing';

import { EnregistrerService } from './enregistrer.service';

describe('EnregistrerService', () => {
  let service: EnregistrerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnregistrerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
