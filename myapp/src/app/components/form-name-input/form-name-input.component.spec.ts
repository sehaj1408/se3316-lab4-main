import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNameInputComponent } from './form-name-input.component';

describe('FormNameInputComponent', () => {
  let component: FormNameInputComponent;
  let fixture: ComponentFixture<FormNameInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormNameInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormNameInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
