// Main Application Controller
import { dbOperations, EVENT_SCHEMAS } from './db.js';
import i18n from './i18n.js';
import sanitizer from './sanitizer.js';
import ui from './ui.js';

class App {
  constructor() {
    this.currentFilter = 'all';
    this.editingEventId = null;
  }

  // Initialize application
  async init() {
    try {
      // Setup event listeners
      this.setupEventListeners();
      
      // Load initial data
      await this.loadEvents();
      
      // Initialize translations
      i18n.updateDOM();
      
      console.log('Application initialized successfully');
    } catch (error) {
      console.error('Error initializing application:', error);
      ui.showNotification(i18n.t('msg_error'), 'danger');
    }
  }

  // Setup all event listeners
  setupEventListeners() {
    // Event type selector
    const eventTypeSelector = document.getElementById('eventTypeSelector');
    eventTypeSelector.addEventListener('change', (e) => {
      const eventType = e.target.value;
      if (eventType) {
        ui.showForm(eventType);
      } else {
        ui.hideForm();
      }
    });

    // Form submission
    const eventForm = document.getElementById('eventForm');
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    // Filter selector
    const filterSelector = document.getElementById('filterSelector');
    filterSelector.addEventListener('change', (e) => {
      this.currentFilter = e.target.value;
      this.loadEvents();
    });

    // Translation button
    const translateBtn = document.getElementById('translate-btn');
    translateBtn.addEventListener('click', () => {
      i18n.toggleLang();
      this.refreshUI();
    });

    // Event delegation for edit/delete buttons
    const eventList = document.getElementById('eventList');
    eventList.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.edit-btn');
      const deleteBtn = e.target.closest('.delete-btn');
      const saveEditBtn = e.target.closest('.save-edit-btn');
      const cancelEditBtn = e.target.closest('.cancel-edit-btn');

      if (editBtn) {
        const id = parseInt(editBtn.dataset.id);
        this.handleInlineEdit(id);
      } else if (deleteBtn) {
        const id = parseInt(deleteBtn.dataset.id);
        this.handleDelete(id);
      } else if (saveEditBtn) {
        const id = parseInt(saveEditBtn.dataset.id);
        this.handleSaveEdit(id);
      } else if (cancelEditBtn) {
        this.handleCancelEdit();
      }
    });
  }

  // Handle form submission (add or update)
  async handleFormSubmit() {
    try {
      const form = document.getElementById('eventForm');
      const formData = new FormData(form);
      const eventType = ui.currentEventType;

      if (!eventType) {
        ui.showNotification(i18n.t('msg_select_event_type'), 'warning');
        return;
      }

      const schema = EVENT_SCHEMAS[eventType];
      
      // Convert FormData to object
      const data = {};
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }

      // Validate and sanitize
      const validation = sanitizer.validateAndSanitize(data, schema);

      if (!validation.isValid) {
        const errorMsg = validation.errors.join('\n');
        ui.showNotification(errorMsg, 'danger');
        
        // Shake animation for form
        const formContainer = document.getElementById('formContainer');
        formContainer.classList.add('shake');
        setTimeout(() => formContainer.classList.remove('shake'), 500);
        
        return;
      }

      // Add event type to data
      const eventData = {
        ...validation.data,
        type: eventType
      };

      // Check if editing or adding
      if (this.editingEventId) {
        // Update existing event
        const result = await dbOperations.updateEvent(this.editingEventId, eventData);
        
        if (result.success) {
          ui.showNotification(i18n.t('msg_event_updated'), 'success');
          this.editingEventId = null;
        } else {
          throw new Error(result.error);
        }
      } else {
        // Add new event
        const result = await dbOperations.addEvent(eventData);
        
        if (result.success) {
          ui.showNotification(i18n.t('msg_event_added'), 'success');
        } else {
          throw new Error(result.error);
        }
      }

      // Reset form and reload events
      ui.resetForm();
      ui.hideForm();
      document.getElementById('eventTypeSelector').value = '';
      await this.loadEvents();

    } catch (error) {
      console.error('Error submitting form:', error);
      ui.showNotification(i18n.t('msg_error'), 'danger');
    }
  }

  // Handle edit event
  async handleEdit(id) {
    try {
      const events = await dbOperations.getAllEvents();
      const event = events.find(e => e.id === id);

      if (!event) {
        ui.showNotification(i18n.t('msg_error'), 'danger');
        return;
      }

      // Set editing mode
      this.editingEventId = id;

      // Show form for this event type
      document.getElementById('eventTypeSelector').value = event.type;
      ui.showForm(event.type);

      // Populate form fields
      const schema = EVENT_SCHEMAS[event.type];
      schema.fields.forEach(field => {
        const input = document.getElementById(`input-${field.name}`);
        if (input && event[field.name]) {
          input.value = event[field.name];
        }
      });

      // Scroll to form
      document.getElementById('formContainer').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });

    } catch (error) {
      console.error('Error editing event:', error);
      ui.showNotification(i18n.t('msg_error'), 'danger');
    }
  }

  // Handle inline edit (edit directly in list)
  async handleInlineEdit(id) {
    try {
      const events = await dbOperations.getAllEvents();
      const event = events.find(e => e.id === id);

      if (!event) {
        ui.showNotification(i18n.t('msg_error'), 'danger');
        return;
      }

      // Store currently editing ID
      this.editingEventId = id;

      // Find the event row and replace with edit mode
      const eventRow = document.querySelector(`[data-id="${id}"]`);
      if (eventRow) {
        const editHTML = ui.generateEventRow(event, true);
        eventRow.outerHTML = editHTML;
      }

    } catch (error) {
      console.error('Error inline editing event:', error);
      ui.showNotification(i18n.t('msg_error'), 'danger');
    }
  }

  // Handle save inline edit
  async handleSaveEdit(id) {
    try {
      const eventRow = document.querySelector(`[data-id="${id}"]`);
      if (!eventRow) return;

      const eventType = eventRow.dataset.type;
      const schema = EVENT_SCHEMAS[eventType];

      // Collect data from input fields
      const data = {};
      const inputs = eventRow.querySelectorAll('.edit-input');
      inputs.forEach(input => {
        const fieldName = input.dataset.field;
        data[fieldName] = input.value;
      });

      // Validate and sanitize
      const validation = sanitizer.validateAndSanitize(data, schema);

      if (!validation.isValid) {
        const errorMsg = validation.errors.join('\n');
        ui.showNotification(errorMsg, 'danger');
        
        // Shake animation
        eventRow.classList.add('shake');
        setTimeout(() => eventRow.classList.remove('shake'), 500);
        
        return;
      }

      // Update in database
      const result = await dbOperations.updateEvent(id, validation.data);

      if (result.success) {
        ui.showNotification(i18n.t('msg_event_updated'), 'success');
        this.editingEventId = null;
        await this.loadEvents();
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      console.error('Error saving edit:', error);
      ui.showNotification(i18n.t('msg_error'), 'danger');
    }
  }

  // Handle cancel inline edit
  async handleCancelEdit() {
    this.editingEventId = null;
    await this.loadEvents();
  }

  // Handle delete event
  async handleDelete(id) {
    try {
      // Confirm deletion
      const confirmed = confirm(i18n.t('action_confirm_delete'));
      
      if (!confirmed) return;

      // Find the event row
      const eventRow = document.querySelector(`[data-id="${id}"]`);

      // Animate removal
      if (eventRow) {
        await ui.animateRemove(eventRow);
      }

      // Delete from database
      const result = await dbOperations.deleteEvent(id);

      if (result.success) {
        ui.showNotification(i18n.t('msg_event_deleted'), 'success');
        await this.loadEvents();
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      console.error('Error deleting event:', error);
      ui.showNotification(i18n.t('msg_error'), 'danger');
      // Reload to ensure consistency
      await this.loadEvents();
    }
  }

  // Load events from database
  async loadEvents() {
    try {
      const events = this.currentFilter === 'all'
        ? await dbOperations.getAllEvents()
        : await dbOperations.getEventsByType(this.currentFilter);

      ui.renderEvents(events, this.currentFilter);
    } catch (error) {
      console.error('Error loading events:', error);
      ui.showNotification(i18n.t('msg_error'), 'danger');
    }
  }

  // Refresh UI after language change
  async refreshUI() {
    // Reload events to update labels
    await this.loadEvents();
    
    // If form is visible, refresh it
    if (ui.currentEventType) {
      ui.showForm(ui.currentEventType);
    }
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

// Export for potential external use
export default App;