import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private router: Router, private ngZone: NgZone) {}

  routerLink(route: any[]): void {
    this.ngZone.run(() => this.router.navigate(route)).then();
  }
}
