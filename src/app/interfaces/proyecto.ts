export interface Proyecto {
  id_proyecto: number;
  nombre_proyecto: string;
  director_proyecto: string;
  fecha_pdv: Date;
  fecha_rodaje: Date;
  lugar: string;
  descripcion: string;
  personajes?: Personaje[];
}

export interface Personaje {
  id_personaje?: number | null;
  rol?: string;
  descripcion?: string;
}


