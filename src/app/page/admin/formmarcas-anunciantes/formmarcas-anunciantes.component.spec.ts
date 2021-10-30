import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormmarcasAnunciantesComponent } from './formmarcas-anunciantes.component';

describe('FormmarcasAnunciantesComponent', () => {
  let component: FormmarcasAnunciantesComponent;
  let fixture: ComponentFixture<FormmarcasAnunciantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormmarcasAnunciantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormmarcasAnunciantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
