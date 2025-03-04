let deck = document.getElementById('deck');
let suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades']
let ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King', 'Ace'];

for (let suit of suits) {
    for (let rank of ranks) {
        let card = new PlayingCard(rank, suit);
        deck.appendChild(card);
    }
}