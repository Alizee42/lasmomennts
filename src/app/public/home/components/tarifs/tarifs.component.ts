import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteConfig } from '../../../../core/models/site-config.model';

@Component({
  selector: 'app-tarifs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarifs.component.html',
  styleUrls: ['./tarifs.component.scss']
})
export class TarifsComponent {
  @Input() config!: SiteConfig;

  activeService = 0;

  services() {
    return [
      { icon: 'fa-video',      label: this.config.service1_titre },
      { icon: 'fa-camera',     label: this.config.service2_titre },
      { icon: 'fa-microphone', label: this.config.service3_titre }
    ];
  }

  tarifs() {
    const all = [
      {
        classique: { prix: this.config.tarif_video_classique_prix, features: this.config.tarif_video_classique_features },
        premium:   { prix: this.config.tarif_video_premium_prix,   features: this.config.tarif_video_premium_features }
      },
      {
        classique: { prix: this.config.tarif_photo_classique_prix, features: this.config.tarif_photo_classique_features },
        premium:   { prix: this.config.tarif_photo_premium_prix,   features: this.config.tarif_photo_premium_features }
      },
      {
        classique: { prix: this.config.tarif_audio_classique_prix, features: this.config.tarif_audio_classique_features },
        premium:   { prix: this.config.tarif_audio_premium_prix,   features: this.config.tarif_audio_premium_features }
      }
    ];
    return all[this.activeService];
  }

  getFeatures(featuresStr: string): string[] {
    return featuresStr ? featuresStr.split('|') : [];
  }
}
