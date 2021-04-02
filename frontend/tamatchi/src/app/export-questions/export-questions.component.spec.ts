import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportQuestionsComponent } from './export-questions.component';

describe('ExportQuestionsComponent', () => {
  let component: ExportQuestionsComponent;
  let fixture: ComponentFixture<ExportQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
