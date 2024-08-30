import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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

  getActores(): Observable<Actor[]> {
    return this.http.get<Actor[]>(`${this.myAppUrl}${this.actoresApiUrl}`).pipe(
      catchError(this.handleError)
    );
  }

  asociarActoresConPersonaje(personajeId: number, actorIds: number[]): Observable<HttpResponse<any>> {
    if (typeof personajeId !== 'number' || isNaN(personajeId) || !Array.isArray(actorIds) || !actorIds.every(id => typeof id === 'number' && !isNaN(id))) {
      return throwError(() => new Error('Datos inválidos para la solicitud.'));
    }
  
    const payload = { personajeId, actorId: actorIds }; // Asegúrate de que el nombre del campo coincida con el backend
  
    console.log('Payload a enviar:', payload);
  
    return this.http.post<any>(
      `${this.myAppUrl}${this.asociarApiUrl}/asociar-actor-personaje`,
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