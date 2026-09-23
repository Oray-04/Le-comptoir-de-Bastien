# Le Comptoir de Bastien — site vitrine

Site statique en HTML/CSS/JavaScript, sans dépendance ni outil de compilation.
Il se met en ligne tel quel sur GitHub Pages, et se transférera sans modification
vers votre futur nom de domaine.

---

## 1. À compléter avant la mise en ligne

Deux éléments restent en attente. Le téléphone (06 47 29 40 36), l'e-mail
(lecomptoirdebastien@gmail.com) et les avis clients sont désormais renseignés.
Les tarifs ne sont plus affichés sur la page produits. Ils sont tous repérables
en cherchant `XX`, `VOTRE_ID` ou `—` dans les fichiers.

| Élément | Où | Comment le trouver |
|---|---|---|
| SIRET et forme juridique | `mentions-legales.html` | Chercher les `[crochets]` |
| Nom de domaine | Voir section 4 | Une fois le domaine acheté |

### Ajouter ou modifier un avis client

Les six avis Google actuels sont dans `index.html`, section commentée `AVIS CLIENTS`.
Chaque avis ressemble à ceci :

```html
<article class="review">
  <div class="stars">…</div>
  <blockquote>Le texte de l'avis.</blockquote>
  <p class="who">Sylvie H.<span class="source">Avis Google</span></p>
</article>
```

Le texte entre `<blockquote>` et `</blockquote>` est celui de l'avis ; le nom
s'écrit toujours en prénom suivi de l'initiale, jamais en nom complet, sauf accord
de la personne. Vous pouvez dupliquer ou retirer des blocs
`<article class="review">` : la grille s'adapte toute seule.

Astuce : ouvrez le dossier dans un éditeur de texte gratuit comme
[Visual Studio Code](https://code.visualstudio.com/), puis utilisez
« Rechercher dans les fichiers » (Ctrl+Maj+F) pour remplacer partout d'un coup.

---

## 2. Mise en ligne sur GitHub Pages

1. Créez un compte sur [github.com](https://github.com) si ce n'est pas déjà fait.
2. Cliquez sur **New repository**. Nommez-le par exemple `comptoir-de-bastien`
   et laissez-le en **Public** (obligatoire pour GitHub Pages en formule gratuite).
3. Sur la page du dépôt, cliquez **Add file → Upload files**, puis glissez-déposez
   **tout le contenu de ce dossier** (les fichiers `.html`, et les dossiers
   `css`, `js`, `img`). Validez avec **Commit changes**.
4. Allez dans **Settings → Pages**. Sous *Source*, choisissez **Deploy from a branch**,
   puis la branche `main` et le dossier `/ (root)`. Cliquez **Save**.
5. Patientez une à deux minutes. Votre site sera visible à l'adresse
   `https://VOTRE-PSEUDO.github.io/comptoir-de-bastien/`.

Le fichier `.nojekyll` présent dans le dossier évite que GitHub ne transforme
les fichiers au passage. Ne le supprimez pas.

---

## 3. Le contact se fait sans formulaire

La page Contact ne comporte pas de formulaire : elle met en avant le téléphone
et l'adresse e-mail sous forme de cartes cliquables. Sur mobile, un appui sur la
carte téléphone lance directement l'appel ; sur la carte e-mail, il ouvre la
messagerie avec l'adresse déjà remplie.

C'est volontaire : un formulaire sur site statique nécessite un service tiers,
et le visiteur ne sait jamais si son message est bien parti. Ici, il repart avec
un numéro qu'il peut enregistrer.

Pour modifier le numéro ou l'adresse, cherchez-les dans `contact.html` : ils
apparaissent à la fois dans le texte affiché et dans les liens `tel:` et `mailto:`.

---

## 4. Brancher votre nom de domaine

Une fois le domaine acheté (chez OVH, Gandi, Infomaniak…) :

1. Créez à la racine du dépôt un fichier nommé `CNAME` (sans extension)
   contenant une seule ligne : votre domaine, par exemple
   `lecomptoirdebastien.fr`.
2. Chez votre registrar, créez ces enregistrements DNS :
   - Quatre enregistrements **A** pointant vers `185.199.108.153`,
     `185.199.109.153`, `185.199.110.153` et `185.199.111.153`.
   - Un enregistrement **CNAME** pour `www` pointant vers
     `VOTRE-PSEUDO.github.io`.
3. Dans **Settings → Pages**, saisissez le domaine dans *Custom domain*
   et cochez **Enforce HTTPS** une fois le certificat délivré (quelques heures).

---

## 5. Modifier le contenu au quotidien

Tout est en HTML lisible, sans code compliqué.

- **Changer un prix** : ouvrez `produits.html` ou `salon-de-the.html`,
  cherchez le nom du produit, modifiez le montant entre
  `<span class="item-price">` et `</span>`.
- **Changer les horaires** : ils apparaissent dans plusieurs pages, générés
  par le tableau `<table class="hours">`. Modifiez-les à l'identique dans
  `index.html`, `nous-trouver.html` et `contact.html`.
- **Ajouter une photo** : déposez le fichier dans `img/`, puis reprenez la
  structure d'une carte existante en changeant `src` et le texte `alt`
  (le `alt` décrit la photo pour les personnes malvoyantes et pour Google).
- **Changer un texte** : modifiez directement entre les balises `<p>` et `</p>`.

Les couleurs sont toutes définies au même endroit, en haut de `css/style.css`,
dans le bloc `:root`. Modifier une valeur là met à jour tout le site.

---

## 6. Ce que contient le dossier

```
index.html              Accueil
produits.html           La gamme de biscuits, chocolats et coffrets
salon-de-the.html       La carte des boissons
la-maison.html          L'histoire de Bastien et de l'atelier
nous-trouver.html       Adresse, plan, horaires
contact.html            Formulaire et coordonnées
boutique-en-ligne.html  Page d'attente de la vente en ligne
mentions-legales.html   Obligations légales
404.html                Page affichée si une adresse n'existe pas
css/style.css           Toute la mise en forme
js/main.js              Menu mobile, apparition au défilement, jour surligné
img/                    Photos, logo et icône
media/                  Vidéo d'atelier et son image d'attente
.nojekyll               Nécessaire au bon fonctionnement de GitHub Pages
robots.txt              Autorise l'indexation par les moteurs de recherche
```

---

## 7. La vidéo d'arrière-plan

La vidéo de l'atelier (`media/atelier.mp4`, 22 secondes, sans son) est fixée
derrière tout le site. Elle n'apparaît que là où une section la laisse passer :
le bandeau de titre de chaque page, et les grands blocs de texte centrés de
l'accueil. Partout ailleurs, les sections opaques la masquent.

- **Pour la remplacer** : exportez une vidéo sans son, en MP4 (codec H.264),
  d'environ 20 secondes, et nommez-la `atelier.mp4`. Remplacez aussi
  `atelier-poster.jpg` par une image extraite de la nouvelle vidéo.
- **Sur mobile**, la vidéo est volontairement désactivée : seule l'image
  d'attente s'affiche. Une vidéo en boucle consomme trop de batterie et de
  données sur téléphone, et les navigateurs mobiles la bloquent souvent.
- **Pour supprimer la vidéo** : effacez le bloc `<div class="site-video">`
  de chaque page. L'image d'attente prendra sa place automatiquement.

---

## 8. Une fois en ligne

- Déclarez le site sur [Google Search Console](https://search.google.com/search-console)
  pour suivre votre visibilité.
- Ajoutez l'adresse du site sur votre fiche **Google Business Profile**, ainsi
  que dans la bio Instagram et Facebook.
- Créez un fichier `sitemap.xml` listant vos pages une fois le domaine défini :
  cela aide Google à toutes les découvrir.

---

## 9. Référencement : la seule chose à faire avant de publier

Le site est optimisé pour Google et pour les assistants comme ChatGPT.
Une seule action est indispensable : **remplacer le domaine provisoire**.

Partout dans les fichiers figure l'adresse `https://www.lecomptoirdebastien.fr`.
Tant que vous êtes sur GitHub Pages, remplacez-la par votre vraie adresse
(`https://VOTRE-PSEUDO.github.io/comptoir-de-bastien`), puis par votre domaine
quand vous l'aurez acheté.

Dans Visual Studio Code : Ctrl+Maj+F, « Rechercher dans les fichiers »,
puis Remplacer tout. Cela touche les fichiers `.html`, `sitemap.xml`,
`robots.txt` et `llms.txt`.

### Ce qui est déjà en place

- **Fiche d'établissement structurée** (`Bakery`) sur chaque page : nom, adresse,
  coordonnées GPS, horaires, téléphone, réseaux sociaux, note moyenne. C'est ce
  qui alimente la fiche latérale de Google et les réponses des assistants.
- **Questions fréquentes balisées** (`FAQPage`) sur l'accueil et sur « Nous trouver ».
  C'est le format que les IA reprennent le plus volontiers.
- **Fil d'Ariane** sur chaque page.
- **`sitemap.xml`** listant les huit pages.
- **`robots.txt`** autorisant explicitement les robots de ChatGPT, Claude,
  Perplexity et Google AI.
- **`llms.txt`** : un résumé en texte brut destiné aux assistants conversationnels.
  À mettre à jour quand la carte ou les horaires changent.
- Titres et descriptions uniques et calibrés sur chaque page.

### Après la mise en ligne

1. Déclarez le site sur [Google Search Console](https://search.google.com/search-console)
   et soumettez-y `sitemap.xml`.
2. Ajoutez l'adresse du site sur votre **fiche Google Business Profile** : pour un
   commerce local, cette fiche pèse plus lourd que le site lui-même.
3. Mettez le lien dans les bios Instagram et Facebook.
4. Demandez à l'office du tourisme de Riez et à celui du Verdon de vous référencer
   avec un lien : ce sont les liens les plus utiles pour un commerce de village.
