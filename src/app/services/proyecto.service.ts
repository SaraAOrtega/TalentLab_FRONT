import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proyecto } from '../interfaces/proyecto';

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

  updateProyecto(id: number, proyecto: Proyecto): Observable<any> {
    return this.http.put(`${this.myAppUrl}${this.myApiUrl}${id}`, proyecto);
  }
}