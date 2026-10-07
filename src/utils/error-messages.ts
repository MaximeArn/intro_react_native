// Traduit les codes d'erreur Firebase (Auth, Storage) en messages compréhensibles
const messages: Record<string, string> = {
  // Auth
  "auth/email-already-in-use":
    "Un compte existe déjà avec cette adresse email.",
  "auth/invalid-email": "L'adresse email n'est pas valide.",
  "auth/weak-password": "Le mot de passe doit contenir au moins 6 caractères.",
  "auth/invalid-credential": "Email ou mot de passe incorrect.",
  "auth/wrong-password": "Email ou mot de passe incorrect.",
  "auth/user-not-found": "Email ou mot de passe incorrect.",
  "auth/missing-password": "Renseigne ton mot de passe.",
  "auth/user-disabled": "Ce compte a été désactivé.",
  "auth/too-many-requests":
    "Trop de tentatives. Patiente quelques minutes avant de réessayer.",
  "auth/network-request-failed":
    "Pas de connexion internet. Vérifie ton réseau et réessaie.",

  // Storage
  "storage/unauthorized":
    "Tu n'as pas l'autorisation d'enregistrer ce fichier.",
  "storage/unauthenticated": "Ta session a expiré, reconnecte-toi.",
  "storage/quota-exceeded":
    "Le stockage est plein pour le moment, réessaie plus tard.",
  "storage/retry-limit-exceeded":
    "La connexion est trop lente pour envoyer la photo, réessaie.",
  "storage/canceled": "L'envoi de la photo a été annulé.",
  "storage/object-not-found": "Cette photo est introuvable.",
  "storage/unknown": "L'envoi de la photo a échoué, réessaie.",
};

export const DEFAULT_ERROR_MESSAGE = "Une erreur est survenue, réessaie.";

export function getErrorMessage(
  error: unknown,
  fallback = DEFAULT_ERROR_MESSAGE,
): string {
  const code = (error as { code?: string } | null)?.code;
  return (code && messages[code]) || fallback;
}
