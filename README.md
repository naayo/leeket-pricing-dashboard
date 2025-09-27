# Leeket Pricing Dashboard

Dashboard de Pricing et Marges pour Leeket avec système d'authentification.

## 🚀 Déploiement sur Netlify

### Méthode 1: Déploiement via Git

1. **Créer un repository GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Leeket Dashboard with authentication"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connecter à Netlify**
   - Allez sur [Netlify](https://www.netlify.com)
   - Cliquez sur "New site from Git"
   - Choisissez GitHub et autorisez l'accès
   - Sélectionnez votre repository
   - Les paramètres de build sont automatiques (pas de build nécessaire)
   - Cliquez sur "Deploy site"

### Méthode 2: Déploiement manuel (Drag & Drop)

1. **Préparer les fichiers**
   - Assurez-vous que tous les fichiers sont dans le même dossier :
     - `index.html` (page de connexion)
     - `leeket-pricing-dashboard.html` (dashboard)
     - `netlify.toml` (configuration)
     - `_redirects` (redirections)
     - `package.json` (optionnel)

2. **Déployer sur Netlify**
   - Allez sur [Netlify Drop](https://app.netlify.com/drop)
   - Glissez-déposez le dossier complet
   - Netlify génère automatiquement une URL

3. **Personnaliser le domaine (optionnel)**
   - Dans les paramètres du site Netlify
   - Site settings → Domain management
   - Changez le sous-domaine ou ajoutez un domaine personnalisé

## 🔐 Utilisateurs autorisés

| Nom d'utilisateur | Mot de passe |
|------------------|--------------|
| amy | leeketdeamy |
| coumba | leeketdecoumba |
| amyb | leeketdemayb |
| baila | leeketdebaila |

## 📁 Structure des fichiers

```
leeket-pricing-dashboard/
├── index.html                    # Page de connexion
├── leeket-pricing-dashboard.html # Dashboard principal
├── google-sheets-config.html    # Configuration Google Sheets
├── GOOGLE_SHEETS_SETUP.md        # Guide Google Sheets
├── netlify.toml                  # Configuration Netlify
├── _redirects                    # Règles de redirection
├── package.json                  # Métadonnées du projet
└── README.md                     # Ce fichier
```

## ⚙️ Fonctionnalités de sécurité

- **Authentification côté client** : Les identifiants sont vérifiés en JavaScript
- **Token de session** : Un token est généré lors de la connexion
- **Expiration automatique** :
  - Session normale : 1 heure
  - "Se souvenir de moi" : 7 jours
- **Protection des pages** : Redirection automatique si non authentifié
- **Déconnexion** : Bouton de déconnexion dans le dashboard

## 🎨 Personnalisation

Pour modifier les utilisateurs autorisés, éditez la constante `USERS` dans `index.html` :

```javascript
const USERS = {
    'nouvel_utilisateur': 'nouveau_mot_de_passe',
    // ...
};
```

## 📱 Compatibilité

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Mobile (iOS Safari, Chrome Mobile)
- ✅ Tablettes

## 🔧 Test local

Pour tester localement :

```bash
# Python 3
python3 -m http.server 8000

# Node.js (si installé)
npx http-server

# Puis ouvrez http://localhost:8000
```

## 📈 Fonctionnalités du Dashboard

- **🔄 Synchronisation Google Sheets** (NOUVEAU)
  - Connexion directe à Google Sheets
  - Synchronisation automatique toutes les 5 minutes
  - Mise à jour en temps réel des données
- Import de fichiers Excel (backup)
- Analyse des prix et marges
- Graphiques interactifs (Chart.js)
- Stratégies de pricing
- Export des données
- Responsive design

## 🔗 Intégration Google Sheets

Le dashboard peut maintenant se connecter directement à votre Google Sheets pour synchroniser automatiquement les données de prix.

### Configuration rapide:
1. Cliquez sur "Configurer la connexion" dans le dashboard
2. Entrez l'ID de votre Google Sheet
3. Publiez votre Sheet en lecture seule
4. Les données se synchronisent automatiquement!

Voir [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) pour le guide complet.

## 🛡️ Note de sécurité

Cette solution utilise une authentification côté client pour la simplicité. Pour une sécurité renforcée en production, considérez :
- Netlify Identity ou Auth0 pour l'authentification
- Functions Netlify pour la validation côté serveur
- Variables d'environnement pour les secrets

## 📞 Support

Pour toute question ou problème, contactez l'équipe Leeket.

---

**Version**: 1.0.0
**Dernière mise à jour**: 2025