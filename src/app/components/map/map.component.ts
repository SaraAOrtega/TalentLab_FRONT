import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapboxService } from '../../services/mapa.service';

@Component({
  selector: 'app-map',
  standalone: true,
  template: '<div id="map" style="width: 92%; height: 350px;"></div>'
})
export class MapComponent implements OnInit, AfterViewInit {
  // Coordenadas del marcador para Calle Valencia 1944, Barcelona
  private markerCoordinates: [number, number] = [2.158992, 41.393784];

  constructor(private mapboxService: MapboxService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.mapboxService.buildMap('map', this.markerCoordinates)
    .then(map => {
      map.flyTo({ center: this.markerCoordinates, zoom: 15 });
      
      /*this.mapboxService.addMarker(this.markerCoordinates);*/
    })
    .catch(e => {
      console.error('Error initializing map', e);
    });
  
  }
}