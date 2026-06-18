import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteConfigService } from '../../core/services/site-config.service';
import { SiteConfig } from '../../core/models/site-config.model';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { ServicesComponent } from './components/services/services.component';
import { TarifsComponent } from './components/tarifs/tarifs.component';
import { GalerieComponent } from './components/galerie/galerie.component';
import { CalendrierComponent } from './components/calendrier/calendrier.component';
import { AvisComponent } from './components/avis/avis.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    ServicesComponent,
    TarifsComponent,
    GalerieComponent,
    CalendrierComponent,
    AvisComponent,
    ContactComponent,
    FooterComponent
  ],
  template: `
    <ng-container *ngIf="config">
      <app-navbar [config]="config" />
      <main>
        <app-hero [config]="config" />
        <app-about [config]="config" />
        <app-services [config]="config" />
        <app-tarifs [config]="config" />
        <app-galerie />
        <app-calendrier />
        <app-avis />
        <app-contact [config]="config" />
      </main>
      <app-footer [config]="config" />
    </ng-container>
  `
})
export class HomeComponent implements OnInit {
  private configService = inject(SiteConfigService);
  config: SiteConfig | null = null;

  ngOnInit() {
    this.configService.getConfig().subscribe(c => this.config = c);
  }
}
