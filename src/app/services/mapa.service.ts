import { Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';


@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  zoom = 9; // Nivel de zoom inicial mejorado para ver la ubicación específica

  constructor() {
    mapboxgl.accessToken = (window as any).MAPBOX_KEY;
  }

  buildMap(container: string, center: [number, number]): Promise<mapboxgl.Map> {
    return new Promise((resolve, reject) => {
      try {
        this.map = new mapboxgl.Map({
          container: container,
          style: this.style,
          zoom: this.zoom,
          center: center,
          attributionControl: false,
        });

        // Esperar a que el mapa se cargue completamente
        this.map.on('load', () => {
          this.map.flyTo({ center: center });
          resolve(this.map);
        });

        this.map.on('error', (e) => {
          reject(e);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  addMarker(lngLat: [number, number]): mapboxgl.Marker {
    const marker = new mapboxgl.Marker({ anchor: 'center' })
      .setLngLat(lngLat)
      .addTo(this.map);
    return marker;
  }
}
