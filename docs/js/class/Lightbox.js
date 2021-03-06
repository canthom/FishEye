class Lightbox {
  static init() {
    const medias = Array.from(
      document.querySelectorAll('a[href$="jpg"], a[href$="mp4"]')
    );

    const gallery = medias.map((media) => ({
      url: media.getAttribute('href'),
      title: media.dataset.title,
    }));

    medias.forEach((media) =>
      media.addEventListener('click', (e) => {
        e.preventDefault();
        new Lightbox(
          e.currentTarget.getAttribute('href'),
          e.currentTarget.getAttribute('data-title'),
          gallery
        );
      })
    );
  }

  constructor(url, title, gallery) {
    this.element = this.render(url, title);
    this.gallery = gallery;
    this.url = url;
    this.onKeyChange = this.onKeyChange.bind(this);
    document.addEventListener('keydown', this.onKeyChange);
  }

  close(e) {
    e.preventDefault();
    const divCont = document.querySelector('.lightbox-container');
    divCont.parentElement.removeChild(divCont);
    document.removeEventListener('keyup', this.onKeyChange);

    // Accessibilité
    document.querySelector('header').setAttribute('aria-hidden', 'false');
    document.querySelector('main').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'visible';
  }

  next(e) {
    e.preventDefault();

    // Supprimer la précédente Lightbox
    const divCont = document.querySelector('.lightbox-container');
    divCont.parentElement.removeChild(divCont);

    // Trouver la Lightbox suivante
    let i = this.gallery.findIndex((media) => media.url === this.url);

    // Revenir au début de la gallerie
    if (i === this.gallery.length - 1) {
      i = -1;
    }

    // Afficher l'image suivante
    this.render(this.gallery[i + 1].url, this.gallery[i + 1].title);
  }

  onKeyChange(e) {
    if (e.key === 'Escape') {
      this.close(e);
    } else if (e.key === 'ArrowLeft') {
      this.prev(e);
    } else if (e.key === 'ArrowRight') {
      this.next(e);
    } else if (e.key === 'Tab') {
      if (document.querySelector('.lightbox__close') === document.activeElement) {
        e.preventDefault();
        document.querySelector('.lightbox__previous').focus();
      }
    }
  }

  prev(e) {
    e.preventDefault();

    // Supprimer la précédente Lightbox
    const divCont = document.querySelector('.lightbox-container');
    divCont.parentElement.removeChild(divCont);

    // Trouver la Lightbox suivante
    let i = this.gallery.findIndex((media) => media.url === this.url);

    // Aller à la fin de la gallerie
    if (i === 0) {
      i = this.gallery.length;
    }

    // Afficher l'image précédente
    this.render(this.gallery[i - 1].url, this.gallery[i - 1].title);
  }

  render(url, title) {
    // Création des éléments
    const divCont = document.createElement('div');
    const divBox = document.createElement('div');
    const btnPrev = document.createElement('button');
    const fig = document.createElement('figure');
    const figCaption = document.createElement('figcaption');
    const btnNext = document.createElement('button');
    const btnClose = document.createElement('button');

    // Ajout des Classes
    divCont.classList.add('lightbox-container');
    divBox.classList.add('lightbox');
    btnPrev.classList.add('lightbox__previous', 'lightbox__btn');
    fig.classList.add('lightbox__figure');
    figCaption.classList.add('lightbox__caption');
    btnNext.classList.add('lightbox__next', 'lightbox__btn');
    btnClose.classList.add('lightbox__close', 'lightbox__btn');

    // INNER HTML
    figCaption.innerHTML = title;

    // Ajout d'Attributs
    figCaption.setAttribute('id', 'lightboxTitle');

    // APPEND
    document.body.append(divCont);
    divCont.append(divBox);
    divBox.append(btnPrev, fig, btnNext, btnClose);
    fig.append(figCaption);

    if (url.endsWith('jpg')) {
      const mediaFig = document.createElement('img');
      mediaFig.classList.add('lightbox__img');
      mediaFig.setAttribute('src', `${url}`);
      mediaFig.setAttribute('alt', `${title}`);
      fig.append(mediaFig);
    }

    if (url.endsWith('mp4')) {
      const mediaFig = document.createElement('video');
      mediaFig.classList.add('lightbox__img');
      mediaFig.setAttribute('src', `${url}`);
      mediaFig.setAttribute('alt', `${title}`);
      mediaFig.setAttribute('controls', '');
      fig.append(mediaFig);
    }

    this.url = url;

    // EVENTS
    btnClose.addEventListener('click', this.close.bind(this));
    btnNext.addEventListener('click', this.next.bind(this));
    btnPrev.addEventListener('click', this.prev.bind(this));

    // Accessibilité
    divBox.setAttribute('role', 'menubar');
    divBox.setAttribute('aria-describedby', 'lightboxTitle');
    divBox.setAttribute('aria-label', 'Image aggrandie');
    document.querySelector('header').setAttribute('aria-hidden', 'true');
    document.querySelector('main').setAttribute('aria-hidden', 'true');
    btnClose.setAttribute('role', 'menuitem');
    btnClose.setAttribute('aria-label', 'Fermer');
    btnPrev.setAttribute('role', 'menuitem');
    btnPrev.setAttribute('aria-label', 'Précédent');
    btnNext.setAttribute('role', 'menuitem');
    btnNext.setAttribute('aria-label', 'Suivant');
    document.body.style.overflow = 'hidden';

    // Focus sur le Bouton Précédent
    btnPrev.focus();
  }
}

export { Lightbox };
