import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Actor } from '../../interfaces/actor';
import { environment } from '../../environment/environment';


@Component({
  selector: 'app-actor-perfil',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './actor-perfil.component.html',
  styleUrls: ['./actor-perfil.component.css']
})
export class ActorPerfilComponent {
  activeSlide: number = 0;
  totalSlides: number = 2; 

  constructor(
    public dialogRef: MatDialogRef<ActorPerfilComponent>,
    @Inject(MAT_DIALOG_DATA) public actor: Actor
  ) {}

  cerrarModal(): void {
    this.dialogRef.close();
  }

  getFullImageUrl(relativePath: string | undefined | null): string {
    if (!relativePath) {
      return 'assets/logo.png'; // Ruta por defecto si no hay imagen
    }
  
    // Comprobar si estamos en modo de producción
    if (environment.production) {
      // En producción, devolver la URL de Cloudinary directamente
      return relativePath; // Suponiendo que relativePath es la URL completa de Cloudinary
    } else {
      // En desarrollo, devolver la URL construida con el endpoint
      return `${environment.endpoint}uploads/${relativePath}`;
    }
  }

  handleImageError(event: any): void {
    event.target.src = 'assets/logo.png'
  }
  getTotalSlides(): number {
    return (this.actor.foto_actor ? 1 : 0) + (this.actor.foto2_actor ? 1 : 0);
  }

  prevSlide(): void {
    this.activeSlide = (this.activeSlide === 0) ? this.totalSlides - 1 : this.activeSlide - 1;
  }

  nextSlide(): void {
    this.activeSlide = (this.activeSlide === this.totalSlides - 1) ? 0 : this.activeSlide + 1;


}

}