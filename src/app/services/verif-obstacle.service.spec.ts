import { TestBed } from '@angular/core/testing';

import { VerifObstacleService } from './verif-obstacle.service';

describe('VerifObstacleService', () => {
  let service: VerifObstacleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifObstacleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
