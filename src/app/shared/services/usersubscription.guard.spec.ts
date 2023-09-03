import { TestBed } from '@angular/core/testing';

import { UsersubscriptionGuard } from './usersubscription.guard';

describe('UsersubscriptionGuard', () => {
  let guard: UsersubscriptionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UsersubscriptionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
