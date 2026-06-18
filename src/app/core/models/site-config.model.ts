export interface SiteConfig {
  // Hero
  hero_video_url: string;
  hero_titre_ligne1: string;
  hero_titre_ligne2: string;
  hero_titre_ligne3: string;
  hero_sous_titre: string;
  hero_badge: string;
  hero_stat1_nombre: string;
  hero_stat1_label: string;
  hero_stat2_nombre: string;
  hero_stat2_label: string;
  hero_stat3_nombre: string;
  hero_stat3_label: string;
  hero_stat4_nombre: string;
  hero_stat4_label: string;

  // À propos
  about_text: string;
  about_photo_url: string;
  about_titre: string;
  about_signature: string;
  about_location: string;
  stats_evenements: string;
  stats_annees: string;
  stats_clients: string;

  // Services
  service1_titre: string;
  service1_description: string;
  service1_image_url: string;
  service2_titre: string;
  service2_description: string;
  service2_image_url: string;
  service3_titre: string;
  service3_description: string;
  service3_image_url: string;

  // Tarifs Vidéobooth 360°
  tarif_video_classique_prix: string;
  tarif_video_classique_features: string;
  tarif_video_premium_prix: string;
  tarif_video_premium_features: string;

  // Tarifs Photobooth
  tarif_photo_classique_prix: string;
  tarif_photo_classique_features: string;
  tarif_photo_premium_prix: string;
  tarif_photo_premium_features: string;

  // Tarifs Livre d'or Audio
  tarif_audio_classique_prix: string;
  tarif_audio_classique_features: string;
  tarif_audio_premium_prix: string;
  tarif_audio_premium_features: string;

  // Contact
  contact_telephone: string;
  contact_email: string;
  contact_titre: string;
  contact_sous_titre: string;
  contact_description: string;
  contact_zone: string;
  contact_badge: string;

  // Réseaux sociaux
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;

  [key: string]: string;
}
