import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Proyecto } from '../../interfaces/proyecto';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModalDeleteComponent } from '../modal-delete/modal-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { ProyectoService } from '../../services/proyecto.service';
;

@Component({
  selector: 'app-list-proyectos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list-proyectos.component.html',
  styleUrls: ['./list-proyectos.component.css']
})
export class ListProyectosComponent implements OnInit {
  listProyectos: Proyecto[] = [];
  loading: boolean = false;
  private dialogOpen: boolean = false; // Variable para controlar el estado del diálogo

  constructor(
    private _proyectoService: ProyectoService,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog
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
      }
    });
  }


  openDeleteDialog(id: number) {
    if (this.dialogOpen) {
      return; // No abrir un nuevo diálogo si ya hay uno abierto
    }

    this.dialogOpen = true; // Marcar que el diálogo está abierto

    const dialogRef = this.dialog.open(ModalDeleteComponent, {
      width: '500px',
      height: '200px',
      disableClose: true,
      position: {
        left: '35%',
        top: '10%'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogOpen = false; // Marcar que el diálogo está cerrado

      if (result) {
        this.deleteProyecto(id);
      }
    });
  }

  deleteProyecto(id: number) {
    this._proyectoService.deleteProyecto(id).subscribe(() => {
      this.getProyectos();
      this.toastr.warning('Employee deleted successfully', 'Employee deleted');
    });
  }
}