import { FetchService } from 'src/app/services/fetch.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface IGeolocation {
  provided: {
    version: string;
    address: string;
    ray: string;
  };
  found: {
    zone: string;
    country: string;
    region: string;
    city: string;
    zip: string;
    latitude: string;
    longitude: string;
    cidr: string;
    asn: string;
    isp: string;
  };
  proxy: {
    detected: boolean;
    provider: string;
    type: string;
    usage: string;
    threat: string;
  };
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  response: IGeolocation | null = null;
  extra: IGeolocation | null = null;
  controlling: boolean = false;
  provider: string = 'GeoIP';
  loading: boolean = false;
  success: boolean = false;
  message: string = '';
  ip: string = '';

  constructor(private router: Router, private ngZone: NgZone, private fetch: FetchService) {}

  ngOnInit(): void {
    this.provider = 'GeoIP';
    this.retrieval('https://app.kpnc.io/locale/cloud/');
  }

  routerLink(route: any[]): void {
    this.ngZone.run(() => this.router.navigate(route)).then();
  }

  provided(): void {
    this.provider = this.provider == 'GeoIP' ? 'IP2Location' : 'GeoIP';
    this.retrieval(this.provider == 'GeoIP' ? 'https://app.kpnc.io/locale/cloud/' : 'https://app.kpnc.io/locale/local/');
  }

  changed(control: any): void {
    this.ip = control.value;
    this.controlling = true;
  }

  clicked(): void {
    this.provider = 'IP2Location';
    this.retrieval(`https://app.kpnc.io/locale/local/?ip=${this.ip}`);
  }

  retrieval(url: string, extra: boolean = false): void {
    let time = performance.now()

    if (!extra) {
      this.response = null;
      this.loading = true;
      this.message = '';
    }

    this.fetch.request(url).subscribe((response: IGeolocation) => {
      this.loading = false;

      if (extra) {
        this.extra = response;
      } else {
        this.response = response;
      }

      if (response.provided.version != '0') {
        this.success = true;
        this.message = `Data retrieved successfully (${Math.round(performance.now() - time)}ms)...`

        if (response.provided.version == '6' && this.provider == 'GeoIP') {
          this.retrieval('https://ip.kpnc-servers.net/', true);
        }
      } else {
        this.success = false;
        this.message = 'Error: Invalid IP address inputted...'
      }
    }, (_: any) => {
      this.loading = false;
      this.success = false;
      this.message = 'Error: Unknown error, try again...'
    });
  }
}
