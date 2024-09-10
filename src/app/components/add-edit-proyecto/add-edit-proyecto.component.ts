import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProyectoService } from '../../services/proyecto.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Proyecto, Personaje } from '../../interfaces/proyecto';
import { ToastrService } from 'ngx-toastr';
import { ModalDeleteComponent } from '../modal-delete/modal-delete.component';

@Component({
  selector: 'app-add-edit-proyecto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalDeleteComponent],
  templateUrl: './add-edit-proyecto.component.html',
  styleUrls: ['./add-edit-proyecto.component.css'],
})
export class AddEditProyectoComponent implements OnInit {
  proyectoForm: FormGroup;
  isEditMode: boolean = false;
  proyectoId: number | null = null;
  showDeleteModal: boolean = false;
  personajeIndexToDelete: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private proyectoService: ProyectoService,
    private toastr: ToastrService
  ) {
    this.proyectoForm = this.createForm();
  }

  ngOnInit() {
    this.checkEditMode();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombre_proyecto: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z ]*$'),
        ],
      ],
      director_proyecto: ['', [Validators.required, Validators.minLength(3)]],
      fecha_pdv: ['', [Validators.required, this.fechaValidator()]],
      fecha_rodaje: ['', [Validators.required, this.fechaValidator()]],
      lugar: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      personajes: this.fb.array([]),
    });
  }

  private checkEditMode() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.proyectoId = +params['id'];
        this.cargarProyecto(this.proyectoId);
      }
    });
  }

  private fechaValidator() {
    return (control: any) => {
      const fecha = new Date(control.value);
      return isNaN(fecha.getTime()) ? { fechaInvalida: true } : null;
    };
  }

  private cargarProyecto(id: number) {
    this.proyectoService.getProyecto(id).subscribe({
      next: (proyecto) => {
        this.proyectoForm.patchValue(proyecto);
        proyecto.personajes?.forEach((personaje) => {
          this.personajes.push(this.crearPersonajeFormGroup(personaje));
        });
      },
      error: () => this.toastr.error('No se pudo cargar el proyecto'),
    });
  }

  private crearPersonajeFormGroup(personaje: Personaje = {}): FormGroup {
    return this.fb.group({
      id_personaje: [personaje.id_personaje],
      rol: [personaje.rol || '', Validators.required],
      descripcion: [personaje.descripcion || ''],
    });
  }

  get personajes(): FormArray {
    return this.proyectoForm.get('personajes') as FormArray;
  }

  agregarPersonaje() {
    this.personajes.push(this.crearPersonajeFormGroup());
  }

  eliminarPersonaje(index: number) {
    console.log('Intentando eliminar personaje en índice:', index);
    this.personajeIndexToDelete = index;
    this.showDeleteModal = true;
    console.log('Modal de eliminación abierto:', this.showDeleteModal);
  }
  onConfirmDelete() {
    if (this.personajeIndexToDelete !== null) {
      const personaje = this.personajes.at(this.personajeIndexToDelete);
      const personajeId = personaje.get('id_personaje')?.value;

      if (personajeId && this.isEditMode && this.proyectoId) {
        this.proyectoService
          .deletePersonaje(this.proyectoId, personajeId)
          .subscribe({
            next: () => {
              this.personajes.removeAt(this.personajeIndexToDelete!);
              this.toastr.success('Personaje eliminado con éxito');
            },
            error: () =>
              this.toastr.error(
                'No se pudo eliminar el personaje. Por favor, inténtalo de nuevo.'
              ),
          });
      } else {
        this.personajes.removeAt(this.personajeIndexToDelete);
      }
    }
    this.closeDeleteModal();
  }

  onCancelDelete() {
    this.closeDeleteModal();
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.personajeIndexToDelete = null;
  }

  public isFormValidForUpdate(): boolean {
    return (
      this.proyectoForm.valid &&
      this.personajes.length > 0 &&
      this.personajes.controls.every((c) => c.valid)
    );
  }

  async onSubmit() {
    if (this.isEditMode && !this.isFormValidForUpdate()) {
      this.toastr.error(
        'Por favor, complete todos los campos requeridos, incluyendo los de los personajes.'
      );
      return;
    }

    if (!this.proyectoForm.valid) {
      this.proyectoForm.markAllAsTouched();
      return;
    }

    try {
      const proyectoId = await this.guardarProyecto();
      this.toastr.success('Proyecto guardado con éxito');
      this.router.navigate(['/proyectosList']);
    } catch (error) {
      this.toastr.error(
        typeof error === 'string'
          ? error
          : 'Error al guardar el proyecto. Por favor, inténtalo de nuevo.'
      );
    }
  }

  private async guardarProyecto(): Promise<number> {
    if (!this.proyectoForm.valid) throw 'Formulario inválido';

    const proyecto: Proyecto = {
      id: this.proyectoId,
      ...this.proyectoForm.value,
      personajes: this.personajes.value.map((p: Personaje) => ({
        ...p,
        id_personaje: p.id_personaje != null ? p.id_personaje : null,
      })),
    };

    if (this.isEditMode && this.proyectoId != null) {
      return this.actualizarProyecto(proyecto);
    } else {
      return this.crearProyecto(proyecto);
    }
  }

  private actualizarProyecto(proyecto: Proyecto): Promise<number> {
    return new Promise((resolve, reject) => {
      this.proyectoService
        .updateProyecto(this.proyectoId!, proyecto)
        .subscribe({
          next: (res: any) => {
            this.actualizarIDsPersonajes(res.proyecto.personajes);
            resolve(this.proyectoId!);
          },
          error: (e) =>
            reject(e.error?.message || 'Error al actualizar el proyecto'),
        });
    });
  }

  private crearProyecto(proyecto: Proyecto): Promise<number> {
    return new Promise((resolve, reject) => {
      this.proyectoService.createProyecto(proyecto).subscribe({
        next: (res: any) => {
          this.proyectoId = res.proyecto.id_proyecto;
          this.isEditMode = true;
          this.actualizarIDsPersonajes(res.proyecto.personajes);
          resolve(this.proyectoId!);
        },
        error: (e) => reject(e.error?.message || 'Error al crear el proyecto'),
      });
    });
  }

  private actualizarIDsPersonajes(personajesActualizados: Personaje[]) {
    personajesActualizados.forEach((personaje, index) => {
      const formArrayItem = this.personajes.at(index);
      if (formArrayItem) {
        formArrayItem.patchValue({ id_personaje: personaje.id_personaje });
      }
    });
  }

  abrirSeleccionActores() {
    this.guardarProyecto()
      .then((proyectoId) => {
        const personajeId = this.personajes.at(-1)?.get('id_personaje')?.value;
        if (!personajeId) {
          this.toastr.error('Error: ID del personaje no disponible');
          return;
        }
        this.router.navigate(['/actors-list'], {
          queryParams: { personajeId, proyectoId },
        });
      })
      .catch((error) =>
        this.toastr.error(
          typeof error === 'string'
            ? error
            : 'Error al guardar el proyecto. Por favor, inténtalo de nuevo.'
        )
      );
  }

  verActoresPersonaje(personajeId: number): void {
    if (personajeId && this.proyectoId) {
      console.log(
        'Navegando a /personaje-actor con personajeId:',
        personajeId,
        'y proyectoId:',
        this.proyectoId
      ); // Depuración
      this.router.navigate(['/personaje-actor', personajeId], {
        queryParams: { proyectoId: this.proyectoId },
      });
    } else {
      console.error('personajeId o proyectoId no definidos');
    }
  }

  volverAListaProyectos() {
    if (
      this.proyectoForm.dirty &&
      confirm(
        'Tienes cambios no guardados. ¿Estás seguro de que quieres salir?'
      )
    ) {
      this.router.navigate(['/proyectosList']);
    } else {
      this.router.navigate(['/proyectosList']);
    }
  }
}
