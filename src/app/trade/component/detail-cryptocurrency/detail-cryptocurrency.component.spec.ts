import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCryptocurrencyComponent } from './detail-cryptocurrency.component';

describe('DetailCryptocurrencyComponent', () => {
  let component: DetailCryptocurrencyComponent;
  let fixture: ComponentFixture<DetailCryptocurrencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailCryptocurrencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCryptocurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
