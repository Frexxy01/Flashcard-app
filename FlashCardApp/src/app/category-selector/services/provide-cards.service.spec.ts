import { TestBed } from '@angular/core/testing';

import { ProvideCardsService } from './provide-cards.service';

describe('ProvideCardsService', () => {
  let service: ProvideCardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProvideCardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
