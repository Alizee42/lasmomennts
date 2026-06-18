import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiUrlPipe } from '../../../../core/pipes/api-url.pipe';
import { SiteConfig } from '../../../../core/models/site-config.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, ApiUrlPipe],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  @Input() config!: SiteConfig;
}
