import { TestBed } from '@angular/core/testing';

import { StudcardApiService } from './studcard-api.service';

describe('StudcardApiService', () => {
  let service: StudcardApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudcardApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
