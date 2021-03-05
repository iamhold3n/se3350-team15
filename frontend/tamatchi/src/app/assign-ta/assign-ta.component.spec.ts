import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignTaComponent } from './assign-ta.component';


describe('AssignTaComponent', () => {
  let component: AssignTaComponent;
  let fixture: ComponentFixture<AssignTaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignTaComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignTaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
