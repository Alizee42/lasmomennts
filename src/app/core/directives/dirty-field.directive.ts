import { Directive, HostBinding, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName],[formControl]',
  standalone: true,
})
export class DirtyFieldDirective {
  private control = inject(NgControl, { self: true });

  @HostBinding('class.input--dirty')
  get isDirty(): boolean {
    return !!this.control.dirty;
  }
}
