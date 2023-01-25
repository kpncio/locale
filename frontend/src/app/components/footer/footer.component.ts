import { Component, NgZone, OnInit } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  width: number | undefined;
  resize!: Subscription;

  constructor(private router: Router, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.resize = fromEvent(window, 'resize').subscribe( evt => {
      this.width = window.innerWidth;
    });

    this.width = window.innerWidth;
  }

  routerLink(route: any[]): void {
    this.ngZone.run(() => this.router.navigate(route)).then();
  }
}
