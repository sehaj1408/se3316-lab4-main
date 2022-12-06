import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDescriptionInputComponent } from './form-description-input.component';

describe('FormDescriptionInputComponent', () => {
  let component: FormDescriptionInputComponent;
  let fixture: ComponentFixture<FormDescriptionInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDescriptionInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDescriptionInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
