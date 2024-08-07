export interface Proyecto {
    id_proyecto: number;
    user_id?: number;
    nombre_proyecto: string;
    director_proyecto: string;
    fecha_pdv?: Date;
    fecha_rodaje?: Date;
    descripcion?: string;
  }
  