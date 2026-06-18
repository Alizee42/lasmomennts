import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Disponibilite, DisponibiliteRequest } from '../models/disponibilite.model';

@Injectable({ providedIn: 'root' })
export class DisponibiliteService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/disponibilites`;
  private adminUrl = `${environment.apiUrl}/admin/disponibilites`;

  getDisponibilites(debut?: string, fin?: string): Observable<Disponibilite[]> {
    let params = new HttpParams();
    if (debut) params = params.set('debut', debut);
    if (fin) params = params.set('fin', fin);
    return this.http.get<Disponibilite[]>(this.url, { params });
  }

  getToutesLesDisponibilites(): Observable<Disponibilite[]> {
    return this.http.get<Disponibilite[]>(this.adminUrl);
  }

  creer(request: DisponibiliteRequest): Observable<Disponibilite> {
    return this.http.post<Disponibilite>(this.adminUrl, request);
  }

  modifier(id: number, request: DisponibiliteRequest): Observable<Disponibilite> {
    return this.http.put<Disponibilite>(`${this.adminUrl}/${id}`, request);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${id}`);
  }
}
