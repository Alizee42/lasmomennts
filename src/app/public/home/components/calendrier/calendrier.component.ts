import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisponibiliteService } from '../../../../core/services/disponibilite.service';
import { Disponibilite } from '../../../../core/models/disponibilite.model';

@Component({
  selector: 'app-calendrier',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.scss']
})
export class CalendrierComponent implements OnInit {
  private dispoService = inject(DisponibiliteService);

  today = new Date();
  currentYear = this.today.getFullYear();
  currentMonth = this.today.getMonth();
  dispos: Disponibilite[] = [];

  readonly MOIS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  readonly JOURS = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

  ngOnInit() {
    this.dispoService.getDisponibilites().subscribe(d => this.dispos = d);
  }

  prevMonth() {
    if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear--; }
    else this.currentMonth--;
  }

  nextMonth() {
    if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++; }
    else this.currentMonth++;
  }

  get monthLabel() { return this.MOIS[this.currentMonth] + ' ' + this.currentYear; }

  get days(): ({ date: Date; empty: boolean })[] {
    const first = new Date(this.currentYear, this.currentMonth, 1);
    const last  = new Date(this.currentYear, this.currentMonth + 1, 0);
    const days: { date: Date; empty: boolean }[] = [];

    // offset lundi = 0
    let offset = first.getDay() - 1;
    if (offset < 0) offset = 6;
    for (let i = 0; i < offset; i++) days.push({ date: new Date(0), empty: true });
    for (let d = 1; d <= last.getDate(); d++) days.push({ date: new Date(this.currentYear, this.currentMonth, d), empty: false });

    return days;
  }

  getStatus(date: Date): 'disponible' | 'reserve' | null {
    const iso = date.toISOString().slice(0, 10);
    const dispo = this.dispos.find(d => d.dateEvenement === iso);
    if (!dispo) return null;
    return dispo.disponible ? 'disponible' : 'reserve';
  }

  isToday(date: Date): boolean {
    return date.toDateString() === this.today.toDateString();
  }

  isPast(date: Date): boolean {
    return date < new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
  }
}
