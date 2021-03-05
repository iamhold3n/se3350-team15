import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitSpreadsheetComponent } from './submit-spreadsheet.component';

describe('SubmitSpreadsheetComponent', () => {
  let component: SubmitSpreadsheetComponent;
  let fixture: ComponentFixture<SubmitSpreadsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitSpreadsheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitSpreadsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
