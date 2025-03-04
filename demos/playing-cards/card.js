// < ========================================================
// < PlayingCard Custom HTML Element / Class
// < ========================================================

class PlayingCard extends HTMLElement {
    static get observedAttributes() {
        return ['rank', 'suit', 'flipped'];
    }
    constructor(rank, suit, flipped = 'false') {
        super();
        this.initialised = false;
        this.setAttribute('rank', rank);
        this.setAttribute('suit', suit);
        this.setAttribute('flipped', flipped);
    }

    // > Update the img child of this card
    updateImage() {
        let flipped = this.getAttribute('flipped') === 'true';
        if (flipped) {
            let filename = 'assets/cards/back.svg';
            this._image.setAttribute('src', filename);
        }
        else {
            let rank = this.getAttribute('rank');
            let suit = this.getAttribute('suit');
            let filename = `assets/cards/${rank}_${suit}.svg`;
            this._image.setAttribute('src', filename);
        }
    }

    // > Simple method to flip the card
    flip() {
        let flipped = this.getAttribute('flipped') === 'true';
        this.setAttribute('flipped', !flipped);
    }

    // ~ ========================================================
    // ~ Special Methods
    // ~ ========================================================

    // > Callback when an observed attribute changes
    attributeChangedCallback(name, current, value) {
        if (this.initialised) {
            this.updateImage();
        }
    }

    // > Callback when the element is added to the DOM
    connectedCallback() {
        if (!this.initialised) {
            this._image = document.createElement('img');
            this._image.setAttribute('alt', 'alt');
            this.appendChild(this._image);
            this.updateImage();
            this.addEventListener('click', () => {
                this.flip();
            });
            this.initialised = true;
        }
    }

}

// < ========================================================
// < Execution
// < ========================================================

// > Register the custom element as <playing-card> for DOM usage
customElements.define('playing-card', PlayingCard);