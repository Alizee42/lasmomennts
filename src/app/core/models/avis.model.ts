export interface Avis {
  id: number;
  nom: string;
  prenom: string;
  message: string;
  note: number;
  photoUrl?: string;
  approuve: boolean;
  createdAt: string;
}

export interface AvisRequest {
  nom: string;
  prenom: string;
  message: string;
  note: number;
}
