import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTrackInputComponent } from './form-track-input.component';

describe('FormTrackInputComponent', () => {
  let component: FormTrackInputComponent;
  let fixture: ComponentFixture<FormTrackInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormTrackInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTrackInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
