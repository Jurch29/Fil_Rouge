# Fil_Rouge
Groupe :
    BERGNEL Anthony
    IDDER BELAID
    BRUNEL Pierre
    MURAT Axel
    ROCHARD Julien

# Installation
Pour utiliser l'application il suffit d'extraire le dossier 'Fil_Rouge' du dossier compressé n'importe où sur une machine du réseau du département informatique de type linux.
Cet machine doit comporter :
    - npm (il faudra possiblement installer des dépendances avant d'utiliser l'application)
    - node
Vous trouvez un fichier 'logs' permettant de vous connecter aux différentes bases de données de notre groupe.
Dans la version actuelle, les identifiants et bases sont déjà initialisées pour l'utilisation sur 'obiwan2.univ-brest.fr'.

Si une des bases de données est vide, vous pourrez trouver des scripts de peuplement dans le dossier 'Peuplement'.

# Utilisation
Pour lancer le serveur node, placez-vous dans la racine de 'Fil_Rouge' et lancez la commande '(sudo) node dist/index.js'.
Le serveur aura par défaut le port 4000.
Pour lancer l'application cliente, placez-vous dans le dossier 'Fil_Rouge/client' et lancez la commande 'sudo npm start'.
L'application cliente aura par défaut le port 3000.

# Repertoire
http://github.com/Jurch29/Fil_Rouge