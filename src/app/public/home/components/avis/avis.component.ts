import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AvisService } from '../../../../core/services/avis.service';
import { Avis } from '../../../../core/models/avis.model';
import { ApiUrlPipe } from '../../../../core/pipes/api-url.pipe';

@Component({
  selector: 'app-avis',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ApiUrlPipe, RouterLink],
  templateUrl: './avis.component.html',
  styleUrls: ['./avis.component.scss']
})
export class AvisComponent implements OnInit {
  private avisService = inject(AvisService);
  private fb = inject(FormBuilder);

  avis: Avis[] = [];
  activeIndex = 0;
  showModal = false;
  submitted = false;
  selectedPhoto: File | null = null;
  photoPreview: string | null = null;

  form = this.fb.group({
    nom:          ['', [Validators.required, Validators.maxLength(100)]],
    prenom:       ['', [Validators.required, Validators.maxLength(100)]],
    message:      ['', [Validators.required]],
    note:         [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    consentement: [false, Validators.requiredTrue]
  });

  ngOnInit() {
    this.avisService.getAvisApprouves().subscribe(a => this.avis = a);
  }

  prev() {
    this.activeIndex = this.activeIndex === 0 ? this.avis.length - 1 : this.activeIndex - 1;
  }

  next() {
    this.activeIndex = this.activeIndex === this.avis.length - 1 ? 0 : this.activeIndex + 1;
  }

  goTo(i: number) { this.activeIndex = i; }

  getStars(note: number): number[] { return Array(note).fill(0); }
  getEmptyStars(note: number): number[] { return Array(5 - note).fill(0); }

  onPhotoChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedPhoto = file;
      const reader = new FileReader();
      reader.onload = e => this.photoPreview = e.target?.result as string;
      reader.readAsDataURL(file);
    }
  }

  setNote(n: number) { this.form.patchValue({ note: n }); }

  openModal() { this.showModal = true; document.body.style.overflow = 'hidden'; }
  closeModal() { this.showModal = false; document.body.style.overflow = ''; }

  submit() {
    if (this.form.invalid) return;
    const val = this.form.value;
    this.avisService.soumettre(
      { nom: val.nom!, prenom: val.prenom!, message: val.message!, note: val.note! },
      this.selectedPhoto ?? undefined
    ).subscribe(() => {
      this.submitted = true;
      this.closeModal();
      this.form.reset({ note: 5 });
      this.selectedPhoto = null;
      this.photoPreview = null;
    });
  }
}
