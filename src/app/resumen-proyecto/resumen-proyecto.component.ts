import { MatButtonModule } from '@angular/material/button';
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Proyecto } from '../interfaces/proyecto';
import { Personaje } from '../interfaces/personaje';
import { ProyectoService } from '../services/proyecto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resumen-proyecto',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './resumen-proyecto.component.html',
  styleUrl: './resumen-proyecto.component.css'
})
export class ResumenProyectoComponent implements OnInit {
  personajes: Personaje[] = [];

  constructor(
    public dialogRef: MatDialogRef<ResumenProyectoComponent>,
    @Inject(MAT_DIALOG_DATA) public proyecto: Proyecto,
    private proyectoService: ProyectoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarProyectoCompleto();
  }

  cargarProyectoCompleto() {
    this.proyectoService.getProyecto(this.proyecto.id_proyecto).subscribe({
      next: (proyectoCompleto) => {
        this.proyecto = proyectoCompleto;
        this.personajes = proyectoCompleto.personajes || [];
      },
      error: (error) => {
        console.error('Error al cargar el proyecto completo:', error);
      }
    });
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }

  editarProyecto(): void {
    this.dialogRef.close();
    this.router.navigate(['/editar-proyecto', this.proyecto.id_proyecto]);
  }

  verActoresPersonaje(personajeId: number): void {
    this.dialogRef.close();
    this.router.navigate(['/personaje-actor', personajeId], {
      queryParams: { proyectoId: this.proyecto.id_proyecto }
    });
  }
}