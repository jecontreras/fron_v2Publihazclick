import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsTestimoniosComponent } from './tools-testimonios.component';

describe('ToolsTestimoniosComponent', () => {
  let component: ToolsTestimoniosComponent;
  let fixture: ComponentFixture<ToolsTestimoniosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolsTestimoniosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsTestimoniosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
