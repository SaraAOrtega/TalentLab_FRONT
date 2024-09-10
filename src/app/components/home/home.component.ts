import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MapComponent } from '../map/map.component';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ RouterLink, MapComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
