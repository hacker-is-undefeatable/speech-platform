# Project Reorganization Guide

## Completed
- ✅ Created folder structure for all pages (Home, Login, About, Pricing, Transcribe, Files, Settings, Help)
- ✅ Created services and utils folders
- ✅ Moved Home.js and Home.css into Home/ folder with index.js export

## Remaining Steps to Complete Reorganization

### Frontend File Organization

#### 1. Move Page Files to Subfolders

Copy these files to their respective folders:

**Login Page:**
- Copy `frontend/src/pages/Login.js` → `frontend/src/pages/Login/Login.js`
- Copy `frontend/src/pages/Login.css` → `frontend/src/pages/Login/Login.css`
- Create `frontend/src/pages/Login/index.js` with: `export { default } from './Login';`
- Update import in Login.js: `import './Login.css'` (path is now correct)

**About Page:**
- Copy `frontend/src/pages/About.js` → `frontend/src/pages/About/About.js`
- Copy `frontend/src/pages/about.css` → `frontend/src/pages/About/About.css`
- Create `frontend/src/pages/About/index.js` with: `export { default } from './About';`

**Pricing Page:**
- Copy `frontend/src/pages/Pricing.js` → `frontend/src/pages/Pricing/Pricing.js`
- Copy `frontend/src/pages/pricing.css` → `frontend/src/pages/Pricing/Pricing.css`
- Create `frontend/src/pages/Pricing/index.js` with: `export { default } from './Pricing';`

**Transcribe Page:**
- Copy `frontend/src/pages/Transcribe.js` → `frontend/src/pages/Transcribe/Transcribe.js`
- Copy `frontend/src/pages/Transcribe.css` → `frontend/src/pages/Transcribe/Transcribe.css`
- Create `frontend/src/pages/Transcribe/index.js` with: `export { default } from './Transcribe';`

**Files Page:**
- Copy `frontend/src/pages/Files.js` → `frontend/src/pages/Files/Files.js`
- Copy `frontend/src/pages/Files.css` → `frontend/src/pages/Files/Files.css`
- Create `frontend/src/pages/Files/index.js` with: `export { default } from './Files';`

**Settings, Help Pages:**
- Apply the same pattern to Settings.js and Help.js

#### 2. Move Service Files

- Move `frontend/src/pages/supabaseClient.js` → `frontend/src/services/supabaseClient.js`
- Move `frontend/src/pages/speech-to-text.js` → `frontend/src/services/speechToText.js` (rename to camelCase)
- Move `frontend/src/pages/text-to-speech.js` → `frontend/src/services/textToSpeech.js` (rename to camelCase)

#### 3. Move Utility Files

- Move `frontend/src/pages/backgroundEffect.js` → `frontend/src/utils/backgroundEffect.js`

#### 4. Update All Import Statements

In `frontend/src/App.js`, update imports:
```javascript
// OLD
import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Transcribe from './pages/Transcribe';
import Files from './pages/Files';
import Help from './pages/Help';
import Settings from './pages/Settings';

// NEW
import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Transcribe from './pages/Transcribe';
import Files from './pages/Files';
import Help from './pages/Help';
import Settings from './pages/Settings';
```

In `frontend/src/pages/Login/Login.js`, update imports:
```javascript
// OLD
import { supabase } from './supabaseClient';

// NEW
import { supabase } from '../../services/supabaseClient';
```

In any file using services:
```javascript
// OLD
import speechToText from './speech-to-text';
import textToSpeech from './text-to-speech';

// NEW
import speechToText from '../../services/speechToText';
import textToSpeech from '../../services/textToSpeech';
```

### Backend File Organization (Optional)

If you want to organize the backend similarly:

```
backend/
├── config/
│   └── database.js (database connection setup)
├── middleware/
│   ├── auth.js (authentication middleware)
│   └── errorHandler.js
├── routes/
│   ├── auth.js (register, login endpoints)
│   ├── stripe.js (existing)
│   └── users.js (user-related endpoints)
├── utils/
│   └── constants.js
├── app.js (main application file)
├── package.json
└── .env
```

## Final Directory Structure

```
SonoCanto/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   │   ├── Home.js
│   │   │   │   ├── Home.css
│   │   │   │   └── index.js
│   │   │   ├── Login/
│   │   │   │   ├── Login.js
│   │   │   │   ├── Login.css
│   │   │   │   └── index.js
│   │   │   ├── About/
│   │   │   ├── Pricing/
│   │   │   ├── Transcribe/
│   │   │   ├── Files/
│   │   │   ├── Settings/
│   │   │   └── Help/
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── services/
│   │   │   ├── supabaseClient.js
│   │   │   ├── speechToText.js
│   │   │   └── textToSpeech.js
│   │   ├── utils/
│   │   │   └── backgroundEffect.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend/
│   ├── routes/
│   │   └── stripe.js
│   ├── app.js
│   ├── package.json
│   └── .env
└── sql/
```

## Benefits of This Structure

1. **Scalability**: Easy to add new pages without cluttering the pages directory
2. **Maintainability**: Page-specific styles stay with the page component
3. **Reusability**: Services and utils are clearly separated for reuse
4. **Clarity**: Easy to understand the purpose of each folder at a glance
5. **Team Collaboration**: Clear conventions for where files should go

## Notes

- Delete old files after confirming they've been moved
- Test the app after each major import change
- Consider using a linter to catch import errors automatically
