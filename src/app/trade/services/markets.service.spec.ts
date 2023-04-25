import { TestBed } from '@angular/core/testing';

import { MarketsService } from './markets.service';

describe('MarketsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MarketsService = TestBed.get(MarketsService);
    expect(service).toBeTruthy();
  });
});
