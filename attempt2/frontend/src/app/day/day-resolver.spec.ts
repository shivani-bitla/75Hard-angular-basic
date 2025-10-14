import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { dayResolver } from './day-resolver';

describe('dayResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => dayResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
