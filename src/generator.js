import { Modal } from 'bootstrap';

const Generator = (function() {
  
  function createCard() {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardFirstContent = getCardFirstContent();
    card.firstContent = cardFirstContent;

    function getCardFirstContent() {
      const cardContent = document.createElement('div');
      cardContent.classList.add('content');
      
      const cardHeader = getCardHeader();
      card.header = cardHeader;

      const cardMeta = getCardMeta();
      card.meta = cardMeta;

      const cardDesc = getCardDesc();
      card.desc = cardDesc;

      cardContent.append(cardHeader, cardMeta, cardDesc);

      return cardContent
      
      function getCardHeader() {
        const header = document.createElement('h5');
        header.classList.add('header');
        
        return header
      }

      function getCardMeta() {
        const meta = document.createElement('div');
        meta.classList.add('meta');

        return meta
      }
      
      function getCardDesc() {
        const desc = document.createElement('div');
        desc.classList.add('description');
        
        return desc
      }
    }

    card.append(cardFirstContent);

    return card
  }

  function createModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.tabIndex = '-1';

    const modalDialog = getModalDialog();

    function getModalDialog() {
      const dialog = document.createElement('div');
      dialog.classList.add('modal-dialog');

      const content = getModalContent();

      dialog.append(content);

      return dialog;
    }

    function getModalContent() {
      const content = document.createElement('div');
      content.classList.add('modal-content', 'bg-dark', 'text-white');
      content.classList.add('border', 'border-dark');

      const header = getModalHeader();

      function getModalHeader() {
        const header = document.createElement('div');
        header.classList.add('modal-header', 'border-darkgray');

        const title = getModalTitle();

        function getModalTitle() {
          const h = document.createElement('h5');
          h.classList.add('modal-title');
          h.textContent = 'Modal Title';
          
          return h
        }

        const closeBtn = getCloseBtn();

        function getCloseBtn() {
          const btn = document.createElement('button');
          btn.classList.add('btn-close', 'btn-close-white');
          btn.type = 'button';
          btn.setAttribute('data-bs-dismiss', 'modal');
          btn.setAttribute('aria-label', 'Close');

          return btn
        }
        
        header.append(title, closeBtn);

        return header
      }
      
      const body = getModalBody();

      function getModalBody() {
        const body = document.createElement('div');
        body.classList.add('modal-body');

        return body
      }

      const footer = getModalFooter();

      function getModalFooter() {
        const footer = document.createElement('div');
        footer.classList.add('modal-footer', 'border-darkgray');
        
        const closeBtn = getFooterCloseBtn();

        function getFooterCloseBtn() {
          const btn = document.createElement('button');
          btn.setAttribute('data-bs-dismiss', 'modal');
          btn.classList.add('btn', 'btn-secondary');
          btn.textContent = 'Close'
          
          return btn
        }

        const successBtn = getSuccessBtn();

        function getSuccessBtn() {
          const btn = document.createElement('button');
          btn.classList.add('btn', 'btn-success');
          btn.textContent = 'Success!';

          return btn
        }

        footer.append(closeBtn, successBtn);

        return footer
      }

      content.append(header, body, footer);

      return content
    }

    modal.append(modalDialog);
    
    const modalObj = new Modal(modal, {});

    return modalObj
  }

  function createForm() {
    const form = document.createElement('form');

    return form
  }

  return { createCard, createModal, createForm }
})();

export { Generator }