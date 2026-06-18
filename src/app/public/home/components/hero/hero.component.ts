import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiUrlPipe } from '../../../../core/pipes/api-url.pipe';
import { SiteConfig } from '../../../../core/models/site-config.model';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, ApiUrlPipe],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  @Input() config!: SiteConfig;
}
