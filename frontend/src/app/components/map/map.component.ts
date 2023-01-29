import { Component, AfterViewInit, Input } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @Input() long!: string;
  @Input() lat!: string;
  map!: L.Map;

  initMap(): void {
    this.map = L.map('map').setView([Number(this.lat), Number(this.long)], 11);
      
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      maxZoom: 18,
      attribution: "<a href='https://www.openstreetmap.org/about' target='_blank'>OSM</a> | <a href='https://www.mapbox.com/' target='_blank'>MB</a>",
      id: 'mapbox/dark-v10',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoiYWxiaWU2NTQ0IiwiYSI6ImNsZGF3ZmYzNjBuYW0zbnJvMHhhbXdsY3QifQ.1PTu48ZvlOzdoKuGk-IDOw'
    }).addTo(this.map);

    L.circle([ Number(this.lat), Number(this.long)], {
      color: '#1472FC',
      fillColor: '#1472FC',
      fillOpacity: 0.5,
      radius: 5000
    }).addTo(this.map);
  }

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }
}