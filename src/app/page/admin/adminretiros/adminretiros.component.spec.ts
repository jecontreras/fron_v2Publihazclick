import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminretirosComponent } from './adminretiros.component';

describe('AdminretirosComponent', () => {
  let component: AdminretirosComponent;
  let fixture: ComponentFixture<AdminretirosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminretirosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminretirosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
