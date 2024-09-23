
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ListProyectosComponent } from './components/list-proyectos/list-proyectos.component';
import { AddEditProyectoComponent } from './components/add-edit-proyecto/add-edit-proyecto.component';
import { ActorsListComponent } from './components/actors-list/actors-list.component';
import { PersonajeActorListComponent } from './components/personaje-actor-list/personaje-actor-list.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'proyectosList', component: ListProyectosComponent, canActivate: [AuthGuard] },
  { path: 'nuevo-proyecto', component: AddEditProyectoComponent, canActivate: [AuthGuard] },
  { path: 'editar-proyecto/:id', component: AddEditProyectoComponent, canActivate: [AuthGuard] },
  { path: 'actors-list', component: ActorsListComponent, canActivate: [AuthGuard] },
  { path: 'actors-list/:id', component: ActorsListComponent, canActivate: [AuthGuard] },
  { path: 'personaje-actor/:personajeId', component: PersonajeActorListComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];