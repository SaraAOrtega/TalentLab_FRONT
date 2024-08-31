import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private _personajeId: number | null = null;
  private _proyectoId: number | null = null;

  set personajeId(id: number | null) {
    this._personajeId = id;
  }

  get personajeId(): number | null {
    return this._personajeId;
  }

  set proyectoId(id: number | null) {
    this._proyectoId = id;
  }

  get proyectoId(): number | null {
    return this._proyectoId;
  }
}
