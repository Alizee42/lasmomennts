import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { SiteConfigService } from '../../core/services/site-config.service';
import { SiteConfig } from '../../core/models/site-config.model';
import { ApiUrlPipe } from '../../core/pipes/api-url.pipe';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ApiUrlPipe],
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.scss']
})
export class ParametresComponent implements OnInit, OnDestroy {
  private service = inject(SiteConfigService);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  private base = environment.apiUrl.replace('/api', '');
  saved = false;
  saving = false;
  activeTab: 'hero' | 'about' | 'services' | 'tarifs' | 'contact' = 'hero';
  config: SiteConfig = {} as SiteConfig;

  getUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return this.base + path;
  }

  tarifsConfig = [
    { label: 'Vidéobooth 360°',   key: 'tarif_video' },
    { label: 'Photobooth',         key: 'tarif_photo' },
    { label: 'Livre d\'or Audio', key: 'tarif_audio' },
  ];

  activeTarif = 'tarif_video';
  openFeatures: Record<string, boolean> = {
    classique: true,
    premium: false,
  };

  // features stockées comme tableaux en mémoire, converties en | pour save
  features: Record<string, string[]> = {
    tarif_video_classique_features: [],
    tarif_video_premium_features:   [],
    tarif_photo_classique_features: [],
    tarif_photo_premium_features:   [],
    tarif_audio_classique_features: [],
    tarif_audio_premium_features:   [],
  };

  form = this.fb.group({
    // Hero
    hero_titre_ligne1: [''],
    hero_titre_ligne2: [''],
    hero_titre_ligne3: [''],
    hero_sous_titre:   [''],
    hero_badge:        [''],
    hero_stat1_nombre: [''],
    hero_stat1_label:  [''],
    hero_stat2_nombre: [''],
    hero_stat2_label:  [''],
    hero_stat3_nombre: [''],
    hero_stat3_label:  [''],
    hero_stat4_nombre: [''],
    hero_stat4_label:  [''],
    // À propos
    about_text:      [''],
    about_titre:     [''],
    about_signature: [''],
    about_location:  [''],
    stats_evenements:[''],
    stats_annees:    [''],
    stats_clients:   [''],
    // Services
    service1_titre:      [''],
    service1_description:[''],
    service2_titre:      [''],
    service2_description:[''],
    service3_titre:      [''],
    service3_description:[''],
    // Tarifs
    tarif_video_classique_prix: [''],
    tarif_video_premium_prix:   [''],
    tarif_photo_classique_prix: [''],
    tarif_photo_premium_prix:   [''],
    tarif_audio_classique_prix: [''],
    tarif_audio_premium_prix:   [''],
    // Contact
    contact_telephone:  [''],
    contact_email:      [''],
    contact_titre:      [''],
    contact_sous_titre: [''],
    contact_description:[''],
    contact_zone:       [''],
    contact_badge:      [''],
    // Réseaux
    instagram_url: [''],
    facebook_url:  [''],
    tiktok_url:    ['']
  });

  ngOnInit() { this.loadConfig(); }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  loadConfig() {
    this.service.getConfig().pipe(takeUntil(this.destroy$)).subscribe((c: SiteConfig) => {
      this.config = c;
      this.form.patchValue(c);
      Object.keys(this.features).forEach(key => {
        const raw: string = c[key] ?? '';
        this.features[key] = raw ? raw.split('|').map((s: string) => s.trim()).filter(Boolean) : [];
      });
    });
  }

  addFeature(key: string) {
    this.features[key] = [...this.features[key], ''];
  }

  removeFeature(key: string, i: number) {
    this.features[key] = this.features[key].filter((_, idx) => idx !== i);
  }

  trackByIndex(i: number) { return i; }

  submit() {
    if (this.form.pristine || this.saving) return;
    this.saving = true;
    const updates: Partial<SiteConfig> = {};
    Object.entries(this.form.value).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== '') updates[k as keyof SiteConfig] = v as string;
    });
    Object.keys(this.features).forEach(key => {
      (updates as any)[key] = this.features[key].filter(Boolean).join('|');
    });
    this.service.updateTexte(updates).subscribe(() => {
      this.saving = false;
      this.saved = true;
      this.form.markAsPristine();
      setTimeout(() => this.saved = false, 3500);
    });
  }

  uploadFichier(cle: string, event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.service.updateFichier(cle, file).subscribe(c => {
      this.config = c;
      this.form.patchValue(c);
    });
  }

  serviceInput(n: number): HTMLInputElement {
    return document.getElementById('svc' + n) as HTMLInputElement;
  }
}
