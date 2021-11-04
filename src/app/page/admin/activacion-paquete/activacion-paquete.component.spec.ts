import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivacionPaqueteComponent } from './activacion-paquete.component';

describe('ActivacionPaqueteComponent', () => {
  let component: ActivacionPaqueteComponent;
  let fixture: ComponentFixture<ActivacionPaqueteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivacionPaqueteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivacionPaqueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
