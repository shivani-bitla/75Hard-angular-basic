import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Days } from './days';

describe('Days', () => {
  let component: Days;
  let fixture: ComponentFixture<Days>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Days]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Days);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
