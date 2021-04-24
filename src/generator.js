const Generator = ((function iife() {
  function createSegment() {
    const segment = document.createElement('div');
    segment.classList.add('ui', 'grey', 'inverted', 'segment');

    return segment;
  }

  function createHeaderBtns() {
    const btnGroup = document.createElement('div');
    btnGroup.classList.add('ui', 'icon', 'buttons', 'right', 'floated');

    function getCompleteBtn() {
      const completeBtn = document.createElement('button');
      completeBtn.classList.add('mini', 'ui', 'button', 'green', 'cardHeader-completeBtn', 'inverted');

      const completeIcon = document.createElement('i');
      completeIcon.classList.add('check', 'square', 'icon');

      completeBtn.addEventListener('click', () => {
        let undo = false;
        $('body')
          .toast({
            position: 'top center',
            showProgress: 'bottom',
            displayTime: 1600,
            message: `${completeBtn.masterObject.header.textContent} complete!!`,
            class: 'green inverted',
            classActions: 'basic left',
            closeOnClick: true,
            actions: [{
              text: 'Undo?',
              class: 'ui right labeled icon button black inverted',
              icon: 'undo',
              click: () => { undo = true; },
            }],
            onHide: () => {
              if (!undo) {
                completeBtn.masterObject.completeSelf();
              }
            },
          });
      });

      completeBtn.append(completeIcon);

      return completeBtn;
    }

    const completeBtn = getCompleteBtn();

    function getEditBtn() {
      const editBtn = document.createElement('button');
      editBtn.classList.add('mini', 'ui', 'button', 'blue', 'cardHeader-editBtn', 'inverted');

      const editIcon = document.createElement('i');
      editIcon.classList.add('edit', 'icon');

      editBtn.addEventListener('click', () => {
        editBtn.masterObject.editSelf();
      });

      editBtn.append(editIcon);

      return editBtn;
    }

    const editBtn = getEditBtn();

    function getDeleteBtn() {
      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('mini', 'ui', 'button', 'red', 'cardHeader-deleteBtn', 'inverted');

      const deleteIcon = document.createElement('i');
      deleteIcon.classList.add('trash', 'alternate', 'outline', 'icon');

      deleteBtn.addEventListener('click', () => {
        let undo = false;
        $('body')
          .toast({
            position: 'top center',
            showProgress: 'bottom',
            displayTime: 2000,
            message: `Deleting ${deleteBtn.masterObject.header.textContent}...`,
            class: 'red inverted',
            classActions: 'basic left',
            closeOnClick: true,
            actions: [{
              text: 'Undo?',
              class: 'ui right labeled icon button black inverted',
              icon: 'undo',
              click: () => { undo = true; },
            }],
            onHide: () => {
              if (!undo) {
                deleteBtn.masterObject.deleteSelf();
              }
            },
          });
      });

      deleteBtn.append(deleteIcon);

      return deleteBtn;
    }

    const deleteBtn = getDeleteBtn();

    btnGroup.append(completeBtn, editBtn, deleteBtn);

    return btnGroup;
  }

  function createProjectCard() {
    const card = document.createElement('div');
    card.classList.add('ui', 'inverted', 'card');

    function getCardFirstContent() {
      const cardContent = document.createElement('div');
      cardContent.classList.add('content');

      function getCardHeader() {
        const header = document.createElement('div');
        header.classList.add('header');

        const buttons = createHeaderBtns();
        const span = document.createElement('span');

        function getCardHeaderDivider() {
          const divider = document.createElement('div');
          divider.classList.add('ui', 'inverted', 'right', 'aligned', 'divider');

          return divider;
        }

        const divider = getCardHeaderDivider();
        header.span = span;
        header.buttons = buttons;

        header.append(buttons, span, divider);

        return header;
      }

      const cardHeader = getCardHeader();
      card.header = cardHeader.span;
      card.buttons = cardHeader.buttons;

      function getCardMeta() {
        const meta = document.createElement('div');
        meta.classList.add('meta');

        return meta;
      }

      const cardMeta = getCardMeta();
      card.meta = cardMeta;

      function getCardDesc() {
        const desc = document.createElement('div');
        desc.classList.add('description');

        return desc;
      }

      const cardDesc = getCardDesc();
      card.desc = cardDesc;

      cardContent.append(cardHeader, cardMeta, cardDesc);

      return cardContent;
    }

    const cardFirstContent = getCardFirstContent();
    card.firstContent = cardFirstContent;

    card.append(cardFirstContent);

    return card;
  }

  function createModal() {
    const modal = document.createElement('div');
    modal.classList.add('ui', 'inverted', 'modal');

    function getModalHeader() {
      const modalHeader = document.createElement('div');
      modalHeader.classList.add('header');

      return modalHeader;
    }

    const modalHeader = getModalHeader();
    modal.header = modalHeader;

    function getModalContent() {
      const modalContent = document.createElement('div');
      modalContent.classList.add('content');

      return modalContent;
    }

    const modalContent = getModalContent();
    modal.content = modalContent;

    function getModalActions() {
      const modalActions = document.createElement('div');
      modalActions.classList.add('actions');

      function getCancelBtn() {
        const cancelBtn = document.createElement('div');
        cancelBtn.classList.add('ui', 'red', 'inverted', 'right', 'labeled', 'icon', 'deny', 'button');

        cancelBtn.textContent = 'Cancel';

        const timesIcon = document.createElement('i');
        timesIcon.classList.add('times', 'icon');

        cancelBtn.append(timesIcon);

        return cancelBtn;
      }

      const cancelBtn = getCancelBtn();

      function getConfirmBtn() {
        const confirmBtn = document.createElement('div');
        confirmBtn.classList.add('ui', 'positive', 'right', 'labeled', 'icon', 'button');

        confirmBtn.textContent = 'Confirm';

        const checkIcon = document.createElement('i');
        checkIcon.classList.add('checkmark', 'icon');

        confirmBtn.append(checkIcon);

        return confirmBtn;
      }

      const confirmBtn = getConfirmBtn();

      modalActions.append(cancelBtn, confirmBtn);

      return modalActions;
    }

    const modalActions = getModalActions();
    modal.actions = modalActions;

    modal.append(modalHeader, modalContent, modalActions);

    return modal;
  }

  function createForm() {
    const form = document.createElement('form');
    form.classList.add('ui', 'form');

    const titleSegment = createSegment();

    function getTitleField() {
      const field = document.createElement('div');
      field.classList.add('field', 'required');

      const label = document.createElement('label');
      label.textContent = 'Title';

      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'title';

      field.append(label, input);

      return field;
    }

    const titleField = getTitleField();
    titleSegment.append(titleField);

    const descSegment = createSegment();

    function getDescField() {
      const field = document.createElement('div');
      field.classList.add('field', 'required');

      const label = document.createElement('label');
      label.textContent = 'Description';

      const textArea = document.createElement('textarea');
      textArea.rows = '2';
      textArea.name = 'description';

      field.append(label, textArea);

      return field;
    }

    const descField = getDescField();
    descSegment.append(descField);

    const prioritySegment = createSegment();

    function getPriorityField() {
      const field = document.createElement('div');
      field.classList.add('field');

      function getPriorityDropdown() {
        const dropdown = document.createElement('select');
        dropdown.classList.add('ui', 'dropdown');
        dropdown.name = 'priority';
        dropdown.id = 'new-form-priority-dropdown';

        function getDropdownOptions() {
          const label = document.createElement('option');
          label.value = '';
          label.textContent = 'Priority';

          const low = document.createElement('option');
          low.textContent = 'Low';
          low.value = '3';

          const normal = document.createElement('option');
          normal.textContent = 'Normal';
          normal.value = '2';

          const high = document.createElement('option');
          high.textContent = 'High';
          high.value = '1';

          return [label, high, normal, low];
        }

        const dropdownOptions = getDropdownOptions();

        dropdownOptions.forEach((option) => {
          dropdown.append(option);
        });

        return dropdown;
      }
      const priorityDropdown = getPriorityDropdown();

      const label = document.createElement('label');
      label.textContent = 'Priority';

      field.append(label, priorityDropdown);

      return field;
    }

    const priorityField = getPriorityField();
    prioritySegment.append(priorityField);

    const datesSegment = createSegment();

    function getDateFields() {
      function getDateStartedFields() {
        const fields = document.createElement('div');
        fields.classList.add('grouped', 'fields', 'field');

        function getDateStartedField() {
          const field = document.createElement('div');
          field.classList.add('field', 'disabled');
          field.id = 'new-form-dateStartedField';

          const label = document.createElement('label');
          label.textContent = 'Date Started';

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

            return calendar;
          }

          const calendar = getDateStartedCalendar();

          field.append(label, calendar);

          return field;
        }

        const dateField = getDateStartedField();

        function getDateStartedToggle() {
          const toggleField = document.createElement('div');
          toggleField.classList.add('inline', 'field');

          const toggle = document.createElement('div');
          toggle.classList.add('ui', 'toggle', 'checkbox');

          const input = document.createElement('input');
          input.id = 'new-form-dateStartedToggle';
          input.type = 'checkbox';
          input.tabIndex = '0';
          input.checked = true;

          const label = document.createElement('label');
          label.textContent = 'Did you begin today?';

          toggle.append(input, label);

          toggleField.append(toggle);

          return toggleField;
        }
        const toggleField = getDateStartedToggle();

        fields.append(dateField, toggleField);

        return fields;
      }

      function getDueDateFields() {
        const fields = document.createElement('div');
        fields.classList.add('grouped', 'fields', 'field');

        function getDueDateField() {
          const field = document.createElement('div');
          field.classList.add('field', 'disabled');
          field.id = 'new-form-dueDateField';

          const label = document.createElement('label');
          label.textContent = 'Due Date';

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

            return calendar;
          }

          const calendar = getDueDateCalendar();

          field.append(label, calendar);

          return field;
        }

        const dateField = getDueDateField();

        function getDueDateToggle() {
          const toggleField = document.createElement('div');
          toggleField.classList.add('inline', 'field');

          const toggle = document.createElement('div');
          toggle.classList.add('ui', 'toggle', 'checkbox');

          const input = document.createElement('input');
          input.id = 'new-form-dueDateToggle';
          input.type = 'checkbox';
          input.tabIndex = '0';

          const label = document.createElement('label');
          label.textContent = 'Is there a due date?';

          toggle.append(input, label);

          toggleField.append(toggle);

          return toggleField;
        }
        const toggleField = getDueDateToggle();

        fields.append(dateField, toggleField);

        return fields;
      }

      const fields = document.createElement('div');
      const dateStartedField = getDateStartedFields();
      const dueDateField = getDueDateFields();

      fields.classList.add('two', 'fields');
      fields.append(dateStartedField, dueDateField);

      return fields;
    }

    const datesField = getDateFields();
    datesSegment.append(datesField);

    function getErrorMessage() {
      const field = document.createElement('div');
      field.classList.add('ui', 'error', 'message');

      return field;
    }

    const errorMessage = getErrorMessage();

    form.append(titleSegment, prioritySegment, descSegment, datesSegment, errorMessage);

    function addResetBtn() {
      const resetBtn = document.createElement('div');
      resetBtn.classList.add('ui', 'left', 'floated', 'right', 'labeled', 'icon', 'button');
      resetBtn.textContent = 'Reset';

      resetBtn.onclick = () => { this.reset(); };

      const icon = document.createElement('i');
      icon.classList.add('undo', 'icon');

      resetBtn.append(icon);

      this.parentElement.parentElement.actions.append(resetBtn);
    }

    form.addResetBtn = addResetBtn;

    function formValidation() {
      // let formObj;
      // if (context === 'edit') {
      //   formObj = object === 'task' ? form.task : form.project;
      // };

      // $.fn.form.settings.rules.matchExistingProject = function(value) {

      //   return true
      // };

      // $.fn.form.settings.rules.matchExistingTask = function(value) {

      //   return true
      // // }

      // const matchExistingProjectRule = {
      //   type: 'matchExistingProject',
      //   prompt: 'Title must not match existing project'
      // }

      // const matchExistingTaskRule = {
      //   type: 'matchExistingTask',
      //   prompt: 'Title must not match existing task'
      // }

      $(this)
        .form({
          fields: {
            title: ['minLength[4]', 'empty'],
            description: ['minLength[8]', 'empty'],
          },
          onSuccess: () => {
            this.valid = true;
          },
          onFailure: () => {
            this.valid = false;
          },
        });
    }

    formValidation.call(form);
    form.valid = false;

    return form;
  }

  function createProjectPage() {
    const page = document.createElement('div');
    page.classList.add('ui', 'container');
    page.id = 'project-page-container';
    page.style.maxWidth = '750px';

    function getProjectPageSegment() {
      const segment = createSegment();
      segment.classList.remove('grey');
      segment.classList.add('vertically', 'divided', 'grid');

      function getProjectHeader() {
        const header = document.createElement('div');
        header.classList.add('ui', 'row');

        function getHeaderTitleColumn() {
          const column = document.createElement('div');
          column.classList.add('eight', 'wide', 'column');

          const heading = document.createElement('h2');
          heading.classList.add('header');
          heading.id = 'project-page-title';

          column.heading = heading;

          column.append(heading);

          return column;
        }

        const titleColumn = getHeaderTitleColumn();
        header.heading = titleColumn.heading;

        function getHeaderBtnColumn() {
          const btnsColumn = document.createElement('div');
          btnsColumn.classList.add('eight', 'wide', 'column');
          btnsColumn.id = 'project-page-header-btns-column';

          const headerBtns = createHeaderBtns();
          headerBtns.children.forEach((btnElem) => {
            const btn = btnElem;
            btn.classList.remove('mini');
          });

          page.buttons = headerBtns;

          btnsColumn.append(headerBtns);

          return btnsColumn;
        }

        const btnsColumn = getHeaderBtnColumn();

        header.append(titleColumn, btnsColumn);

        return header;
      }

      const segHeader = getProjectHeader();
      segment.heading = segHeader.heading;

      function getProjectDetails() {
        const details = document.createElement('div');
        details.classList.add('ui', 'two', 'column', 'row');
        details.id = 'project-page-details-row';

        function getPriorityColumn() {
          const column = document.createElement('div');
          column.classList.add('compact', 'left', 'floated', 'column');

          function getPrioritySegment() {
            const prioritySegment = createSegment();
            prioritySegment.classList.add('compact');

            const internalSegment = document.createElement('div');
            internalSegment.classList.add('ui', 'inverted', 'segment');

            const text = document.createElement('span');
            text.textContent = 'Priority: ';
            text.classList.add('ui', 'text');

            const priority = document.createElement('span');

            segment.priority = priority;

            internalSegment.append(text, priority);

            prioritySegment.append(internalSegment);

            return prioritySegment;
          }

          const prioritySegment = getPrioritySegment();

          column.append(prioritySegment);

          return column;
        }

        const priority = getPriorityColumn();

        function getDatesColumn() {
          const column = document.createElement('div');
          column.classList.add('compact', 'right', 'floated', 'column');
          column.style.display = 'flex';
          column.style.justifyContent = 'flex-end';

          const datesSegment = createSegment();

          segment.dates = datesSegment;

          column.append(datesSegment);

          return column;
        }

        const dates = getDatesColumn();

        details.append(priority, dates);

        return details;
      }

      const segDetails = getProjectDetails();

      function getProjectDesc() {
        const desc = document.createElement('div');
        desc.classList.add('ui', 'centered', 'row');

        const column = document.createElement('div');
        column.classList.add('column');

        const descSegment = createSegment();

        const internalSegment = document.createElement('div');
        internalSegment.classList.add('ui', 'inverted', 'segment');

        const span = document.createElement('span');
        span.classList.add('ui', 'text');

        segment.desc = span;

        internalSegment.append(span);

        descSegment.append(internalSegment);

        column.append(descSegment);

        desc.append(column);

        return desc;
      }
      const segDescription = getProjectDesc();

      function getProjectTasks() {
        const tasks = document.createElement('div');
        tasks.classList.add('ui', 'centered', 'row');

        const column = document.createElement('div');
        column.classList.add('column');

        const tasksSegment = createSegment();
        tasksSegment.id = 'project-page-tasks-segment';

        segment.tasks = tasksSegment;

        column.append(tasksSegment);

        tasks.append(column);

        return tasks;
      }
      const segTasks = getProjectTasks();

      segment.append(segHeader, segDetails, segDescription, segTasks);

      return segment;
    }

    const segment = getProjectPageSegment();
    page.segment = segment;

    page.append(segment);

    return page;
  }

  function createTaskCard() {
    const card = createProjectCard();

    return card;
  }

  function createTable() {
    const table = document.createElement('table');
    table.classList.add('ui', 'selectable', 'inverted', 'table');
    table.id = 'history-table';

    function getTableHeader() {
      const header = document.createElement('thead');
      const row = document.createElement('tr');

      function getColumnHeaders() {
        const titleHead = document.createElement('th');
        titleHead.classList.add('center', 'aligned');
        titleHead.textContent = 'Title';

        const priorityHead = document.createElement('th');
        priorityHead.textContent = 'Priority';

        const descHead = document.createElement('th');
        descHead.classList.add('center', 'aligned');
        descHead.textContent = 'Description';

        const startedHead = document.createElement('th');
        startedHead.classList.add('right', 'aligned');
        startedHead.textContent = 'Began on';

        const dueHead = document.createElement('th');
        dueHead.classList.add('right', 'aligned');
        dueHead.textContent = 'Due on';

        return [titleHead, priorityHead, descHead, startedHead, dueHead];
      }

      const columnHeaders = getColumnHeaders();

      columnHeaders.forEach((elem) => {
        row.append(elem);
      });

      header.append(row);

      return header;
    }

    const tableHeader = getTableHeader();
    table.header = tableHeader;

    function getTableBody() {
      const tableBody = document.createElement('tbody');
      tableBody.id = 'history-table-body';

      return tableBody;
    }

    const tableBody = getTableBody();
    table.body = tableBody;

    function getTableFooter() {
      const tableFooter = document.createElement('tfoot');
      const row = document.createElement('tr');

      const projectsCount = document.createElement('th');
      projectsCount.colSpan = '5';
      projectsCount.id = 'history-table-projects-count';

      row.append(projectsCount);

      tableFooter.append(row);

      return tableFooter;
    }

    const tableFooter = getTableFooter();
    table.footer = tableFooter;

    table.append(tableHeader, tableBody, tableFooter);

    return table;
  }

  return {
    createProjectCard,
    createProjectPage,
    createTaskCard,
    createSegment,
    createTable,
    createModal,
    createForm,
  };
})());

export default Generator;
