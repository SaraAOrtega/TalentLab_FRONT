import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProyectoComponent } from './add-edit-proyecto.component';

describe('AddEditProyectoComponent', () => {
  let component: AddEditProyectoComponent;
  let fixture: ComponentFixture<AddEditProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditProyectoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
