import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayContainer } from './display-container';

describe('DisplayContainer', () => {
  let component: DisplayContainer;
  let fixture: ComponentFixture<DisplayContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
