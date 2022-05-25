import { TestBed } from '@angular/core/testing';

import { MatService } from './mat.service';

describe('MatService', () => {
  let service: MatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
