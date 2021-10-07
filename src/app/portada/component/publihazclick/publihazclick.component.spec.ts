import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublihazclickComponent } from './publihazclick.component';

describe('PublihazclickComponent', () => {
  let component: PublihazclickComponent;
  let fixture: ComponentFixture<PublihazclickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublihazclickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublihazclickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
