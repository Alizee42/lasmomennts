import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  auth = inject(AuthService);

  navItems = [
    { path: '/admin/dashboard',       label: 'Dashboard',        icon: 'fas fa-chart-bar' },
    { path: '/admin/avis',            label: 'Avis clients',     icon: 'fas fa-star' },
    { path: '/admin/disponibilites',  label: 'Disponibilités',   icon: 'fas fa-calendar' },
    { path: '/admin/videos',          label: 'Vidéos',           icon: 'fas fa-video' },
    { path: '/admin/parametres',      label: 'Paramètres site',  icon: 'fas fa-cog' }
  ];
}
