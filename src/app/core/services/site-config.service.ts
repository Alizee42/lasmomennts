import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SiteConfig } from '../models/site-config.model';

@Injectable({ providedIn: 'root' })
export class SiteConfigService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/config`;

  getConfig(): Observable<SiteConfig> {
    return this.http.get<SiteConfig>(this.url);
  }

  updateTexte(updates: Partial<SiteConfig>): Observable<SiteConfig> {
    return this.http.put<SiteConfig>(`${environment.apiUrl}/admin/config`, updates);
  }

  updateFichier(cle: string, fichier: File): Observable<SiteConfig> {
    const form = new FormData();
    form.append('fichier', fichier);
    return this.http.post<SiteConfig>(`${environment.apiUrl}/admin/config/${cle}/fichier`, form);
  }
}
