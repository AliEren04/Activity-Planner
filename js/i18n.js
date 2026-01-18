// Translation Module
const translations = {
  en: {
    // App
    app_title: "Activity Planner",
    translate_btn: "Türkçe'ye Çevir",
    footer_rights: "All Rights Reserved",

    // Event Types
    select_event_type: "Select Event Type",
    choose_event: "-- Choose Event Type --",
    event_wedding: "Wedding",
    event_funeral: "Funeral",
    event_breakfast: "Breakfast",
    event_musical: "Musical Event",

    // Form
    add_event: "Add Event",

    // Filter
    filter_events: "Filter Events",
    filter_all: "All Events",

    // List Headers
    header_date: "Date",
    header_time: "Time",
    header_bride: "Bride",
    header_groom: "Groom",
    header_deceased: "Deceased",
    header_host: "Organiser",
    header_performer: "Performer",
    header_event_name: "Event Name",
    header_place: "Place",
    header_venue: "Venue",
    header_postcode: "Postcode",
    header_actions: "Actions",
    header_type: "Type",

    // Actions
    action_edit: "Edit",
    action_delete: "Delete",
    action_save: "Save",
    action_cancel: "Cancel",
    action_confirm_delete: "Are you sure you want to delete this event?",

    // Messages
    msg_event_added: "Event added successfully!",
    msg_event_updated: "Event updated successfully!",
    msg_event_deleted: "Event deleted successfully!",
    msg_error: "An error occurred. Please try again.",
    msg_no_events: "No events found.",
    msg_select_event_type: "Please select an event type to add.",

    // Empty state
    empty_title: "No Events Yet",
    empty_message:
      "Start by selecting an event type above and adding your first activity.",
  },
  tr: {
    // App
    app_title: "Etkinlik Planlayıcı",
    translate_btn: "Translate to English",
    footer_rights: "Tüm Hakları Saklıdır",

    // Event Types
    select_event_type: "Etkinlik Türü Seçin",
    choose_event: "-- Etkinlik Türü Seçin --",
    event_wedding: "Düğün",
    event_funeral: "Cenaze",
    event_breakfast: "Kahvaltı",
    event_musical: "Müzik Etkinliği",

    // Form
    add_event: "Etkinlik Ekle",

    // Filter
    filter_events: "Etkinlikleri Filtrele",
    filter_all: "Tüm Etkinlikler",

    // List Headers
    header_date: "Tarih",
    header_time: "Saat",
    header_bride: "Gelin",
    header_groom: "Damat",
    header_deceased: "Merhum",
    header_host: "Düzenleyen",
    header_performer: "Sanatçı",
    header_event_name: "Etkinlik Adı",
    header_place: "Mekan",
    header_venue: "Mekan",
    header_postcode: "Posta Kodu",
    header_actions: "İşlemler",
    header_type: "Tür",

    // Actions
    action_edit: "Düzenle",
    action_delete: "Sil",
    action_save: "Kaydet",
    action_cancel: "İptal",
    action_confirm_delete: "Bu etkinliği silmek istediğinizden emin misiniz?",

    // Messages
    msg_event_added: "Etkinlik başarıyla eklendi!",
    msg_event_updated: "Etkinlik başarıyla güncellendi!",
    msg_event_deleted: "Etkinlik başarıyla silindi!",
    msg_error: "Bir hata oluştu. Lütfen tekrar deneyin.",
    msg_no_events: "Etkinlik bulunamadı.",
    msg_select_event_type: "Lütfen eklemek için bir etkinlik türü seçin.",

    // Empty state
    empty_title: "Henüz Etkinlik Yok",
    empty_message:
      "Yukarıdan bir etkinlik türü seçerek ilk aktivitenizi ekleyin.",
  },
};

class I18n {
  constructor() {
    this.currentLang = "en";
    this.translations = translations;
  }

  // Get current language
  getCurrentLang() {
    return this.currentLang;
  }

  // Set language
  setLang(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      this.updateDOM();
      return true;
    }
    return false;
  }

  // Toggle between languages
  toggleLang() {
    this.currentLang = this.currentLang === "en" ? "tr" : "en";
    this.updateDOM();
    return this.currentLang;
  }

  // Get translated text
  t(key) {
    return this.translations[this.currentLang][key] || key;
  }

  // Update DOM elements with translations
  updateDOM() {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const translation = this.t(key);

      // Update text content or value based on element type
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        element.placeholder = translation;
      } else if (element.tagName === "OPTION") {
        element.textContent = translation;
      } else {
        element.textContent = translation;
      }
    });

    // Update HTML lang attribute
    document.documentElement.lang = this.currentLang;
  }

  // Get field label based on current language
  getFieldLabel(field) {
    return this.currentLang === "tr" ? field.labelTr : field.label;
  }
}

// Create and export singleton instance
const i18n = new I18n();
export default i18n;
