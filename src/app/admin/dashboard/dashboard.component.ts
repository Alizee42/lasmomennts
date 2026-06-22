import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AvisService } from '../../core/services/avis.service';
import { DisponibiliteService } from '../../core/services/disponibilite.service';
import { VideoService } from '../../core/services/video.service';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private avisService = inject(AvisService);
  private dispoService = inject(DisponibiliteService);
  private videoService = inject(VideoService);
  private destroy$ = new Subject<void>();

  stats = { avisEnAttente: 0, prochainesDates: 0, videos: 0, avisTotal: 0 };

  ngOnInit() {
    forkJoin({
      avis: this.avisService.getTousLesAvis(),
      dispos: this.dispoService.getDisponibilites(),
      videos: this.videoService.getVideos()
    }).pipe(takeUntil(this.destroy$)).subscribe(({ avis, dispos, videos }) => {
      this.stats = {
        avisEnAttente: avis.filter(a => !a.approuve).length,
        avisTotal:     avis.filter(a => a.approuve).length,
        prochainesDates: dispos.filter(d => d.disponible).length,
        videos: videos.length
      };
    });
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
}
