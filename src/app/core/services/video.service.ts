import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Video } from '../models/video.model';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/videos`;
  private adminUrl = `${environment.apiUrl}/admin/videos`;

  getVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(this.url);
  }

  ajouter(titre: string, fichier: File, thumbnail?: File): Observable<Video> {
    const form = new FormData();
    form.append('titre', titre);
    form.append('fichier', fichier);
    if (thumbnail) form.append('thumbnail', thumbnail);
    return this.http.post<Video>(this.adminUrl, form);
  }

  ajouterAvecProgression(titre: string, fichier: File, thumbnail?: File): Observable<HttpEvent<Video>> {
    const form = new FormData();
    form.append('titre', titre);
    form.append('fichier', fichier);
    if (thumbnail) form.append('thumbnail', thumbnail);
    const req = new HttpRequest('POST', this.adminUrl, form, { reportProgress: true });
    return this.http.request<Video>(req);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${id}`);
  }
}
