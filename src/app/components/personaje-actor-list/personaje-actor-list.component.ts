import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ActorService } from '../../services/actor.service';
import { Actor } from '../../interfaces/actor';
import { ToastrService } from 'ngx-toastr';
import { ProyectoService } from '../../services/proyecto.service'
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ActorPerfilComponent } from '../actor-perfil/actor-perfil.component';
import { environment } from '../../environment/environment';
import { MatIcon } from '@angular/material/icon';



@Component({
  selector: 'app-personaje-actor-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIcon, RouterLink
  ],
  templateUrl: './personaje-actor-list.component.html',
  styleUrl: './personaje-actor-list.component.css',
})
export class PersonajeActorListComponent implements OnInit {
  personajeId!: number;
  proyectoId!: number; 
  nombreProyecto: string = '';
  actoresAsociados: Actor[] = [];
  todosActores: Actor[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actorService: ActorService,
    private proyectoService: ProyectoService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const personajeIdParam = params.get('personajeId');
      if (personajeIdParam) {
        this.personajeId = +personajeIdParam;
      } else {
        console.error('No se proporcionó ID de personaje');
      }
  
      this.route.queryParamMap.subscribe((queryParams) => {
        const proyectoIdParam = queryParams.get('proyectoId');
  
        if (proyectoIdParam) {
          this.proyectoId = +proyectoIdParam;
          this.cargarNombreProyecto(); // Cargar el nombre del proyecto aquí
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

  cargarNombreProyecto(): void {
    this.proyectoService.getProyecto(this.proyectoId).subscribe({
      next: (proyecto) => {
        this.nombreProyecto = proyecto.nombre_proyecto;
      },
      error: (error) => {
        console.error('Error al cargar el nombre del proyecto', error);
        this.toastr.error('No se pudo cargar el nombre del proyecto');
      }
    });
  }

  cargarActoresAsociados(): void {
    console.log('Cargando actores para el personaje ID:', this.personajeId);
    this.actorService
      .getActoresAsociadosConPersonaje(this.personajeId)
      .subscribe({
        next: (actores) => {
          this.actoresAsociados = actores;
          console.log('Actores cargados:', actores);
        },
        error: (error) => console.error('Error al cargar los actores', error),
      });
  }

  eliminarActor(actorId: number): void {
    if (this.personajeId) {
      this.actorService
        .desasociarActorDePersonaje(this.personajeId, actorId)
        .subscribe({
          next: () => {
            this.actoresAsociados = this.actoresAsociados.filter(
              (actor) => actor.id_actor !== actorId
            );
            this.toastr.success('Actor eliminado con éxito');
          },
          error: (error) => {
            this.toastr.error('Error al eliminar el actor');
            console.error('Error:', error);
          },
        });
    }
  }

  navegarAgregarActores(): void {
    if (this.personajeId && this.proyectoId) {
      this.router.navigate(['/actors-list'], {
        queryParams: {
          personajeId: this.personajeId,
          proyectoId: this.proyectoId,
          modo: 'seleccion',
        },
      });
    } else {
      console.error('personajeId o proyectoId no definidos');
      this.toastr.error(
        'No se pudo navegar: falta información del personaje o proyecto'
      );
    }
  }

  abrirPerfilActor(actor: Actor): void {
    this.dialog.open(ActorPerfilComponent, {
      width: '750px',
      maxWidth: '90vw',
      data: actor,
    });
  }

  getFullImageUrl(relativePath: string | undefined | null): string {
    if (!relativePath) {
      return 'assets/logo.png';
    }
    return `${environment.endpoint}uploads/${relativePath}`;
  }

  volverAProyecto(): void {
    if (this.proyectoId) {
      this.router.navigate(['/editar-proyecto', this.proyectoId]);
    } else {
      this.router.navigate(['/proyectosList']);
    }
  }


  

  handleImageError(event: any): void {
    event.target.src = 'assets/default-actor-image.jpg';
  }
}
