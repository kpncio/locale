import { animate, group, query, style, transition, trigger } from "@angular/animations";

export const slider = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave',
      style({
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%'
      }),
    {optional: true}),
    query(':enter',
      style({
        right: '-100%'
      }),
      {optional: true}),
    group([
      query(':leave',
      animate('250ms ease', style({ right: '100%'})),
      {optional: true}),
      query(':enter',
      animate('250ms ease', style({ right: '0%'})),
      {optional: true})
    ])
  ])
]);
