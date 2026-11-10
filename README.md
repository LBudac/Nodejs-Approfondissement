# API des articles

**Étude de cas Node.js**, par Laurentiu Budac

Suite de l'API de gestion des utilisateurs : ajout d'une ressource Article (création, modification, suppression, liste publique par auteur), avec temps réel via socket.io, tests unitaires et configuration de déploiement PM2.

## Prérequis

- Node.js
- MongoDB Community Server 7.0, démarré sur le port 27017

## Installation

```bash
git clone https://github.com/LBudac/Nodejs-Approfondissement.git
cd Nodejs-Approfondissement
npm install
npm run seed    # crée les comptes de test
npm run serve   # lance l'API sur http://localhost:3000
```

## Comptes de test

Créés par npm run seed (script seed-admin.js), pour le développement uniquement. Le script peut être relancé sans erreur.

| Rôle   | E-mail         | Mot de passe |
|--------|----------------|--------------|
| admin  | admin@test.fr  | password     |
| member | membre@test.fr | password     |

## 1. Rédigez un diagramme UML de la base de données

![Diagramme UML](Diagramme%20UML.png)

Le deuxième PNG ajoute l'énumération de status demandé dans l'exercice 2
![Diagramme UML](Diagramme%20UML%20avec%20énumeration%20de%20article.png)


## 6. Déploiement avec PM2

La configuration PM2 est dans ecosystem.config.js

```bash
npm install -g pm2
pm2 start ecosystem.config.js --env production
```

`ecosystem.config.js` lance 3 instances en mode cluster, enregistre les erreurs dans `./logs/err.log` et redémarre une instance qui dépasse 200 Mo.

```bash
pm2 list         # 3 instances en mode cluster
pm2 logs         # journaux en direct
pm2 delete all   # tout arrêter
```
