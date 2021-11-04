import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmintestimoniosComponent } from './admintestimonios.component';

describe('AdmintestimoniosComponent', () => {
  let component: AdmintestimoniosComponent;
  let fixture: ComponentFixture<AdmintestimoniosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmintestimoniosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmintestimoniosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
