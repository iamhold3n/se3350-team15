import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaInfoComponent } from './ta-info.component';

describe('TaInfoComponent', () => {
  let component: TaInfoComponent;
  let fixture: ComponentFixture<TaInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
