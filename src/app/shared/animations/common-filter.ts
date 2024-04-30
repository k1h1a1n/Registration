import {
  trigger,
  sequence,
  state,
  stagger,
  animate,
  transition,
  style,
  query,
  animateChild,
} from '@angular/animations';

export const rowsAnimationEnter = trigger('rowsAnimation', [
  transition(':enter', [
    query(
      'td',
      [
        style({
          height: '*',
          opacity: '0',
          transform: 'translateX(-200px)',
          // 'box-shadow': 'inset 0px 1px 2px 0px #e0e0e0',
          background: '',
        }),
        stagger(
          60,
          sequence([
            animate(
              '790ms cubic-bezier(0.35, 0, 0.8, 1.2)',
              style({
                height: '*',
                opacity: '.8',
                transform: 'translateX(0)',
                // 'box-shadow': 'inset 0px 1px 3px 0px',
                // 'border-block-end-color': 'white',
                // background: 'crimson',
              })
            ),
            animate(
              '790ms cubic-bezier(0.35, 0, 0.45, 1)',
              style({
                height: '*',
                opacity: 1,
                transform: 'translateX(0)',
                // 'box-shadow': 'inset 0px 1px 3px 0px #e0e0e0',
                background: '',
              })
            ),
          ])
        ),
      ],
      { optional: true }
    ),
  ]),
  transition(':leave', [
    query(
      'td',
      [
        style({
          height: '*',
          opacity: '1',
          transform: 'translateX(0px)',
          // 'box-shadow': 'inset 0px 1px 2px 0px #e0e0e0',
          background: '',
        }),
        stagger(
          60,
          sequence([
            animate(
              '180ms cubic-bezier(0.35, 0, 0.45, 1)',
              style({
                height: '*',
                opacity: '.7',
                transform: 'translateX(-200px)',
                // 'box-shadow': 'inset 0px 1px 2px 0px #e0e0e0',
                // background: '#ffcad2',
              })
            ),
            animate(
              '180ms cubic-bezier(0.35, 0, 0.45, 1)',
              style({
                height: '*',
                opacity: 0.3,
                transform: 'translateX(-200px)',
                // 'box-shadow': 'inset 0px 1px 2px 0px #e0e0e0', 
                background: '',
              })
            ),
          ])
        ),
      ],
      { optional: true }
    ),
  ]),
]);

export const collapseExpand = trigger('collapseExpand', [
  state(
    'false',
    style({
      width: '34%',
    })
  ),
  state(
    'true',
    style({
      width: '55%',
      height: '360px',
      filter: 'drop-shadow(2px 13px 20px black)',
    })
  ),
  transition('false => true', [
    animate('700ms cubic-bezier(0.35, 0, 0.65, 1.5)'),
  ]),
  transition('true => false', [
    animate('700ms cubic-bezier(0.35, 0, 0.65, -1)'),
  ]),
]);

export const slctdMemberAnimation = trigger('slctdMemberAnimation', [
  transition(':enter', [
    query(':enter', [
      // style({
      //   height: '*',
      //   opacity: '0',
      //   transform: 'translateX(-200px)',
      //   'box-shadow': 'inset 0px 1px 2px 0px #e0e0e0',
      //   background: '',
      // }),
      stagger(
        60,
        sequence([
          animate(
            '790ms cubic-bezier(0.35, 0, 0.8, 1.2)',
            style({
              height: '*',
              opacity: '.8',
              transform: 'translateX(0)',
              'box-shadow': 'inset 0px 1px 3px 0px',
              'border-block-end-color': 'white',
              background: 'beige',
            })
          ),
        ])
      ),
    ]),
  ]),
  transition(':leave', [
    query(
      ':leave',
      [
        style({
          height: '*',
          opacity: '1',
          transform: 'translateX(0px)',
          'box-shadow': 'inset 0px 1px 2px 0px #e0e0e0',
          background: '',
        }),
        stagger(
          60,
          sequence([
            animate(
              '180ms cubic-bezier(0.35, 0, 0.45, 1)',
              style({
                height: '*',
                opacity: '.7',
                transform: 'translateX(-200px)',
                'box-shadow': 'inset 0px 1px 2px 0px #e0e0e0',
                // background: '#ffcad2',
              })
            ),
            animate(
              '180ms cubic-bezier(0.35, 0, 0.45, 1)',
              style({
                height: '*',
                opacity: 0.3,
                transform: 'translateX(-200px)',
                'box-shadow': 'inset 0px 1px 2px 0px #e0e0e0',
                background: '',
              })
            ),
          ])
        ),
      ],
      { optional: true }
    ),
  ]),
]);

export const rowRemove = trigger('rowRemove', [
  transition(':leave', [
    style({ background: 'red', opacity: 1 }),
    animate(
      '0.35s ease',
      style({ opacity: 0, transform: 'translateX(-550px)' })
    ),
  ]),
]);

export const ScaleIn = trigger('scaleIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.4)' }),
    animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
  ])
]);

export const fadeIn = trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms ease-out', style({ opacity: 1 })),
      ])
])

export const slideLeft = trigger('slideLeft', [
  transition(':enter', [
    style({ transform: 'translateX(-70%)', opacity: 0 }),
    animate('800ms cubic-bezier(0.15, 0, 0.30, 0.9)', style({ transform: 'translateX(0)', opacity: 1 })),
  ])
]);

export const slideRight = trigger('slideRight', [
  transition(':enter', [
    style({ transform: 'translateX(70%)', opacity: 0 }),
    animate('800ms cubic-bezier(0.15, 0, 0.30, 0.9)', style({ transform: 'translateX(0)', opacity: 1 })),
  ])
]);
