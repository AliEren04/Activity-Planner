// UI Module - Handles all DOM manipulations and rendering
import { EVENT_SCHEMAS } from './db.js';
import i18n from './i18n.js';
import sanitizer from './sanitizer.js';

class UI {
  constructor() {
    this.currentEventType = null;
    this.currentFilter = 'all'; 
  }

  showForm(eventType) {
    this.currentEventType = eventType;
    const schema = EVENT_SCHEMAS[eventType];
    if (!schema) return;

    const formContainer = document.getElementById('formContainer');
    const formTitle = document.getElementById('formTitle');
    const formFields = document.getElementById('formFields');

    const title = i18n.getCurrentLang() === 'tr' ? schema.titleTr : schema.title;
    formTitle.innerHTML = `<i class="bi bi-${schema.icon}"></i> ${sanitizer.escapeHTML(title)}`;

    formFields.innerHTML = schema.fields.map(field => this.generateFormField(field)).join('');

    formContainer.style.display = 'block';
    formContainer.classList.remove('slide-up');
    formContainer.classList.add('slide-down');
  }

  hideForm() {
    const formContainer = document.getElementById('formContainer');
    formContainer.classList.remove('slide-down');
    formContainer.classList.add('slide-up');
    setTimeout(() => {
      formContainer.style.display = 'none';
      this.currentEventType = null;
    }, 300);
  }

  generateFormField(field) {
    const label = i18n.getFieldLabel(field);
    const required = field.required ? 'required' : '';
    let inputHTML = '';
    
    switch (field.type) {
      case 'date': inputHTML = `<input type="date" name="${sanitizer.escapeHTML(field.name)}" class="form-control" id="input-${sanitizer.escapeHTML(field.name)}" ${required}/>`; break;
      case 'time': inputHTML = `<input type="time" name="${sanitizer.escapeHTML(field.name)}" class="form-control" id="input-${sanitizer.escapeHTML(field.name)}" ${required}/>`; break;
      case 'textarea': inputHTML = `<textarea name="${sanitizer.escapeHTML(field.name)}" class="form-control" id="input-${sanitizer.escapeHTML(field.name)}" rows="3" ${required}></textarea>`; break;
      default: inputHTML = `<input type="text" name="${sanitizer.escapeHTML(field.name)}" class="form-control" id="input-${sanitizer.escapeHTML(field.name)}" ${required}/>`;
    }

    return `
      <div class="col-md-6">
        <label for="input-${sanitizer.escapeHTML(field.name)}" class="form-label">
          ${sanitizer.escapeHTML(label)}${field.required ? ' *' : ''}
        </label>
        ${inputHTML}
      </div>
    `;
  }

  renderEvents(events, filterType = 'all') {
    this.currentFilter = filterType;
    const eventList = document.getElementById('eventList');
    const filteredEvents = filterType === 'all' ? events : events.filter(e => e.type === filterType);

    this.updateListHeaders(filterType, filteredEvents);

    if (filteredEvents.length === 0) {
      eventList.innerHTML = `
        <li class="list-group-item empty-state fade-in">
          <p>${sanitizer.escapeHTML(i18n.t('empty_message'))}</p>
        </li>`;
      return;
    }

    eventList.innerHTML = filteredEvents.map(event => this.generateEventRow(event, false)).join('');
  }

  generateEventRow(event, isEditing = false) {
    const schema = EVENT_SCHEMAS[event.type];
    if (!schema) return '';

    const fields = schema.fields.filter(f => !['notes', 'address'].includes(f.name));
    const btnStyle = "width: 32px; height: 32px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 4px; border: none;";

    if (isEditing) {
      const fieldsHTML = fields.map(field => {
        const label = i18n.getFieldLabel(field);
        const value = event[field.name] || '';
        let inputHTML = `<input type="${field.type === 'date' ? 'date' : (field.type === 'time' ? 'time' : 'text')}" class="form-control form-control-sm edit-input" data-field="${field.name}" value="${sanitizer.escapeHTML(value)}">`;
        return `<li class="list-group-item" data-label="${sanitizer.escapeHTML(label)}:">${inputHTML}</li>`;
      }).join('');

      return `
        <li class="wedding-row event-row ${event.type} editing-mode" data-id="${event.id}" data-type="${event.type}">
          ${fieldsHTML}
          <li class="list-group-item d-flex align-items-center">
            <div class="btn-group gap-1">
              <button class="btn btn-success save-edit-btn" data-id="${event.id}" style="${btnStyle}">
                <i class="bi bi-check-lg"></i>
              </button>
              <button class="btn btn-secondary cancel-edit-btn" data-id="${event.id}" style="${btnStyle}">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </li>
        </li>`;
    } else {
      const fieldsHTML = fields.map(field => {
        const label = i18n.getFieldLabel(field);
        const value = this.formatFieldValue(field, event[field.name] || '-');
        return `
          <li class="list-group-item">
            ${this.currentFilter === 'all' ? `<div class="text-muted small fw-bold text-uppercase mb-1" style="font-size: 0.65rem;">${sanitizer.escapeHTML(label)}</div>` : ''}
            <div>${sanitizer.escapeHTML(value)}</div>
          </li>`;
      }).join('');

      // Changed from Icon to Text Name
      const typeBadgeHTML = `
        <li class="list-group-item bg-light">
          <div class="text-muted small fw-bold text-uppercase mb-1" style="font-size: 0.65rem;">${sanitizer.escapeHTML(i18n.t('header_type'))}</div>
          <span class="badge rounded-pill bg-dark text-white text-uppercase" style="font-size: 0.7rem; padding: 0.4em 0.8em;">
            ${sanitizer.escapeHTML(i18n.t('event_' + event.type))}
          </span>
        </li>`;

      return `
        <li class="wedding-row event-row ${event.type} add-animation" data-id="${event.id}" data-type="${event.type}">
          ${this.currentFilter === 'all' ? typeBadgeHTML : ''}
          ${fieldsHTML}
          <li class="list-group-item d-flex align-items-center justify-content-center">
            <div class="btn-group gap-1">
              <button class="btn btn-warning edit-btn" data-id="${event.id}" style="${btnStyle}">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button class="btn btn-danger delete-btn" data-id="${event.id}" style="${btnStyle}">
                <i class="bi bi-trash3-fill"></i>
              </button>
            </div>
          </li>
        </li>`;
    }
  }

  formatFieldValue(field, value) {
    if (!value || value === '-') return '-';
    if (field.type === 'date') return this.formatDate(value);
    return value;
  }

  formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const lang = i18n.getCurrentLang();
    return date.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3 bounce-in`;
    notification.style.zIndex = '9999';
    notification.innerHTML = `${sanitizer.escapeHTML(message)}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add('fade');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  animateRemove(element) {
    element.classList.add('remove-animation');
    return new Promise(resolve => setTimeout(() => { element.remove(); resolve(); }, 400));
  }

  resetForm() {
    const form = document.getElementById('eventForm');
    if (form) form.reset();
  }

  updateListHeaders(filterType, events) {
    const listHeader = document.getElementById('listHeader');
    const headerWrapper = listHeader.closest('.single-row-box');
    
    if (filterType === 'all' || events.length === 0) {
      listHeader.innerHTML = '';
      if (headerWrapper) headerWrapper.style.display = 'none';
      return;
    }

    if (headerWrapper) headerWrapper.style.display = 'block';
    const schema = EVENT_SCHEMAS[filterType];
    const fields = schema.fields.filter(f => !['notes', 'address'].includes(f.name));

    listHeader.innerHTML = fields.map(field => `
      <li class="list-group-item"><h5 class="fw-bold m-0" style="font-size: 1rem;">${sanitizer.escapeHTML(i18n.getFieldLabel(field))}</h5></li>
    `).join('') + `<li class="list-group-item"><h5 class="fw-bold m-0" style="font-size: 1rem;">${sanitizer.escapeHTML(i18n.t('header_actions'))}</h5></li>`;
  }
}

const ui = new UI();
export default ui;