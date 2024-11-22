import { TestBed } from '@angular/core/testing';

import { AbonnementsServiceService } from './abonnements-service.service';

describe('AbonnementsServiceService', () => {
  let service: AbonnementsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbonnementsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
