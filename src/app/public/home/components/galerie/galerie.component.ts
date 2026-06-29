import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VideoService } from '../../../../core/services/video.service';
import { Video } from '../../../../core/models/video.model';
import { ApiUrlPipe } from '../../../../core/pipes/api-url.pipe';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-galerie',
  standalone: true,
  imports: [CommonModule, ApiUrlPipe],
  templateUrl: './galerie.component.html',
  styleUrls: ['./galerie.component.scss']
})
export class GalerieComponent implements OnInit, OnDestroy {
  private videoService = inject(VideoService);
  private destroy$ = new Subject<void>();
  private base = environment.apiUrl.replace(/\/api$/, '');
  videos: Video[] = [];
  activeVideo: Video | null = null;
  thumbnails: Record<string, string> = {};

  ngOnInit() {
    this.videoService.getVideos().pipe(takeUntil(this.destroy$)).subscribe(v => {
      this.videos = v;
      v.forEach(video => {
        if (!video.thumbnail) this.generateThumbnail(video);
      });
    });
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  generateThumbnail(video: Video) {
    const url = video.url.startsWith('http') ? video.url : this.base + video.url;
    const vid = document.createElement('video');
    vid.crossOrigin = 'anonymous';
    vid.src = url;
    vid.currentTime = 1;
    vid.muted = true;

    vid.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = vid.videoWidth || 640;
      canvas.height = vid.videoHeight || 360;
      canvas.getContext('2d')!.drawImage(vid, 0, 0, canvas.width, canvas.height);
      this.thumbnails[video.url] = canvas.toDataURL('image/jpeg', 0.8);
    }, { once: true });

    vid.load();
  }

  openPlayer(video: Video) { this.activeVideo = video; }
  closePlayer() { this.activeVideo = null; }
}
