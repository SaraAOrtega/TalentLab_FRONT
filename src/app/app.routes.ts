
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { ListProyectosComponent } from './list-proyectos/list-proyectos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'proyectosList', component: ListProyectosComponent },
 
  /*
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },*/
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
