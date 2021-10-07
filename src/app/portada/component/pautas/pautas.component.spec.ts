import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PautasComponent } from './pautas.component';

describe('PautasComponent', () => {
  let component: PautasComponent;
  let fixture: ComponentFixture<PautasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PautasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PautasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
