import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { VideoService } from '../../core/services/video.service';
import { Video } from '../../core/models/video.model';
import { ApiUrlPipe } from '../../core/pipes/api-url.pipe';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-gestion-videos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ApiUrlPipe],
  templateUrl: './gestion-videos.component.html',
  styleUrls: ['./gestion-videos.component.scss']
})
export class GestionVideosComponent implements OnInit, OnDestroy {
  private service = inject(VideoService);
  private fb = inject(FormBuilder);
  private base = environment.apiUrl.replace('/api', '');
  private destroy$ = new Subject<void>();

  videos: Video[] = [];
  showForm = false;
  uploading = false;
  uploadProgress = 0;
  fichier: File | null = null;
  thumbnail: File | null = null;
  thumbnails: Record<number, string> = {};
  modalVideo: Video | null = null;

  form = this.fb.group({ titre: ['', Validators.required] });

  ngOnInit() { this.load(); }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  load() {
    this.service.getVideos().pipe(takeUntil(this.destroy$)).subscribe(v => {
      this.videos = v;
      v.forEach(video => {
        if (!video.thumbnail) this.generateThumbnail(video);
      });
    });
  }

  getThumb(v: Video): string | null {
    if (v.thumbnail) return this.base + v.thumbnail;
    return this.thumbnails[v.id] ?? null;
  }

  private generateThumbnail(video: Video) {
    const url = this.base + video.url;
    const vid = document.createElement('video');
    vid.crossOrigin = 'anonymous';
    vid.src = url;
    vid.currentTime = 1;
    vid.muted = true;
    vid.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = vid.videoWidth || 320;
      canvas.height = vid.videoHeight || 180;
      canvas.getContext('2d')?.drawImage(vid, 0, 0, canvas.width, canvas.height);
      this.thumbnails[video.id] = canvas.toDataURL('image/jpeg', 0.8);
    }, { once: true });
    vid.load();
  }

  onFichier(e: Event) {
    this.fichier = (e.target as HTMLInputElement).files?.[0] ?? null;
  }

  onThumbnail(e: Event) {
    this.thumbnail = (e.target as HTMLInputElement).files?.[0] ?? null;
  }

  submit() {
    if (this.form.invalid || !this.fichier) return;
    this.uploading = true;
    this.uploadProgress = 0;

    this.service.ajouterAvecProgression(this.form.value.titre!, this.fichier, this.thumbnail ?? undefined)
      .subscribe({
        next: event => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
          } else if (event.type === HttpEventType.Response) {
            this.load();
            this.form.reset();
            this.fichier = null;
            this.thumbnail = null;
            this.showForm = false;
            this.uploading = false;
            this.uploadProgress = 0;
          }
        },
        error: () => { this.uploading = false; }
      });
  }

  openModal(v: Video) {
    this.modalVideo = v;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.modalVideo = null;
    document.body.style.overflow = '';
  }

  supprimer(id: number) {
    if (!confirm('Supprimer cette vidéo ?')) return;
    this.service.supprimer(id).subscribe(() => this.load());
  }
}
