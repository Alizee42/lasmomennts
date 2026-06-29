import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReactiveFormsModule, FormBuilder, FormsModule, FormGroup } from '@angular/forms';
import { SiteConfigService } from '../../core/services/site-config.service';
import { SiteConfig } from '../../core/models/site-config.model';
import { ApiUrlPipe } from '../../core/pipes/api-url.pipe';
import { DirtyFieldDirective } from '../../core/directives/dirty-field.directive';
import { environment } from '../../../environments/environment';

type TabKey = 'hero' | 'about' | 'services' | 'tarifs' | 'contact';

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ApiUrlPipe, DirtyFieldDirective],
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.scss']
})
export class ParametresComponent implements OnInit, OnDestroy {
  private service = inject(SiteConfigService);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  private base = environment.apiUrl.replace(/\/api$/, '');
  saving = false;
  savedTab: TabKey | null = null;
  activeTab: TabKey = 'hero';
  config: SiteConfig = {} as SiteConfig;

  tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'hero',     label: 'Hero',      icon: 'fa-home' },
    { key: 'about',    label: 'À propos',  icon: 'fa-user' },
    { key: 'services', label: 'Services',  icon: 'fa-star' },
    { key: 'tarifs',   label: 'Tarifs',    icon: 'fa-tag' },
    { key: 'contact',  label: 'Contact',   icon: 'fa-envelope' },
  ];

  forms: Record<TabKey, FormGroup> = {
    hero: this.fb.group({
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
    }),
    about: this.fb.group({
      about_text:       [''],
      about_titre:      [''],
      about_signature:  [''],
      about_location:   [''],
      stats_evenements: [''],
      stats_annees:     [''],
      stats_clients:    [''],
    }),
    services: this.fb.group({
      service1_titre:       [''],
      service1_description: [''],
      service2_titre:       [''],
      service2_description: [''],
      service3_titre:       [''],
      service3_description: [''],
    }),
    tarifs: this.fb.group({
      tarif_video_classique_prix: [''],
      tarif_video_premium_prix:   [''],
      tarif_photo_classique_prix: [''],
      tarif_photo_premium_prix:   [''],
      tarif_audio_classique_prix: [''],
      tarif_audio_premium_prix:   [''],
    }),
    contact: this.fb.group({
      contact_telephone:   [''],
      contact_email:       [''],
      contact_titre:       [''],
      contact_sous_titre:  [''],
      contact_description: [''],
      contact_zone:        [''],
      contact_badge:       [''],
      instagram_url:       [''],
      facebook_url:        [''],
      tiktok_url:          [''],
    }),
  };

  tarifsConfig = [
    { label: 'Vidéobooth 360°',  key: 'tarif_video' },
    { label: 'Photobooth',        key: 'tarif_photo' },
    { label: 'Livre d\'or Audio', key: 'tarif_audio' },
  ];

  activeTarif = 'tarif_video';
  openFeatures: Record<string, boolean> = { classique: true, premium: false };

  features: Record<string, string[]> = {
    tarif_video_classique_features: [],
    tarif_video_premium_features:   [],
    tarif_photo_classique_features: [],
    tarif_photo_premium_features:   [],
    tarif_audio_classique_features: [],
    tarif_audio_premium_features:   [],
  };

  getUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return this.base + path;
  }

  isDirty(tab: TabKey): boolean {
    return this.forms[tab].dirty;
  }

  hasAnyDirty(): boolean {
    return this.tabs.some(t => this.forms[t.key].dirty);
  }

  selectTab(tab: TabKey) {
    if (this.forms[this.activeTab].dirty) {
      const ok = confirm('Des modifications non enregistrées seront perdues. Continuer ?');
      if (!ok) return;
      this.forms[this.activeTab].markAsPristine();
    }
    this.activeTab = tab;
  }

  ngOnInit() { this.loadConfig(); }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  loadConfig() {
    this.service.getConfig().pipe(takeUntil(this.destroy$)).subscribe((c: SiteConfig) => {
      this.config = c;
      Object.values(this.forms).forEach(f => f.patchValue(c));
      Object.keys(this.features).forEach(key => {
        const raw: string = c[key] ?? '';
        this.features[key] = raw ? raw.split('|').map((s: string) => s.trim()).filter(Boolean) : [];
      });
    });
  }

  submit(tab: TabKey) {
    const form = this.forms[tab];
    if (form.pristine || this.saving) return;
    this.saving = true;
    const updates: Partial<SiteConfig> = {};
    Object.entries(form.value).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== '') updates[k as keyof SiteConfig] = v as string;
    });
    if (tab === 'tarifs') {
      Object.keys(this.features).forEach(key => {
        (updates as any)[key] = this.features[key].filter(Boolean).join('|');
      });
    }
    this.service.updateTexte(updates).subscribe(() => {
      this.saving = false;
      this.savedTab = tab;
      form.markAsPristine();
      setTimeout(() => this.savedTab = null, 3500);
    });
  }

  uploadFichier(cle: string, event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.service.updateFichier(cle, file).subscribe(c => {
      this.config = c;
      Object.values(this.forms).forEach(f => f.patchValue(c));
    });
  }

  addFeature(key: string) {
    this.features[key] = [...this.features[key], ''];
    this.forms.tarifs.markAsDirty();
  }

  removeFeature(key: string, i: number) {
    this.features[key] = this.features[key].filter((_, idx) => idx !== i);
    this.forms.tarifs.markAsDirty();
  }

  trackByIndex(i: number) { return i; }

  serviceInput(n: number): HTMLInputElement {
    return document.getElementById('svc' + n) as HTMLInputElement;
  }
}
