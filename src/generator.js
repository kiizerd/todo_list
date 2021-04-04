const Generator = (function() {
  
  function createCard() {
    const card = document.createElement('div');
    card.classList.add('card')

    card.header = getCardHeader()
    card.body = getCardBody()

    function getCardHeader() {
      const header = document.createElement('h5');
      header.classList.add('card-header')

      return header
    }

    function getCardBody() {
      const body = document.createElement('div');
      body.classList.add('card-body');

      return body
    }

    card.append(card.header, card.body);

    return card
  }

  return { createCard }
})();

export { Generator }