export interface Disponibilite {
  id: number;
  dateEvenement: string;
  heureDebut: string;
  heureFin: string;
  disponible: boolean;
  description?: string;
}

export interface DisponibiliteRequest {
  dateEvenement: string;
  heureDebut: string;
  heureFin: string;
  disponible: boolean;
  description?: string;
}
