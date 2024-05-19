Sure, here's a revised version of your README with correct syntax and styled code blocks for better readability:

# React Notes App

## Utilisation

### Application Notes

1. **Se diriger dans le fichier "React-Notes-App"**
   - Ouvrez votre terminal et naviguez vers le répertoire de l'application:
     ```bash
     cd React-Notes-App
     ```

2. **Installer NPM et Node.js**
   - Assurez-vous que Node.js et npm (Node Package Manager) sont installés sur votre machine. Vous pouvez les télécharger et les installer depuis [Node.js](https://nodejs.org/).

3. **Démarrer l'application**
   - Exécutez la commande suivante pour installer les dépendances nécessaires et démarrer l'application:
     ```bash
     npm install
     npm start
     ```

4. **Attendre le démarrage du serveur**
   - Une fois les dépendances installées, le serveur de développement démarrera. L'application attendra le serveur API pour afficher les notes.

### Serveur API

1. **Le serveur API utilise un fichier `.json` et le service `json-server`**
   - Le serveur API utilise `json-server` pour fournir des données à l'application.

2. **Installer `json-server`**
   - Pour installer `json-server`, exécutez la commande suivante:
     ```bash
     npm install -g json-server
     ```

3. **Démarrer le serveur API**
   - Après avoir installé `json-server`, exécutez la commande suivante pour démarrer le serveur:
     ```bash
     json-server --watch db.json --port 4000
     ```

4. **Le serveur API est prêt**
   - Le serveur démarrera sur le port 4000 et l'application pourra communiquer avec le serveur `json-server`.

Voici un résumé des étapes:

1. Naviguer dans le dossier du projet:
   ```bash
   cd React-Notes-App
   ```

2. Installer les dépendances et démarrer l'application:
   ```bash
   npm install
   npm start
   ```

3. Installer et démarrer le serveur API:
   ```bash
   npm install -g json-server
   json-server --watch db.json --port 4000
   ```

Votre application React Notes est maintenant prête à être utilisée!
