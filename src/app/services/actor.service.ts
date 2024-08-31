import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { Actor } from '../interfaces/actor';

@Injectable({
  providedIn: 'root'
})
export class ActorService {
  private readonly myAppUrl: string = 'http://localhost:3001/';
  private readonly actoresApiUrl: string = 'api/actores';
  private readonly asociarApiUrl: string = 'api/personajes';

  constructor(private http: HttpClient) {}

  // Método existente para obtener la lista de actores
  getActores(): Observable<Actor[]> {
    return this.http.get<Actor[]>(`${this.myAppUrl}${this.actoresApiUrl}`).pipe(
      catchError(this.handleError)
    );
  }

  // Método existente para asociar actores con un personaje
  asociarActoresConPersonaje(personajeId: number, actorIds: number[]): Observable<HttpResponse<any>> {
    if (typeof personajeId !== 'number' || isNaN(personajeId) || !Array.isArray(actorIds) || !actorIds.every(id => typeof id === 'number' && !isNaN(id))) {
      return throwError(() => new Error('Datos inválidos para la solicitud.'));
    }

    const payload = { personajeId, actorId: actorIds }; // Asegúrate de que el nombre del campo coincida con el backend

    console.log('Payload a enviar:', payload);

    return this.http.post<any>(
      `${this.myAppUrl}${this.asociarApiUrl}/${personajeId}/asociar-actor-personaje`,
      payload,
      { observe: 'response' }
    ).pipe(
      map(response => {
        if (response.status === 200) {
          return response;
        } else {
          throw new Error('La respuesta del servidor no fue la esperada');
        }
      }),
      catchError(this.handleError)
    );
  }

  // Nuevo método para obtener los actores ya asociados con un personaje
  getActoresAsociadosConPersonaje(personajeId: number): Observable<Actor[]> {
    return this.http.get<Actor[]>(`${this.myAppUrl}${this.asociarApiUrl}/${personajeId}/actores-asociados`)
      .pipe(
        catchError((error) => {
          if (error.status === 404) {
            // Si no hay actores asociados, devolvemos un array vacío
            return of([]);
          }
          // Para otros errores, los propagamos
          return throwError(() => new Error(`Error al obtener actores asociados: ${error.message}`));
        })
      );
  }

  desasociarActorDePersonaje(personajeId: number, actorId: number): Observable<any> {
    return this.http.delete(`${this.myAppUrl}${this.asociarApiUrl}/personaje-actor/${personajeId}/actores/${actorId}`);
  }

  // Manejo de errores común
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Un error desconocido ha ocurrido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend retornó un código de respuesta no exitoso
      errorMessage = `Código de error ${error.status}, ` +
                     `mensaje: ${error.error.message || error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
