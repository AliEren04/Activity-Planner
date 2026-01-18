// Database Module - Dexie Configuration
// Dexie is loaded globally from libs/dexie.min.js
// Access it via window.Dexie or directly as Dexie

// Check if Dexie is available
if (typeof Dexie === 'undefined') {
  console.error('Dexie is not loaded! Make sure libs/dexie.min.js is included in index.html');
  throw new Error('Dexie library is required but not found');
}

// Initialize Dexie Database
const db = new Dexie('ActivityDB');

// Define database schema
db.version(1).stores({
  events: '++id, type, date, *searchFields'
});

// Event Schema Definitions
export const EVENT_SCHEMAS = {
  wedding: {
    fields: [
      { name: 'date', type: 'date', label: 'Date', labelTr: 'Tarih', required: true },
      { name: 'bride', type: 'text', label: 'Bride', labelTr: 'Gelin', required: true },
      { name: 'groom', type: 'text', label: 'Groom', labelTr: 'Damat', required: true },
      { name: 'place', type: 'text', label: 'Place', labelTr: 'Mekan', required: true },
      { name: 'postcode', type: 'text', label: 'Postcode', labelTr: 'Posta Kodu', required: false }
    ],
    title: 'Add New Wedding',
    titleTr: 'Yeni Düğün Ekle',
    icon: 'heart-fill'
  },
  funeral: {
    fields: [
      { name: 'date', type: 'date', label: 'Date', labelTr: 'Tarih', required: true },
      { name: 'deceased', type: 'text', label: 'Deceased Name', labelTr: 'Merhumun Adı', required: true },
      { name: 'place', type: 'text', label: 'Place', labelTr: 'Mekan', required: true },
      { name: 'time', type: 'time', label: 'Time', labelTr: 'Saat', required: true },
      { name: 'postcode', type: 'text', label: 'Postcode', labelTr: 'Posta Kodu', required: false },
      { name: 'notes', type: 'textarea', label: 'Notes', labelTr: 'Notlar', required: false }
    ],
    title: 'Add New Funeral',
    titleTr: 'Yeni Cenaze Ekle',
    icon: 'flower1'
  },
  breakfast: {
    fields: [
      { name: 'date', type: 'date', label: 'Date', labelTr: 'Tarih', required: true },
      { name: 'time', type: 'time', label: 'Time', labelTr: 'Saat', required: true },
      { name: 'host', type: 'text', label: 'Organiser', labelTr: 'Düzenleyen', required: true },
      { name: 'place', type: 'text', label: 'Place', labelTr: 'Mekan', required: true },
      { name: 'address', type: 'text', label: 'Address', labelTr: 'Adres', required: false },
      { name: 'postcode', type: 'text', label: 'Postcode', labelTr: 'Posta Kodu', required: false }
    ],
    title: 'Add New Breakfast',
    titleTr: 'Yeni Kahvaltı Ekle',
    icon: 'cup-hot-fill'
  },
  musical: {
    fields: [
      { name: 'date', type: 'date', label: 'Date', labelTr: 'Tarih', required: true },
      { name: 'time', type: 'time', label: 'Time', labelTr: 'Saat', required: true },
      { name: 'performer', type: 'text', label: 'Performer', labelTr: 'Sanatçı', required: true },
      { name: 'eventName', type: 'text', label: 'Event Name', labelTr: 'Etkinlik Adı', required: true },
      { name: 'place', type: 'text', label: 'Venue', labelTr: 'Mekan', required: true },
      { name: 'address', type: 'text', label: 'Address', labelTr: 'Adres', required: false },
      { name: 'postcode', type: 'text', label: 'Postcode', labelTr: 'Posta Kodu', required: false }
    ],
    title: 'Add New Musical Event',
    titleTr: 'Yeni Müzik Etkinliği Ekle',
    icon: 'music-note-beamed'
  }
};

// Database Operations
export const dbOperations = {
  // Add new event
  async addEvent(eventData) {
    try {
      const id = await db.events.add({
        ...eventData,
        createdAt: new Date().toISOString()
      });
      return { success: true, id };
    } catch (error) {
      console.error('Error adding event:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all events
  async getAllEvents() {
    try {
      const events = await db.events.toArray();
      // Sort by date (newest first)
      return events.sort((a, b) => {
        const dateA = new Date(a.date || 0);
        const dateB = new Date(b.date || 0);
        return dateA - dateB;
      });
    } catch (error) {
      console.error('Error getting events:', error);
      return [];
    }
  },

  // Get events by type
  async getEventsByType(type) {
    try {
      const events = await db.events.where('type').equals(type).toArray();
      return events.sort((a, b) => {
        const dateA = new Date(a.date || 0);
        const dateB = new Date(b.date || 0);
        return dateA - dateB;
      });
    } catch (error) {
      console.error('Error getting events by type:', error);
      return [];
    }
  },

  // Update event
  async updateEvent(id, updates) {
    try {
      await db.events.update(id, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating event:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete event
  async deleteEvent(id) {
    try {
      await db.events.delete(id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting event:', error);
      return { success: false, error: error.message };
    }
  },

  // Clear all events (for testing)
  async clearAll() {
    try {
      await db.events.clear();
      return { success: true };
    } catch (error) {
      console.error('Error clearing events:', error);
      return { success: false, error: error.message };
    }
  }
};

export default db;