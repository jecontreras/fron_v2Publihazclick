import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminactividadComponent } from './adminactividad.component';

describe('AdminactividadComponent', () => {
  let component: AdminactividadComponent;
  let fixture: ComponentFixture<AdminactividadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminactividadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminactividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
