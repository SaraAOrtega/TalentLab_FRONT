import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActorService } from '../../services/actor.service';
import { Actor } from '../../interfaces/actor';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personaje-actor-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './personaje-actor-list.component.html',
  styleUrl: './personaje-actor-list.component.css'
})
export class PersonajeActorListComponent implements OnInit {
  personajeId!: number;
  proyectoId!: number; // Asegúrate de que esta propiedad esté definida
  actoresAsociados: Actor[] = [];
  todosActores: Actor[] = [];

  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actorService: ActorService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const personajeIdParam = params.get('personajeId');
      console.log('personajeIdParam:', personajeIdParam);  // Depuración
      if (personajeIdParam) {
        this.personajeId = +personajeIdParam;
      } else {
        console.error('No se proporcionó ID de personaje');
      }
  
      this.route.queryParamMap.subscribe(queryParams => {
        const proyectoIdParam = queryParams.get('proyectoId');
        console.log('proyectoIdParam:', proyectoIdParam);  // Depuración
        if (proyectoIdParam) {
          this.proyectoId = +proyectoIdParam;
        } else {
          console.error('No se proporcionó ID de proyecto');
        }
  
        // Cargar actores asociados si ambos IDs están definidos
        if (this.personajeId && this.proyectoId) {
          this.cargarActoresAsociados();
        }
      });
    });
  }

  cargarActoresAsociados(): void {
    console.log('Cargando actores para el personaje ID:', this.personajeId);
    this.actorService.getActoresAsociadosConPersonaje(this.personajeId).subscribe({
      next: (actores) => {
        this.actoresAsociados = actores;
        console.log('Actores cargados:', actores);
      },
      error: (error) => console.error('Error al cargar los actores', error)
    });
  
  }

  eliminarActor(actorId: number): void {
    if (this.personajeId) {
      this.actorService.desasociarActorDePersonaje(this.personajeId, actorId).subscribe({
        next: () => {
          this.actoresAsociados = this.actoresAsociados.filter(actor => actor.id_actor !== actorId);
          this.toastr.success('Actor eliminado con éxito');
        },
        error: (error) => {
          this.toastr.error('Error al eliminar el actor');
          console.error('Error:', error);
        }
      });
    }
  }

  navegarAgregarActores(): void {
    if (this.personajeId && this.proyectoId) {
      this.router.navigate(['/actors-list'], { 
        queryParams: { 
          personajeId: this.personajeId, 
          proyectoId: this.proyectoId,
          modo: 'seleccion'
        } 
      });
    } else {
      console.error('personajeId o proyectoId no definidos');
      this.toastr.error('No se pudo navegar: falta información del personaje o proyecto');
    }
  }
}
