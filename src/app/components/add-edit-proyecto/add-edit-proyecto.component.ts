import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProyectoService } from '../../services/proyecto.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Proyecto } from '../../interfaces/proyecto';
import { ToastrService } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-proyecto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatDialogModule],
  templateUrl: './add-edit-proyecto.component.html',
  styleUrl: './add-edit-proyecto.component.css'
})
export class AddEditProyectoComponent implements OnInit {
  proyectoForm: FormGroup;
  isEditMode: boolean = false;
  proyectoId: number | null = null;

  private formBuilder = inject(FormBuilder);
  private proyectoService = inject(ProyectoService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);

  constructor() {
    this.proyectoForm = this.formBuilder.group({
      nombre_proyecto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]],
      director_proyecto: ['', [Validators.required, Validators.minLength(3)]],
      fecha_pdv: ['', [Validators.required, this.fechaValidator()]],
      fecha_rodaje: ['', [Validators.required, this.fechaValidator()]],
      lugar: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      personajes: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.proyectoId = +params['id'];
        this.cargarProyecto(this.proyectoId);
      }
    });
  }

  get personajesFormArray() {
    return this.proyectoForm.get('personajes') as FormArray;
  }


  fechaValidator() {
    return (control: any) => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const fecha = new Date(value);
      if (isNaN(fecha.getTime())) {
        return { fechaInvalida: true };
      }
      return null;
    };
  }

  cargarProyecto(id: number) {
    this.proyectoService.getProyecto(id).subscribe({
      next: (proyecto: Proyecto) => {
        this.proyectoForm.patchValue(proyecto);
        console.log("Personajes cargados:", proyecto.personajes);  // Verifica qué personajes se están cargando
        if (proyecto.personajes && proyecto.personajes.length > 0) {
          proyecto.personajes.forEach(personaje => {
            this.personajesFormArray.push(this.crearPersonajeFormGroup(personaje));
          });
        }
      },
      error: (e) => {
        console.error('Error al cargar el proyecto:', e);
        this.toastr.error('No se pudo cargar el proyecto');
      }
    });
  }

  crearPersonajeFormGroup(personaje: any = {}) {
    return this.formBuilder.group({
      rol: [personaje.rol || '', Validators.required],
      descripcion: [personaje.descripcion || ''],
    });
  }

  agregarPersonaje() {
    this.personajesFormArray.push(this.crearPersonajeFormGroup());
  }

  eliminarPersonaje(index: number) {
    this.personajesFormArray.removeAt(index);
  }

  isFormValidForUpdate(): boolean {
    if (!this.proyectoForm.valid) return false;
    
    if (this.personajesFormArray.length === 0) return false;
    
    for (let personajeControl of this.personajesFormArray.controls) {
      if (personajeControl.invalid) return false;
    }
    
    return true;
  }

  onSubmit() {
    if (this.isEditMode && !this.isFormValidForUpdate()) {
      this.toastr.error('Por favor, complete todos los campos requeridos, incluyendo los de los personajes.');
      return;
    }

    if (!this.proyectoForm.valid) {
      this.proyectoForm.markAllAsTouched();
      return;
    }


    const proyecto: Proyecto = {
      ...this.proyectoForm.value,
      personajes: this.personajesFormArray.value
    };

    console.log('Datos del proyecto a enviar:', JSON.stringify(proyecto, null, 2))

    if (this.isEditMode && this.proyectoId) {
      this.proyectoService.updateProyecto(this.proyectoId, proyecto).subscribe({
        next: (res: any) => {
          this.toastr.success('Proyecto actualizado con éxito');
          this.router.navigate(['/proyectosList']);
        },
        error: (e) => {
          console.error('Error al actualizar el proyecto:', e);
          this.toastr.error(e.error?.message || 'Error al actualizar el proyecto');
        }
      });
    } else {
      this.proyectoService.createProyecto(proyecto).subscribe({
        next: (res: any) => {
          this.toastr.success('Proyecto creado con éxito');
          this.router.navigate(['/proyectosList']);
        },
        error: (e) => {
          console.error('Error al crear el proyecto:', e);
          this.toastr.error(e.error?.message || 'Error al crear el proyecto');
        }
      });
    }
  }

  volverAListaProyectos() {
    if (this.proyectoForm.dirty) {
      if (confirm('Tienes cambios no guardados. ¿Estás seguro de que quieres salir?')) {
        this.router.navigate(['/proyectosList']);
      }
    } else {
      this.router.navigate(['/proyectosList']);
    }
  }

  
}