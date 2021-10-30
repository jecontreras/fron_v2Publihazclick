import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcasAnunciantesComponent } from './marcas-anunciantes.component';

describe('MarcasAnunciantesComponent', () => {
  let component: MarcasAnunciantesComponent;
  let fixture: ComponentFixture<MarcasAnunciantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarcasAnunciantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarcasAnunciantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
