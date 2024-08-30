import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Proyecto, Personaje } from '../interfaces/proyecto';
import { Actor } from '../interfaces/actor';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = 'http://localhost:3001/';
    this.myApiUrl = 'api/proyectos/';
  }

  getProyectos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  getProyecto(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }

  deleteProyecto(id: number): Observable<any> {
    return this.http.delete(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }

  createProyecto(proyecto: Proyecto): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, proyecto);
  }

  updateProyecto(id: number, proyecto: Proyecto): Observable<Proyecto> {
    console.log('Actualizando proyecto:', { id, proyecto });
    return this.http.put<Proyecto>(`${this.myAppUrl}${this.myApiUrl}${id}`, proyecto).pipe(
      catchError((error) => {
        console.error('Error en la solicitud:', error);
        return throwError(() => new Error('Error al actualizar el proyecto. Por favor, inténtalo de nuevo.'));
      })
    );
  }

addPersonaje(proyectoId: number, personaje: Personaje): Observable<Personaje> {
  return this.http.post<Personaje>(`${this.myAppUrl}${this.myApiUrl}${proyectoId}/personajes`, personaje);
}

updatePersonaje(proyectoId: number, personajeId: number, personaje: Personaje): Observable<Personaje> {
  return this.http.put<Personaje>(`${this.myAppUrl}${this.myApiUrl}${proyectoId}/personajes/${personajeId}`, personaje);
}

deletePersonaje(proyectoId: number, personajeId: number): Observable<any> {
  return this.http.delete(`${this.myAppUrl}${this.myApiUrl}${proyectoId}/personajes/${personajeId}`);
}

asociarActoresConPersonaje(personajeId: number, actores: Actor[]): Observable<any> {
  const url = `${this.myAppUrl}api/personajes/${personajeId}/asociar-actor-personaje`;
  return this.http.post(url, { actores });
}
}
