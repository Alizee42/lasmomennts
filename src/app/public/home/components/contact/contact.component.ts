import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SiteConfig } from '../../../../core/models/site-config.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  @Input() config!: SiteConfig;

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  loading = false;
  success = false;

  form = this.fb.group({
    nom:            ['', Validators.required],
    email:          ['', [Validators.required, Validators.email]],
    telephone:      [''],
    type_evenement: ['', Validators.required],
    date_souhaitee: ['', Validators.required],
    nb_personnes:   [''],
    message:        ['']
  });

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.http.post(`${environment.apiUrl}/devis`, this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.form.reset();
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
