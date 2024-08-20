import { Pipe, PipeTransform } from '@angular/core';
import { Proyecto } from '../interfaces/proyecto';

@Pipe({
  name: 'filterProyectos',
  standalone: true
})
export class FilterProyectosPipe implements PipeTransform {
  transform(proyectos: Proyecto[], searchTerm: string): Proyecto[] {
    if (!proyectos || !searchTerm) {
      return proyectos;
    }

    searchTerm = searchTerm.toLowerCase();

    return proyectos.filter(proyecto => 
      proyecto.nombre_proyecto.toLowerCase().includes(searchTerm) ||
      proyecto.director_proyecto.toLowerCase().includes(searchTerm)
    );
  }
}