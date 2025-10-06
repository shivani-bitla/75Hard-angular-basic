import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartDate } from './start-date';

describe('StartDate', () => {
  let component: StartDate;
  let fixture: ComponentFixture<StartDate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartDate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartDate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
