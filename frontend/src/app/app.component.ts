import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { slider } from './animations'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slider]
})
export class AppComponent implements OnInit {
  title = 'KPNC Geolocater';

  prepareRoute(outlet: RouterOutlet) {
    return outlet.isActivated ? outlet.activatedRoute: '';
  }

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }

      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    });
  }
}
