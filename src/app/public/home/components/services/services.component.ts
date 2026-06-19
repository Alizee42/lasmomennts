import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiUrlPipe } from '../../../../core/pipes/api-url.pipe';
import { SiteConfig } from '../../../../core/models/site-config.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, ApiUrlPipe],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  @Input() config!: SiteConfig;

  activeIndex = 0;

  get services() {
    return [
      {
        icon: 'fa-video',
        titre: this.config.service1_titre,
        description: this.config.service1_description,
        imageUrl: this.config.service1_image_url,
        badge: 'Le + populaire'
      },
      {
        icon: 'fa-camera',
        titre: this.config.service2_titre,
        description: this.config.service2_description,
        imageUrl: this.config.service2_image_url,
        badge: null
      },
      {
        icon: 'fa-microphone',
        titre: this.config.service3_titre,
        description: this.config.service3_description,
        imageUrl: this.config.service3_image_url,
        badge: null
      }
    ];
  }

  select(index: number) {
    this.activeIndex = index;
  }
}
