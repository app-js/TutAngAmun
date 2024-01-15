import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReactiveTutComponent } from './form-reactive-tut.component';

describe('FormReactiveTutComponent', () => {
  let component: FormReactiveTutComponent;
  let fixture: ComponentFixture<FormReactiveTutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormReactiveTutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormReactiveTutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
