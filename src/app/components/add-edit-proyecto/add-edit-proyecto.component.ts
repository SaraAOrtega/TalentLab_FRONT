import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProyectoService } from '../../services/proyecto.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Proyecto } from '../../interfaces/proyecto';
import { Personaje } from '../../interfaces/proyecto';
import { ToastrService } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-proyecto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatDialogModule],
  templateUrl: './add-edit-proyecto.component.html',
  styleUrls: ['./add-edit-proyecto.component.css']
})
export class AddEditProyectoComponent implements OnInit {
  proyectoForm: FormGroup;
  isEditMode: boolean = false;
  proyectoId: number | null = null;
  

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private proyectoService: ProyectoService,
    private toastr: ToastrService
  ) {
    this.proyectoForm = this.fb.group({
      nombre_proyecto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]],
      director_proyecto: ['', [Validators.required, Validators.minLength(3)]],
      fecha_pdv: ['', [Validators.required, this.fechaValidator()]],
      fecha_rodaje: ['', [Validators.required, this.fechaValidator()]],
      lugar: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      personajes: this.fb.array([])
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

  get personajes() {
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
      next: (proyecto) => {
        this.proyectoForm.patchValue(proyecto);
        proyecto.personajes?.forEach(personaje => {
          this.personajes.push(this.crearPersonajeFormGroup(personaje));
        });
      },
      error: (error) => {
        console.error('Error al cargar el proyecto:', error);
        this.toastr.error('No se pudo cargar el proyecto');
      }
    });
  }

  crearPersonajeFormGroup(personaje: any = {}) {
    return this.fb.group({
      id_personaje: [personaje.id_personaje], 
      rol: [personaje.rol || '', Validators.required],
      descripcion: [personaje.descripcion || ''],
    });
  }

  agregarPersonaje() {
    this.personajes.push(this.crearPersonajeFormGroup());
  }

  eliminarPersonaje(index: number) {
    const personaje = this.personajes.at(index);
    const personajeId = personaje.get('id_personaje')?.value;

    if (personajeId && this.isEditMode && this.proyectoId) {
      if (confirm('¿Estás seguro de que quieres eliminar este personaje? Esta acción no se puede deshacer.')) {
        this.proyectoService.deletePersonaje(this.proyectoId, personajeId).subscribe({
          next: () => {
            this.personajes.removeAt(index);
            this.toastr.success('Personaje eliminado con éxito');
          },
          error: (e) => {
            console.error('Error al eliminar el personaje:', e);
            this.toastr.error('No se pudo eliminar el personaje. Por favor, inténtalo de nuevo.');
          }
        });
      }
    } else {
      this.personajes.removeAt(index);
    }
  }

  isFormValidForUpdate(): boolean {
    if (!this.proyectoForm.valid) return false;
    
    if (this.personajes.length === 0) return false;
    
    for (let personajeControl of this.personajes.controls) {
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

    this.guardarProyecto()
      .then((proyectoId) => {
        this.toastr.success('Proyecto guardado con éxito');
        this.router.navigate(['/proyectosList']);
      })
      .catch((error) => {
        if (typeof error === 'string') {
          this.toastr.error(error);
        } else {
          this.toastr.error('Error al guardar el proyecto. Por favor, inténtalo de nuevo.');
        }
      });
  }

  guardarProyecto(): Promise<number> {
    return new Promise((resolve, reject) => {
      // Verifica si el formulario es válido
      if (!this.proyectoForm.valid) {
        this.proyectoForm.markAllAsTouched();
        reject('Formulario inválido');
        return;
      }
  
      // Prepara los datos del proyecto
      const proyecto: Proyecto = {
        id: this.proyectoId,
        ...this.proyectoForm.value,
        personajes: this.personajes.value.map((p: Personaje) => ({
          ...p,
          id_personaje: (p.id_personaje ?? 0) > 0 ? p.id_personaje : null
        }))
      };
  
      if (this.isEditMode && this.proyectoId != null) {
        // Modo edición: actualiza el proyecto existente
        const proyectoIdNumber = Number(this.proyectoId);
        if (isNaN(proyectoIdNumber)) {
          reject('ID del proyecto inválido');
          return;
        }
  
        this.proyectoService.updateProyecto(proyectoIdNumber, proyecto).subscribe({
          next: (res: any) => {
            this.actualizarIDsPersonajes(res.proyecto.personajes);
            resolve(proyectoIdNumber); // Resolver con el ID del proyecto existente
          },
          error: (e) => {
            console.error('Error al actualizar el proyecto:', e);
            this.toastr.error(e.error?.message || 'Error al actualizar el proyecto');
            reject(e);
          }
        });
      } else if (!this.isEditMode) { // Asegúrate de manejar la creación solo si no es modo edición
        // Modo creación: crea un nuevo proyecto
        this.proyectoService.createProyecto(proyecto).subscribe({
          next: (res: any) => {
            this.proyectoId = res.proyecto.id_proyecto; // Asigna el ID del proyecto creado
            if (this.proyectoId === null || this.proyectoId === undefined) {
              reject('Error: ID del proyecto no válido después de la creación');
              return;
            }
            this.isEditMode = true;
            this.actualizarIDsPersonajes(res.proyecto.personajes);
            resolve(this.proyectoId); // Resolver con el nuevo ID del proyecto
          },
          error: (e) => {
            console.error('Error al crear el proyecto:', e);
            this.toastr.error(e.error?.message || 'Error al crear el proyecto');
            reject(e);
          }
        });
      } else {
        reject('Error: Modo no válido');
      }
    });
  }
  
  private actualizarIDsPersonajes(personajesActualizados: Personaje[] = []) {
    const personajesFormArray = this.proyectoForm.get('personajes') as FormArray;
  
    // Verifica que `personajesFormArray` es un `FormArray` válido
    if (!personajesFormArray || !Array.isArray(personajesActualizados)) {
      console.warn('El array de personajes está vacío o no es un array.');
      return;
    }
  
    personajesActualizados.forEach((personaje, index) => {
      // Verifica que el índice no se salga del rango del FormArray
      const formArrayItem = personajesFormArray.at(index);
      if (formArrayItem) {
        const currentId = formArrayItem.get('id_personaje')?.value;
        if (currentId < 0 || personaje.id_personaje) {
          formArrayItem.patchValue({
            id_personaje: personaje.id_personaje || currentId
          });
        }
      }
    });
  }
  

  abrirSeleccionActores() {
    this.guardarProyecto()
      .then((proyectoId) => {
        const ultimoPersonaje = this.personajes.at(-1);
        const personajeId = ultimoPersonaje.get('id_personaje')?.value;
  
        if (!personajeId) {
          this.toastr.error('Error: ID del personaje no disponible');
          return;
        }
  
        console.log('Navegando a selección de actores. PersonajeId:', personajeId, 'ProyectoId:', proyectoId);
        this.router.navigate(['/actors-list'], {
          queryParams: {
            personajeId: personajeId,
            proyectoId: proyectoId
          }
        });
      })
      .catch((error) => {
        const errorMessage = typeof error === 'string' ? error : 'Error al guardar el proyecto. Por favor, inténtalo de nuevo.';
        this.toastr.error(errorMessage);
      });
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