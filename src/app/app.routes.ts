
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ListProyectosComponent } from './components/list-proyectos/list-proyectos.component';
import { AddEditProyectoComponent } from './components/add-edit-proyecto/add-edit-proyecto.component';
import { ActorsListComponent } from './components/actors-list/actors-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'proyectosList', component: ListProyectosComponent },
  { path: 'nuevo-proyecto', component: AddEditProyectoComponent },
  { path: 'editar-proyecto/:id', component: AddEditProyectoComponent },
  { path: 'actors-list', component: ActorsListComponent },
  /*
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  */
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];