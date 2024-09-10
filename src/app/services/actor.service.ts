import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Actor } from '../interfaces/actor';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ActorService {
  private readonly myAppUrl: string = environment.endpoint;
  private readonly actoresApiUrl: string = 'api/actores';
  private readonly asociarApiUrl: string = 'api/personajes';

  constructor(private http: HttpClient) {}

  // actores con filtros
  getActoresConFiltros(
    filters: any,
    page: number = 1,
    limit: number = 100
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    // Solo agregar filtros que no sean nulos, undefined o vacíos
    Object.keys(filters).forEach((key) => {
      if (
        filters[key] !== null &&
        filters[key] !== undefined &&
        filters[key] !== ''
      ) {
        // Convierte los valores booleanos a cadenas
        if (typeof filters[key] === 'boolean') {
          params = params.append(key, filters[key] ? 'true' : 'false');
        } else {
          params = params.append(key, filters[key].toString());
        }
      }
    });

    return this.http
      .get<any>(`${this.myAppUrl}${this.actoresApiUrl}`, { params })
      .pipe(
        map((response) => {
          let actors: Actor[] = Array.isArray(response)
            ? response
            : response && Array.isArray(response.actors)
            ? response.actors
            : [];
          return actors.map((actor) => ({
            ...actor,
            fullImageUrl: this.getFullImageUrl(actor.foto_actor),
          }));
        }),
        catchError(this.handleError)
      );
  }

  getFullImageUrl(relativePath: string | undefined | null): string {
    if (!relativePath) {
      return 'assets/logo.png'; // Imagen por defecto
    }
    const fullUrl = `${this.myAppUrl}uploads/${relativePath}`;

    return fullUrl;
  }

  asociarActoresConPersonaje(
    personajeId: number,
    actorIds: number[]
  ): Observable<HttpResponse<any>> {
    if (
      typeof personajeId !== 'number' ||
      isNaN(personajeId) ||
      !Array.isArray(actorIds) ||
      !actorIds.every((id) => typeof id === 'number' && !isNaN(id))
    ) {
      return throwError(() => new Error('Datos inválidos para la solicitud.'));
    }

    const payload = { personajeId, actorId: actorIds };

    return this.http
      .post<any>(
        `${this.myAppUrl}${this.asociarApiUrl}/${personajeId}/asociar-actor-personaje`,
        payload,
        { observe: 'response' }
      )
      .pipe(
        map((response) => {
          if (response.status === 200) {
            return response;
          } else {
            throw new Error('La respuesta del servidor no fue la esperada');
          }
        }),
        catchError(this.handleError)
      );
  }

  // Método para obtener los actores ya asociados con un personaje
  getActoresAsociadosConPersonaje(personajeId: number): Observable<Actor[]> {
    return this.http
      .get<Actor[]>(
        `${this.myAppUrl}${this.asociarApiUrl}/${personajeId}/actores-asociados`
      )
      .pipe(
        catchError((error) => {
          if (error.status === 404) {
            return of([]);
          }
          return throwError(
            () =>
              new Error(`Error al obtener actores asociados: ${error.message}`)
          );
        })
      );
  }

  desasociarActorDePersonaje(
    personajeId: number,
    actorId: number
  ): Observable<any> {
    return this.http.delete(
      `${this.myAppUrl}${this.asociarApiUrl}/personaje-actor/${personajeId}/actores/${actorId}`
    );
  }

  // Manejo de errores común
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Un error desconocido ha ocurrido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage =
        `Código de error ${error.status}, ` +
        `mensaje: ${error.error.message || error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
