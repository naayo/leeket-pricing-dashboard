# 📊 Guide de Configuration Google Sheets pour Leeket Dashboard

## 🎯 Vue d'ensemble

Ce guide vous aidera à connecter votre Google Sheets au Dashboard Leeket pour synchroniser automatiquement vos données de prix.

## 📋 Prérequis

1. Un compte Google
2. Un fichier Google Sheets avec vos données de prix
3. Accès au Dashboard Leeket

## 🚀 Étapes de Configuration

### Étape 1: Préparer votre Google Sheet

#### Structure requise des colonnes

Votre Google Sheet doit contenir au minimum ces colonnes (les noms peuvent varier):

| Colonne | Noms acceptés | Description | Exemple |
|---------|--------------|-------------|---------|
| **Produit** | `Produit`, `Product`, `Nom` | Nom du produit | Thieboudienne |
| **Prix** | `Prix`, `Prix Marché`, `Price` | Prix du marché | 3500 |
| **Catégorie** | `Catégorie`, `Category` | Catégorie (optionnel) | Plats principaux |
| **Coût** | `Coût`, `Cost` | Coût du produit (optionnel) | 2275 |
| **Volume** | `Volume`, `Quantité` | Volume estimé (optionnel) | 450 |

#### Exemple de structure:

```
| Produit        | Prix | Catégorie       | Coût | Volume |
|---------------|------|-----------------|------|--------|
| Thieboudienne | 3500 | Plats principaux| 2275 | 450    |
| Yassa Poulet  | 3000 | Plats principaux| 1950 | 420    |
| Mafé          | 2800 | Plats principaux| 1820 | 280    |
```

### Étape 2: Rendre votre Google Sheet accessible

#### Option A: Publication Web (Recommandée - Plus simple)

1. Ouvrez votre Google Sheet
2. Allez dans **Fichier** > **Partager** > **Publier sur le Web**
3. Dans la fenêtre qui s'ouvre:
   - Sélectionnez la feuille spécifique ou "Document entier"
   - Choisissez le format **CSV** ou **Page web**
   - Cliquez sur **Publier**
4. Confirmez la publication
5. Gardez cette fenêtre ouverte, vous aurez besoin du lien

#### Option B: Partage public en lecture

1. Cliquez sur le bouton **Partager** (en haut à droite)
2. Cliquez sur **Obtenir le lien**
3. Changez de "Limité" à **"Tous les utilisateurs disposant du lien"**
4. Assurez-vous que l'option est sur **"Lecteur"**
5. Cliquez sur **Copier le lien**

### Étape 3: Obtenir l'ID de votre Google Sheet

L'ID se trouve dans l'URL de votre Google Sheet:

```
https://docs.google.com/spreadsheets/d/[VOTRE_ID_ICI]/edit#gid=0
```

**Exemple:**
- URL: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
- ID: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

### Étape 4: Configurer dans le Dashboard

1. Connectez-vous au Dashboard Leeket
2. Cliquez sur **"Configurer la connexion"** dans la section Google Sheets
3. Dans la page de configuration:
   - Collez l'ID de votre Google Sheet
   - Entrez le nom de la feuille (par défaut: "Sheet1")
   - Cliquez sur **"Sauvegarder la configuration"**
4. Testez la connexion avec le bouton **"Tester la connexion"**

### Étape 5: Vérifier la synchronisation

1. Retournez au Dashboard
2. Vous devriez voir:
   - ✅ "Google Sheets connecté" en vert
   - L'heure de la dernière synchronisation
   - Vos données importées dans les graphiques

## 🔄 Synchronisation Automatique

- **Fréquence:** Toutes les 5 minutes
- **Synchronisation manuelle:** Cliquez sur le bouton "Synchroniser"
- **Indicateur:** Une icône de chargement apparaît pendant la synchronisation

## 🛠️ Dépannage

### Problème: "Erreur de connexion"

**Solutions:**
1. Vérifiez que votre Google Sheet est bien publié ou partagé
2. Vérifiez que l'ID est correct (sans espaces)
3. Assurez-vous que le nom de la feuille correspond

### Problème: "Aucune donnée trouvée"

**Solutions:**
1. Vérifiez que votre Sheet contient des données
2. Vérifiez les noms des colonnes (voir tableau ci-dessus)
3. Assurez-vous qu'il n'y a pas de lignes vides en haut

### Problème: Erreur CORS

**Solutions:**
1. Utilisez la méthode "Publier sur le Web"
2. Attendez quelques minutes après la publication
3. Essayez de rafraîchir la page

## 📝 Format des données

### Prix
- Format numérique uniquement (pas de symbole FCFA)
- Utilisez le point comme séparateur décimal
- Exemple: `3500` ou `3500.50`

### Catégories suggérées
- Plats principaux
- Entrées
- Desserts
- Boissons
- Snacks
- Paniers

## 🔒 Sécurité

- Vos données restent dans Google Sheets
- Le Dashboard accède uniquement en lecture
- Aucune modification n'est faite sur votre Sheet
- Les données sont synchronisées localement dans votre navigateur

## 💡 Conseils

1. **Organisation:** Gardez une feuille dédiée aux prix dans votre Google Sheets
2. **Nommage:** Utilisez des noms de colonnes cohérents
3. **Validation:** Vérifiez vos données avant la synchronisation
4. **Backup:** Gardez une copie de sauvegarde de votre Sheet

## 📞 Support

Pour toute question ou problème:
1. Vérifiez d'abord ce guide
2. Testez avec les données d'exemple
3. Contactez l'équipe Leeket si le problème persiste

## 🎉 Prêt!

Une fois configuré, votre Dashboard se mettra à jour automatiquement avec les dernières données de votre Google Sheet!

---

**Note:** La synchronisation nécessite une connexion internet active.