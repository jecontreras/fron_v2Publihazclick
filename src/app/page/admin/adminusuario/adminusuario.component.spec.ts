import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminusuarioComponent } from './adminusuario.component';

describe('AdminusuarioComponent', () => {
  let component: AdminusuarioComponent;
  let fixture: ComponentFixture<AdminusuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminusuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminusuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
