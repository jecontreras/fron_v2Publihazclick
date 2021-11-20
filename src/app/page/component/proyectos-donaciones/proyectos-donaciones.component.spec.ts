import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosDonacionesComponent } from './proyectos-donaciones.component';

describe('ProyectosDonacionesComponent', () => {
  let component: ProyectosDonacionesComponent;
  let fixture: ComponentFixture<ProyectosDonacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProyectosDonacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectosDonacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
