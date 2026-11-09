// Crée les comptes admin et membre pour les tests : npm run seed
const mongoose = require("mongoose");
const config = require("./config");
const User = require("./api/users/users.model");

// Un compte par rôle, pour tester les droits d'accès
const ACCOUNTS = [
  { name: "admin", email: "admin@test.fr", password: "password", role: "admin" },
  { name: "membre", email: "membre@test.fr", password: "password", role: "member" }
];

(async () => {
  try {
    await mongoose.connect(config.mongoUri);
    for (const account of ACCOUNTS) {
      // Ignore les comptes existants : le script peut être relancé sans erreur de doublon
      const exists = await User.findOne({ email: account.email });
      if (exists) {
        console.log(`${account.email} existe déjà`);
        continue;
      }
      // save() déclenche le hook pre("save") qui hache le mot de passe
      await new User(account).save();
      console.log(`${account.email} créé (${account.role})`);
    }
  } catch (err) {
    console.error(err.message);
    // Signale l'échec du script à npm
    process.exitCode = 1;
  } finally {
    // Ferme la connexion, sinon le script ne se termine pas
    await mongoose.disconnect();
  }
})();