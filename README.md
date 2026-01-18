# Activity Planner

A fully offline-first desktop application for managing community activities including weddings, funerals, breakfasts, and musical events. Built specifically for the Turkish community in the UK with bilingual support (English ↔ Turkish).

## Features

✅ **Multiple Event Types**
- Weddings (Bride, Groom, Date, Place, Postcode)
- Funerals (Deceased, Date, Time, Place, Notes)
- Breakfasts (Host, Date, Time, Place, Address)
- Musical Events (Performer, Event Name, Date, Time, Venue)

 **Offline-First Architecture**
- All data stored locally with IndexedDB (Dexie.js)
- No internet connection required
- All libraries loaded locally (no CDNs)

**Security Features**
- Input sanitization with DOMPurify
- XSS prevention
- UK postcode validation
- Form validation

 **Bilingual Support**
- Toggle between English and Turkish
- All UI elements translated
- Date formatting localized

 **Modern UI/UX**
- Responsive design (mobile, tablet, desktop)
- Smooth CSS animations
- Bootstrap 5 styling
- Event type badges with color coding

## Project Structure

```
activity-planner/
├── index.html              # Main HTML file
├── package.json            # NW.js configuration
├── assets/
│   └── logo.png           # Application logo
├── css/
│   ├── custom.css         # Main styles
│   └── animations.css     # CSS animations
├── js/
│   ├── main.js           # Application controller
│   ├── db.js             # Database module (Dexie)
│   ├── ui.js             # UI rendering module
│   ├── i18n.js           # Translation module
│   └── sanitizer.js      # Security module
└── libs/                  # Local libraries (see below)
    ├── bootstrap.min.css
    ├── bootstrap.bundle.min.js
    ├── bootstrap-icons.css
    ├── dexie.min.js
    └── purify.min.js
```

## Installation & Setup

### Step 1: Download Dependencies

Create a `libs/` folder in your project root and download these libraries:

#### 1. Bootstrap 5.3.8 CSS
- URL: https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css
- Save as: `libs/bootstrap.min.css`

#### 2. Bootstrap 5.3.8 JS Bundle
- URL: https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js
- Save as: `libs/bootstrap.bundle.min.js`

#### 3. Bootstrap Icons 1.11.3
- Download: https://github.com/twbs/icons/releases/download/v1.11.3/bootstrap-icons-1.11.3.zip
- Extract and copy `bootstrap-icons.css` to `libs/`
- Copy the `fonts/` folder to `libs/fonts/`

#### 4. Dexie.js 4.0.10
- URL: https://unpkg.com/dexie@4.0.10/dist/dexie.min.js
- Save as: `libs/dexie.min.js`

#### 5. DOMPurify 3.2.2
- URL: https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.2.2/purify.min.js
- Save as: `libs/purify.min.js`

### Quick Download Script (Bash/Linux/macOS)

```bash
#!/bin/bash
mkdir -p libs

# Bootstrap CSS
curl -o libs/bootstrap.min.css https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css

# Bootstrap JS
curl -o libs/bootstrap.bundle.min.js https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js

# Dexie
curl -o libs/dexie.min.js https://unpkg.com/dexie@4.0.10/dist/dexie.min.js

# DOMPurify
curl -o libs/purify.min.js https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.2.2/purify.min.js

# Bootstrap Icons (manual extraction needed)
echo "Please download Bootstrap Icons manually from:"
echo "https://github.com/twbs/icons/releases/download/v1.11.3/bootstrap-icons-1.11.3.zip"
```

### Quick Download Script (PowerShell/Windows)

```powershell
# Create libs directory
New-Item -ItemType Directory -Force -Path libs

# Bootstrap CSS
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" -OutFile "libs/bootstrap.min.css"

# Bootstrap JS
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" -OutFile "libs/bootstrap.bundle.min.js"

# Dexie
Invoke-WebRequest -Uri "https://unpkg.com/dexie@4.0.10/dist/dexie.min.js" -OutFile "libs/dexie.min.js"

# DOMPurify
Invoke-WebRequest -Uri "https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.2.2/purify.min.js" -OutFile "libs/purify.min.js"

Write-Host "Please download Bootstrap Icons manually from:"
Write-Host "https://github.com/twbs/icons/releases/download/v1.11.3/bootstrap-icons-1.11.3.zip"
```

### Step 2: Install NW.js

```bash
npm install
```

### Step 3: Run in Development

```bash
npm start
```

### Step 4: Build for Distribution

Build for specific platforms:

```bash
# Windows 64-bit
npm run build:win

# macOS 64-bit
npm run build:mac

# Linux 64-bit
npm run build:linux

# All platforms
npm run build:all
```

Built applications will be in the `dist/` folder.

## Usage

### Adding Events

1. Select event type from dropdown (Wedding, Funeral, Breakfast, Musical)
2. Form appears with relevant fields
3. Fill in required fields (marked with *)
4. Click "Add Event" button
5. Event appears in the list below

### Filtering Events

Use the filter dropdown to show:
- All Events
- Only Weddings
- Only Funerals
- Only Breakfasts
- Only Musical Events

### Editing Events

1. Click the "Edit" button on any event
2. Form populates with existing data
3. Modify as needed
4. Click "Add Event" to save changes

### Deleting Events

1. Click the "Delete" button on any event
2. Confirm deletion in popup
3. Event is removed with animation

### Language Toggle

Click the "Türkçe'ye Çevir" / "Translate to English" button in the navbar to switch between English and Turkish.

## Database Schema

### Events Table

```javascript
{
  id: number (auto-increment),
  type: 'wedding' | 'funeral' | 'breakfast' | 'musical',
  date: string (YYYY-MM-DD),
  time?: string (HH:MM),
  // Type-specific fields
  bride?: string,
  groom?: string,
  deceased?: string,
  host?: string,
  performer?: string,
  eventName?: string,
  place: string,
  address?: string,
  postcode?: string,
  notes?: string,
  createdAt: string (ISO 8601),
  updatedAt?: string (ISO 8601)
}
```

## Security Features

1. **Input Sanitization**: All user inputs are sanitized using DOMPurify
2. **XSS Prevention**: HTML tags are stripped from text inputs
3. **Postcode Validation**: UK postcode format validation
4. **Date/Time Validation**: Proper format checking
5. **No CDN Dependencies**: All libraries loaded locally to prevent supply chain attacks

## Browser Compatibility

The application runs in NW.js (Chromium-based), ensuring consistent behavior across all platforms.

## Troubleshooting

### Issue: "Cannot find module 'dexie'"
- Ensure `libs/dexie.min.js` exists
- Check the script path in `index.html`

### Issue: "DOMPurify is not defined"
- Ensure `libs/purify.min.js` exists and is loaded before application scripts

### Issue: Bootstrap styles not loading
- Verify `libs/bootstrap.min.css` exists
- Check for Bootstrap Icons fonts in `libs/fonts/`

### Issue: Icons not showing
- Ensure Bootstrap Icons CSS and fonts are properly installed
- Check `libs/bootstrap-icons.css` references `./fonts/` correctly

## Future Enhancements

- [ ] Export events to CSV/PDF
- [ ] Print functionality
- [ ] Reminders/notifications
- [ ] Search functionality
- [ ] Recurring events
- [ ] Event templates
- [ ] Backup/restore database

## License

MIT License - See LICENSE file for details

## Author

Ali Eren Tabak © 2026

## Support

For issues or feature requests, please contact the developer.

---

**Note**: This application stores all data locally. No data is sent to external servers. Regular backups are recommended for important data.