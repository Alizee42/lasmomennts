import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DisponibiliteService } from '../../core/services/disponibilite.service';
import { Disponibilite } from '../../core/models/disponibilite.model';

const PAGE_SIZE = 15;

@Component({
  selector: 'app-gestion-disponibilites',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './gestion-disponibilites.component.html',
  styleUrls: ['./gestion-disponibilites.component.scss']
})
export class GestionDisponibilitesComponent implements OnInit, OnDestroy {
  private service = inject(DisponibiliteService);
  private fb = inject(FormBuilder);
  private datePipe = new DatePipe('fr');
  private destroy$ = new Subject<void>();

  disponibilites: Disponibilite[] = [];
  showForm = false;

  filtreMois = '';
  filtreStatut = '';
  sortCol: 'date' | 'statut' = 'date';
  sortDir: 'asc' | 'desc' = 'asc';
  currentPage = 0;

  form = this.fb.group({
    dateEvenement: ['', Validators.required],
    heureDebut:    ['', Validators.required],
    heureFin:      ['', Validators.required],
    disponible:    [true],
    description:   ['']
  });

  ngOnInit() { this.load(); }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  load() {
    this.service.getToutesLesDisponibilites().pipe(takeUntil(this.destroy$)).subscribe(d => {
      this.disponibilites = d;
      this.resetPage();
    });
  }

  get moisDisponibles(): { value: string; label: string }[] {
    const seen = new Set<string>();
    const result: { value: string; label: string }[] = [];
    for (const d of [...this.disponibilites].sort((a, b) =>
      new Date(a.dateEvenement).getTime() - new Date(b.dateEvenement).getTime()
    )) {
      const val = this.datePipe.transform(d.dateEvenement, 'yyyy-MM') ?? '';
      if (!seen.has(val)) {
        seen.add(val);
        const label = this.datePipe.transform(d.dateEvenement, 'MMMM yyyy') ?? val;
        result.push({ value: val, label: label.charAt(0).toUpperCase() + label.slice(1) });
      }
    }
    return result;
  }

  get disponibilitesFiltrees(): Disponibilite[] {
    let list = [...this.disponibilites];

    if (this.filtreMois) {
      list = list.filter(d => {
        const m = this.datePipe.transform(d.dateEvenement, 'yyyy-MM');
        return m === this.filtreMois;
      });
    }

    if (this.filtreStatut !== '') {
      const dispo = this.filtreStatut === 'true';
      list = list.filter(d => d.disponible === dispo);
    }

    list.sort((a, b) => {
      let cmp = 0;
      if (this.sortCol === 'date') {
        cmp = new Date(a.dateEvenement).getTime() - new Date(b.dateEvenement).getTime();
      } else {
        cmp = Number(b.disponible) - Number(a.disponible);
      }
      return this.sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }

  get totalPages(): number {
    return Math.ceil(this.disponibilitesFiltrees.length / PAGE_SIZE);
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  get page(): Disponibilite[] {
    const start = this.currentPage * PAGE_SIZE;
    return this.disponibilitesFiltrees.slice(start, start + PAGE_SIZE);
  }

  toggleSort(col: 'date' | 'statut') {
    if (this.sortCol === col) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortCol = col;
      this.sortDir = 'asc';
    }
    this.resetPage();
  }

  goToPage(p: number) {
    if (p >= 0 && p < this.totalPages) this.currentPage = p;
  }

  resetPage() { this.currentPage = 0; }

  submit() {
    if (this.form.invalid) return;
    const val = this.form.value;
    this.service.creer({
      dateEvenement: val.dateEvenement!,
      heureDebut:    val.heureDebut!,
      heureFin:      val.heureFin!,
      disponible:    val.disponible ?? true,
      description:   val.description ?? undefined
    }).subscribe(() => {
      this.load();
      this.form.reset({ disponible: true });
      this.showForm = false;
    });
  }

  supprimer(id: number) {
    if (!confirm('Supprimer cette disponibilité ?')) return;
    this.service.supprimer(id).subscribe(() => this.load());
  }
}
