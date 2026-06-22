// api/check.js
import axios from 'axios';

export default async function handler(req, res) {
  // Autoriser le CORS (pour les requêtes depuis votre front)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { phone } = req.body;
  if (!phone || !/^\d+$/.test(phone)) {
    return res.status(400).json({ error: 'Numéro invalide' });
  }

  try {
    // Requête HEAD vers wa.me
    const response = await axios.head(`https://wa.me/${phone}`, {
      maxRedirects: 0,          // Ne pas suivre les redirections
      validateStatus: (status) => status >= 200 && status < 400,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // 302 ou 301 = redirection vers WhatsApp → numéro existe
    const exists = response.status === 302 || response.status === 301;
    return res.status(200).json({ exists, status: response.status });
  } catch (error) {
    // En cas d'erreur (timeout, réseau, etc.) on retourne exists = false
    return res.status(200).json({ exists: false, error: error.message });
  }
}
