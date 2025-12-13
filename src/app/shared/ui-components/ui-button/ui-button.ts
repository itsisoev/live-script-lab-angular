import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'ui-button',
  imports: [
    NgClass
  ],
  template: `
    <button [ngClass]="classes" (click)="onClick.emit($event)">
      <ng-content></ng-content>
    </button>
  `,
  styleUrl: 'ui-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButton {
  size = input<'sm' | 'md' | 'lg'>('md');
  variant = input<'primary' | 'secondary' | 'icon'>('primary');

  onClick = output<Event>();

  get classes() {
    return [`button`, `button--${this.size()}`, `button--${this.variant()}`];
  }
}
