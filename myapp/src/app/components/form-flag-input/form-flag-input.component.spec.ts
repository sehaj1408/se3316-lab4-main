import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFlagInputComponent } from './form-flag-input.component';

describe('FormFlagInputComponent', () => {
  let component: FormFlagInputComponent;
  let fixture: ComponentFixture<FormFlagInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFlagInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFlagInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
