import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AvisService } from '../../core/services/avis.service';
import { Avis } from '../../core/models/avis.model';
import { ApiUrlPipe } from '../../core/pipes/api-url.pipe';

@Component({
  selector: 'app-gestion-avis',
  standalone: true,
  imports: [CommonModule, ApiUrlPipe],
  templateUrl: './gestion-avis.component.html',
  styleUrls: ['./gestion-avis.component.scss']
})
export class GestionAvisComponent implements OnInit, OnDestroy {
  private avisService = inject(AvisService);
  private destroy$ = new Subject<void>();
  avis: Avis[] = [];
  filtre: 'tous' | 'attente' | 'approuves' = 'attente';

  ngOnInit() { this.load(); }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  load() {
    this.avisService.getTousLesAvis().pipe(takeUntil(this.destroy$)).subscribe(a => this.avis = a);
  }

  get enAttente(): number { return this.avis.filter(a => !a.approuve).length; }

  get avisFiltres(): Avis[] {
    if (this.filtre === 'attente')   return this.avis.filter(a => !a.approuve);
    if (this.filtre === 'approuves') return this.avis.filter(a => a.approuve);
    return this.avis;
  }

  approuver(id: number) {
    this.avisService.approuver(id).subscribe(() => this.load());
  }

  supprimer(id: number) {
    if (!confirm('Supprimer cet avis ?')) return;
    this.avisService.supprimer(id).subscribe(() => this.load());
  }

  getStars(note: number): number[] { return Array(note).fill(0); }
  getEmptyStars(note: number): number[] { return Array(5 - note).fill(0); }
}
