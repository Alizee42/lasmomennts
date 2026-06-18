import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Avis, AvisRequest } from '../models/avis.model';

@Injectable({ providedIn: 'root' })
export class AvisService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/avis`;
  private adminUrl = `${environment.apiUrl}/admin/avis`;

  getAvisApprouves(): Observable<Avis[]> {
    return this.http.get<Avis[]>(this.url);
  }

  getTousLesAvis(): Observable<Avis[]> {
    return this.http.get<Avis[]>(this.adminUrl);
  }

  soumettre(request: AvisRequest, photo?: File): Observable<Avis> {
    const form = new FormData();
    form.append('avis', new Blob([JSON.stringify(request)], { type: 'application/json' }));
    if (photo) form.append('photo', photo);
    return this.http.post<Avis>(this.url, form);
  }

  approuver(id: number): Observable<Avis> {
    return this.http.put<Avis>(`${this.adminUrl}/${id}/approuver`, {});
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${id}`);
  }
}
