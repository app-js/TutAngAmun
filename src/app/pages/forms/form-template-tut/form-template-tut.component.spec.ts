import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTemplateTutComponent } from './form-template-tut.component';

describe('FormTemplateTutComponent', () => {
  let component: FormTemplateTutComponent;
  let fixture: ComponentFixture<FormTemplateTutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTemplateTutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormTemplateTutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
