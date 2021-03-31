import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertTaComponent } from './insert-ta.component';

describe('InsertTaComponent', () => {
  let component: InsertTaComponent;
  let fixture: ComponentFixture<InsertTaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertTaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertTaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
