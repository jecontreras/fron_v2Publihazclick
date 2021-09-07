import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimoniodshComponent } from './testimoniodsh.component';

describe('TestimoniodshComponent', () => {
  let component: TestimoniodshComponent;
  let fixture: ComponentFixture<TestimoniodshComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestimoniodshComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestimoniodshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
