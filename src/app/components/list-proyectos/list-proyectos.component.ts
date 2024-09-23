import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Proyecto } from '../../interfaces/proyecto';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModalDeleteComponent } from '../modal-delete/modal-delete.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProyectoService } from '../../services/proyecto.service';
import { FilterProyectosPipe } from '../../pipes/filter.proyectos.pipe';
import { ResumenProyectoComponent } from '../../resumen-proyecto/resumen-proyecto.component';

@Component({
  selector: 'app-list-proyectos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    FilterProyectosPipe,
    ModalDeleteComponent,
    MatDialogModule, // Añadido para usar MatDialog
  ],
  templateUrl: './list-proyectos.component.html',
  styleUrls: ['./list-proyectos.component.css'],
})
export class ListProyectosComponent implements OnInit {
  listProyectos: Proyecto[] = [];
  loading: boolean = false;
  searchTerm: string = '';
  showDeleteModal: boolean = false;
  projectToDelete: number | null = null;

  constructor(
    private _proyectoService: ProyectoService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProyectos();
  }

  getProyectos() {
    this.loading = true;
    this._proyectoService.getProyectos().subscribe({
      next: (data: Proyecto[]) => {
        this.listProyectos = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al obtener proyectos:', error);
        this.toastr.error('Error al cargar los proyectos', 'Error');
      },
    });
  }

  openDeleteDialog(id: number) {
    this.projectToDelete = id;
    this.showDeleteModal = true;
  }

  onConfirmDelete() {
    if (this.projectToDelete !== null) {
      this.deleteProyecto(this.projectToDelete);
    }
    this.showDeleteModal = false;
  }

  onCancelDelete() {
    this.showDeleteModal = false;
    this.projectToDelete = null;
  }

  deleteProyecto(id: number) {
    this._proyectoService.deleteProyecto(id).subscribe({
      next: () => {
        this.getProyectos();
        this.toastr.warning(
          'Proyecto eliminado exitosamente',
          'Proyecto eliminado'
        );
      },
      error: (error) => {
        console.error('Error al eliminar el proyecto:', error);
        this.toastr.error('Error al eliminar el proyecto', 'Error');
      },
    });
  }

  abrirResumenProyecto(proyecto: Proyecto): void {
    this.dialog.open(ResumenProyectoComponent, {
      width: '80vw',  // 80% del ancho de la ventana
      maxWidth: '700px',  // máximo de 1200px
      height: '90vh',  // 90% del alto de la ventana
      maxHeight: '90vh',  // máximo del 90% del alto de la ventana
      data: proyecto
    });
  }
}
