import { TestBed } from '@angular/core/testing';

import { AdvantagesService } from './advantages.service';

describe('AdvantagesService', () => {
  let service: AdvantagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvantagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
