import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActorService } from '../../services/actor.service';
import { StateService } from '../../services/state.service';
import { ToastrService } from 'ngx-toastr';
import { Actor } from '../../interfaces/actor';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-actors-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actors-list.component.html',
  styleUrls: ['./actors-list.component.css']
})
export class ActorsListComponent implements OnInit {
  actores: Actor[] = [];
  actoresAsociados: Actor[] = []; // Para almacenar los actores ya asociados
  selectedActors: Set<number> = new Set<number>();
  loading = false;
  personajeId: number | null = null;
  proyectoId: number | null = null;
  filterText: string = '';

  private actorService = inject(ActorService);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

 ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    // Convertir parámetros a números si están presentes, de lo contrario asignar null
    this.personajeId = params['personajeId'] ? +params['personajeId'] : null;
    this.proyectoId = params['proyectoId'] ? +params['proyectoId'] : null;
    
    // Imprimir los parámetros recibidos para depuración
    console.log('Parámetros recibidos:', { personajeId: this.personajeId, proyectoId: this.proyectoId });
    
    // Verificar si se ha proporcionado un ID de personaje
    if (this.personajeId) {
      this.getActoresAsociados(this.personajeId);
    }
    
    // Cargar la lista de actores (sin necesidad de ID)
    this.getActores();
  });
}

  getActores(): void {
    this.loading = true;
    this.actorService.getActores().pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (actores: Actor[]) => {
        // Filtrar los actores para excluir los que ya están asociados con el personaje
        this.actores = actores.filter(actor => 
          !this.actoresAsociados.some(a => a.id_actor === actor.id_actor)
        );
        console.log('Actores disponibles:', this.actores);
      },
      error: (e) => {
        console.error('Error al obtener actores:', e);
        this.toastr.error('No se pudo obtener la lista de actores');
      }
    });
  }

  getActoresAsociados(personajeId: number): void {
    this.actorService.getActoresAsociadosConPersonaje(personajeId).subscribe({
      next: (actoresAsociados: Actor[]) => {
        this.actoresAsociados = actoresAsociados;
        if (actoresAsociados.length > 0) {
          console.log('Actores ya asociados:', this.actoresAsociados);
        } else {
          console.log('No hay actores asociados a este personaje.');
        }
      },
      error: (e) => {
        console.error('Error al obtener actores asociados:', e);
        this.toastr.error('Hubo un problema al obtener la lista de actores asociados');
      }
    });
  }

  onSelectActor(actorId: number): void {
    if (this.selectedActors.has(actorId)) {
      this.selectedActors.delete(actorId);
    } else {
      this.selectedActors.add(actorId);
    }
  }

  filterActors(): Actor[] {
    return this.actores.filter(actor => 
      actor.nombre_actor.toLowerCase().includes(this.filterText.toLowerCase()) ||
      actor.email_actor.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  asociarActoresConPersonaje(): void {
    if (!this.proyectoId) {
      this.toastr.error('ID del proyecto no disponible');
      console.error('proyectoId es null o undefined');
      return;
    }

    if (this.personajeId === null) {
      this.toastr.error('ID del personaje no disponible');
      console.error('personajeId es null');
      return;
    }

    const actorIds = Array.from(this.selectedActors);

    if (actorIds.length === 0) {
      this.toastr.warning('Por favor, seleccione al menos un actor');
      return;
    }

    console.log('Enviando datos:', { personajeId: this.personajeId, actorId: actorIds });

    this.actorService.asociarActoresConPersonaje(this.personajeId, actorIds).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.toastr.success('Actores asociados con éxito');
          if (this.proyectoId) {
            this.router.navigate(['/editar-proyecto', this.proyectoId]);
          } else {
            this.toastr.warning('No se pudo regresar al proyecto, ID no disponible');
          }
        } else {
          this.toastr.warning('La asociación fue procesada, pero la respuesta no fue la esperada');
        }
      },
      error: (e) => {
        console.error('Error completo al asociar actores:', e);
        this.toastr.error('No se pudo asociar los actores al personaje');
      }
    });
  }

  volverAProyecto(): void {
    if (this.proyectoId) {
      console.log('Navegando de vuelta al proyecto con ID:', this.proyectoId);
      this.router.navigate(['/editar-proyecto', this.proyectoId]);
    } else {
      console.error('ID del proyecto no disponible');
      this.router.navigate(['/proyectosList']);
    }
  }
}
