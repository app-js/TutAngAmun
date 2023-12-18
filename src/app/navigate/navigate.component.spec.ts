import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NavigateComponent } from './navigate.component';
import { RouterTestingModule } from "@angular/router/testing";
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { InfoComponent } from '../pages/info/info.component';

imports: [
  RouterTestingModule,
]

describe('NavigateComponent', () => {
  let component: NavigateComponent;
  let fixture: ComponentFixture<NavigateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([
          {path: '', component: DashboardComponent},
          {path: 'info', component: InfoComponent}
        ])
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
