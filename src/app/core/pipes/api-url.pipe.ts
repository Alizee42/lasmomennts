import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({ name: 'apiUrl', standalone: true })
export class ApiUrlPipe implements PipeTransform {
  private base = environment.apiUrl.replace(/\/api$/, '');

  transform(value: string | null | undefined): string {
    if (!value) return '';
    if (value.startsWith('http')) return value;
    return this.base + value;
  }
}
