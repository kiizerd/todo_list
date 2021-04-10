const Generator = (function() {
  
  function createCard() {
    const card = document.createElement('div');
    card.classList.add('ui', 'inverted', 'card', 'stackable');

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
    modal.classList.add('ui', 'inverted', 'modal');

    const modalHeader = modal.header = getModalHeader();    

    const modalContent = modal.content = getModalContent();    
    
    const modalActions = modal.actions = getModalActions();

    modal.append(modalHeader, modalContent, modalActions);

    return modal

    function getModalHeader() {
      const modalHeader = document.createElement('div');
      modalHeader.classList.add('header');
      
      return modalHeader
    };

    function getModalContent() {
      const modalContent = document.createElement('div');
      modalContent.classList.add('content');

      return modalContent
    };

    function getModalActions() {
      const modalActions = document.createElement('div');
      modalActions.classList.add('actions');

      const cancelBtn = getCancelBtn();
      const confirmBtn = getConfirmBtn();

      modalActions.append(cancelBtn, confirmBtn);

      return modalActions

      function getCancelBtn() {
        const cancelBtn = document.createElement('div');
        cancelBtn.classList.add('ui', 'black', 'right', 'labeled',
                                'icon', 'deny', 'button');

        cancelBtn.textContent = 'Cancel';

        const timesIcon = document.createElement('i')
        timesIcon.classList.add('times', 'icon');

        cancelBtn.append(timesIcon);

        return cancelBtn
      };

      function getConfirmBtn() {
        const confirmBtn = document.createElement('div');
        confirmBtn.classList.add('ui', 'positive', 'right', 'labeled',
                                 'icon', 'button');

        confirmBtn.textContent = 'Confirm';

        const checkIcon = document.createElement('i');
        checkIcon.classList.add('checkmark', 'icon');

        confirmBtn.append(checkIcon);

        return confirmBtn
      };

    }

  }

  function createForm() {
    const form = document.createElement('form');
    form.classList.add('ui', 'form');

    const titleSegment = createSegment();
    const titleField = getTitleField();
    titleSegment.append(titleField);

    const descSegment = createSegment();
    const descField = getDescField();
    descSegment.append(descField);

    const prioritySegment = createSegment();
    const priorityField = getPriorityField();
    prioritySegment.append(priorityField);

    const datesSegment = createSegment();
    const datesField = getDateFields();
    datesSegment.append(datesField);

    form.append(titleSegment, prioritySegment, descSegment, datesSegment);

    return form

    function getTitleField() {
      const field = document.createElement('div');
      field.classList.add('field');

      const label = document.createElement('label');
      label.textContent = 'Title';

      const input = document.createElement('input');
      input.type = 'text';

      field.append(label, input);

      return field
    };

    function getDescField() {
      const field = document.createElement('div');
      field.classList.add('field');

      const label = document.createElement('label');
      label.textContent = 'Description';

      const textArea = document.createElement('textarea');
      textArea.rows = '2';

      field.append(label, textArea);

      return field
    };

    function getPriorityField() {
      const field = document.createElement('div');
      field.classList.add('field');

      const label = document.createElement('label');
      label.textContent = 'Priority';

      const priorityDropdown = getPriorityDropdown();

      field.append(label, priorityDropdown);

      return field

      function getPriorityDropdown() {
        const dropdown = document.createElement('select');
        dropdown.classList.add('ui', 'dropdown');
        dropdown.name = 'priority';
        dropdown.id = 'new-form-priority-dropdown';

        const dropdownOptions = getDropdownOptions();

        for (const option of dropdownOptions) {
          dropdown.append(option);
        }

        return dropdown

        function getDropdownOptions() {
          const label = document.createElement('option');
          label.value = "";
          label.textContent = 'Priority';

          const low = document.createElement('option');
          low.textContent = 'Low';
          low.value = '2';
          
          const normal = document.createElement('option');
          normal.textContent = 'Normal';
          normal.value = '1';

          const high = document.createElement('option');
          high.textContent = 'High';
          high.value = '0';

          return [label, high, normal, low]
        };

      };

    };

    function getDateFields() {
      const fields = document.createElement('div');
      fields.classList.add('two', 'fields');

      const dateStartedField = getDateStartedFields();
      const dueDateField = getDueDateFields()

      fields.append(dateStartedField, dueDateField);

      return fields;

      function getDateStartedFields() {
        const fields = document.createElement('div');
        fields.classList.add('grouped', 'fields', 'field');

        const dateField = getDateStartedField();
        const toggleField = getDateStartedToggle();

        fields.append(dateField, toggleField);

        return fields

        function getDateStartedToggle() {
          const toggleField = document.createElement('div')
          toggleField.classList.add('inline', 'field');

          const toggle = document.createElement('div');
          toggle.classList.add('ui', 'toggle', 'checkbox');
          
          const input = document.createElement('input');
          input.id = 'new-form-dateStartedToggle';
          input.type = 'checkbox';
          input.tabIndex = '0';
          input.checked = true

          const label = document.createElement('label');
          label.textContent = 'Did you begin today?'

          toggle.append(input, label);

          toggleField.append(toggle);

          return toggleField
        }

        function getDateStartedField() {
          const field = document.createElement('div');
          field.classList.add('field', 'disabled');
          field.id = 'new-form-dateStartedField';

          const label = document.createElement('label');
          label.textContent = 'Date Started';

          const calendar = getDateStartedCalendar();

          field.append(label, calendar);

          return field

          function getDateStartedCalendar() {
            const calendar = document.createElement('div');
            calendar.classList.add('ui', 'calendar');

            const inputDiv = document.createElement('div');
            inputDiv.classList.add('ui', 'input', 'left', 'icon');

            const icon = document.createElement('i');
            icon.classList.add('calendar', 'icon');

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Pick a start date';
            input.name = 'dateStarted';

            inputDiv.append(icon, input);

            calendar.append(inputDiv);

            return calendar
          };

        };

      };

      function getDueDateFields() {
        const fields = document.createElement('div');
        fields.classList.add('grouped', 'fields', 'field');

        const dateField = getDueDateField();
        const toggleField = getDueDateToggle();

        fields.append(dateField, toggleField);

        return fields

        function getDueDateToggle() {
          const toggleField = document.createElement('div')
          toggleField.classList.add('inline', 'field');

          const toggle = document.createElement('div');
          toggle.classList.add('ui', 'toggle', 'checkbox');

          const input = document.createElement('input');
          input.id = 'new-form-dueDateToggle';
          input.type = 'checkbox';
          input.tabIndex = '0';

          const label = document.createElement('label');
          label.textContent = 'Is there a due date?'

          toggle.append(input, label);

          toggleField.append(toggle);

          return toggleField
        }

        function getDueDateField() {
          const field = document.createElement('div');
          field.classList.add('field', 'disabled');
          field.id = 'new-form-dueDateField';

          const label = document.createElement('label');
          label.textContent = 'Due Date';

          const calendar = getDueDateCalendar();

          field.append(label, calendar);

          return field

          function getDueDateCalendar() {
            const calendar = document.createElement('div');
            calendar.classList.add('ui', 'calendar');

            const inputDiv = document.createElement('div');
            inputDiv.classList.add('ui', 'input', 'left', 'icon');

            const icon = document.createElement('i');
            icon.classList.add('calendar', 'icon');

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Pick a due date';
            input.name = 'dueDate';

            inputDiv.append(icon, input);

            calendar.append(inputDiv);

            return calendar
          };

        };

      };

    };

  };

  function createSegment() {
    const segment = document.createElement('div');
    segment.classList.add('ui', 'grey', 'inverted', 'segment');

    return segment
  };

  return { createCard, createModal, createForm }
})();

export { Generator }