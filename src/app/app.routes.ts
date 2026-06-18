import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./public/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./public/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'confirmation',
    loadComponent: () => import('./public/confirmation/confirmation.component').then(m => m.ConfirmationComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'avis',
        loadComponent: () => import('./admin/gestion-avis/gestion-avis.component').then(m => m.GestionAvisComponent)
      },
      {
        path: 'disponibilites',
        loadComponent: () => import('./admin/gestion-disponibilites/gestion-disponibilites.component').then(m => m.GestionDisponibilitesComponent)
      },
      {
        path: 'videos',
        loadComponent: () => import('./admin/gestion-videos/gestion-videos.component').then(m => m.GestionVideosComponent)
      },
      {
        path: 'parametres',
        loadComponent: () => import('./admin/parametres/parametres.component').then(m => m.ParametresComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
