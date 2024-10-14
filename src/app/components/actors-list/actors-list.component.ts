import { Component, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { ActorService } from '../../services/actor.service';
import { Actor } from '../../interfaces/actor';
import { ActorPerfilComponent } from '../actor-perfil/actor-perfil.component';
import { environment } from '../../environment/environment';

interface ActorFilters {
  nombre_actor: string;
  edad_min: number;
  edad_max: number;
  sexo: string;
  altura_min: number;
  altura_max: number;
  complexion: string;
  color_ojos: string;
  color_pelo: string;
  tipo_pelo: string;
  corte_pelo: string;
  tez: string;
  idiomas: string;
  skills: string;
  carnet_conducir: boolean | null;
}

@Component({
  selector: 'app-actors-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatButtonModule,  
    MatCardModule,
    MatSelectModule, 
    MatIconModule,
  ],
  templateUrl: './actors-list.component.html',
  styleUrls: ['./actors-list.component.css'],
})
export class ActorsListComponent implements OnInit {
  actores: Actor[] = [];
  actoresAsociados: Actor[] = [];
  selectedActors: Set<number> = new Set<number>();
  loading = false;
  personajeId: number | null = null;
  proyectoId: number | null = null;
  filteredApplied: boolean = false;
  actorsFetched: boolean = false;

  filters: ActorFilters = {
    nombre_actor: '',
    edad_min: 18,
    edad_max: 80,
    sexo: '',
    altura_min: 150,
    altura_max: 200,
    complexion: '',
    color_ojos: '',
    color_pelo: '',
    tipo_pelo: '',
    corte_pelo: '',
    tez: '',
    idiomas: '',
    skills: '',
    carnet_conducir: null
  };

  private actorService = inject(ActorService);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.personajeId = params['personajeId'] ? +params['personajeId'] : null;
      this.proyectoId = params['proyectoId'] ? +params['proyectoId'] : null;
      
      if (this.personajeId) {
        this.getActoresAsociados(this.personajeId);
      }
    });
  }

  getFullImageUrl(relativePath: string | undefined | null): string {
    if (!relativePath) {
      return 'assets/logo.png'; // Ruta por defecto si no hay imagen
    }
    
    // Aquí deberías usar la URL de Cloudinary directamente
    return relativePath; // Asumiendo que relativePath ya es la URL completa de Cloudinary
  }
  

  handleImageError(event: any): void {
    event.target.src = 'assets/logo.png'
  }

  getActores(): void {
    this.loading = true;
    const filtrosAplicados = this.obtenerFiltrosAplicados();

    this.actorService.getActoresConFiltros(filtrosAplicados).pipe(
      finalize(() => {
        this.loading = false;
        this.actorsFetched = true;
      })
    ).subscribe({
      next: (actores: Actor[]) => {
        this.actores = actores.filter(actor => 
          !this.actoresAsociados.some(a => a.id_actor === actor.id_actor)
        );
      },
      error: (e) => {
        this.toastr.error('No se pudo obtener la lista de actores');
      }
    });
  }

  getActoresAsociados(personajeId: number): void {
    this.actorService.getActoresAsociadosConPersonaje(personajeId).subscribe({
      next: (actoresAsociados: Actor[]) => {
        this.actoresAsociados = actoresAsociados;
      },
      error: (e) => {
        this.toastr.error('Hubo un problema al obtener la lista de actores asociados');
      }
    });
  }

  obtenerFiltrosAplicados(): Partial<ActorFilters> {
    return Object.entries(this.filters).reduce((acc, [key, value]) => {
      
      if (value !== null && value !== '') {
        acc[key as keyof ActorFilters] = value;
      }
      return acc;
    }, {} as Partial<ActorFilters>);
  }

  aplicarFiltros(): void {
    this.filteredApplied = true;
    this.getActores();
  }

  verTodosLosActores(): void {
    this.resetFiltros();
    this.filteredApplied = true;
    this.getActores();
  }

  resetFiltros(): void {
    this.filters = {
      nombre_actor: '',
      edad_min: 18,
      edad_max: 80,
      sexo: '',
      altura_min: 150,
      altura_max: 200,
      complexion: '',
      color_ojos: '',
      color_pelo: '',
      tipo_pelo: '',
      corte_pelo: '',
      tez: '',
      idiomas: '',
      skills: '',
      carnet_conducir: null
    };
    this.filteredApplied = false;
    this.actorsFetched = false;
    this.actores = [];
  }

  onSelectActor(actorId: number): void {
    if (this.selectedActors.has(actorId)) {
      this.selectedActors.delete(actorId);
    } else {
      this.selectedActors.add(actorId);
    }
  }

  asociarActoresConPersonaje(): void {
    if (!this.proyectoId || this.personajeId === null) {
      this.toastr.error('ID del proyecto o personaje no disponible');
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
          this.router.navigate(['/editar-proyecto', this.proyectoId]);
        } else {
          this.toastr.warning('La asociación fue procesada, pero la respuesta no fue la esperada');
        }
      },
      error: (e) => {
        console.error('Error al asociar actores:', e);
        this.toastr.error('No se pudo asociar los actores al personaje');
      }
    });
  }

  abrirPerfilActor(actor: Actor): void {
    this.dialog.open(ActorPerfilComponent, {
      width: '1300px',       // Ancho del diálogo
      maxWidth: '90vw',      // Máximo ancho relativo al viewport
      data: actor
    });
  }
  

  volverAProyecto(): void {
    if (this.proyectoId) {
      this.router.navigate(['/editar-proyecto', this.proyectoId]);
    } else {
      this.router.navigate(['/proyectosList']);
    }
  }
}