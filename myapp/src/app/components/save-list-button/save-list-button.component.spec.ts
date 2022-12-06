import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveListButtonComponent } from './save-list-button.component';

describe('SaveListButtonComponent', () => {
  let component: SaveListButtonComponent;
  let fixture: ComponentFixture<SaveListButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveListButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveListButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
