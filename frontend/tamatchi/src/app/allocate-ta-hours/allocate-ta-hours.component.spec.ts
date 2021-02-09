import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateTaHoursComponent } from './allocate-ta-hours.component';

describe('AllocateTaHoursComponent', () => {
  let component: AllocateTaHoursComponent;
  let fixture: ComponentFixture<AllocateTaHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocateTaHoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocateTaHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
