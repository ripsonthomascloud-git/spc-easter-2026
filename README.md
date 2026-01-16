# The Ultimate Sacrifice in Golgotha - Easter 2026 Registration Website

A responsive, one-page React website for church event registration with Firebase integration.

## Features

- **React + Vite**: Modern React development with fast HMR (Hot Module Replacement)
- **Fully Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, minimal design with smooth animations and transitions
- **Firebase Integration**: Real-time data storage for registrations
- **Form Validation**: Client-side validation with React hooks
- **CSS Modules**: Scoped styling per component
- **Accessibility**: Semantic HTML and proper form labels

## Project Structure

```
spc-easter-2026/
├── src/
│   ├── components/          # React components
│   │   ├── HeroSection.jsx
│   │   ├── AboutSection.jsx
│   │   ├── ProgramSection.jsx
│   │   ├── RegistrationSection.jsx
│   │   ├── Footer.jsx
│   │   ├── EventDetail.jsx
│   │   └── TimelineItem.jsx
│   ├── styles/             # CSS Modules
│   │   ├── App.module.css
│   │   ├── HeroSection.module.css
│   │   ├── AboutSection.module.css
│   │   ├── ProgramSection.module.css
│   │   ├── RegistrationSection.module.css
│   │   └── Footer.module.css
│   ├── firebase/           # Firebase configuration
│   │   └── config.js
│   ├── hooks/              # Custom React hooks
│   │   ├── useFirebase.js
│   │   └── useFormValidation.js
│   ├── App.jsx             # Main App component
│   └── main.jsx            # React entry point
├── index.html              # Vite HTML template
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── firebase.json           # Firebase hosting config
├── firestore.rules         # Firestore security rules
└── README.md               # This file
```

## Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure Firebase (see Firebase Setup section below)

3. Start development server:

```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Firebase Setup Instructions

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name (e.g., "Easter 2026 Registration")
4. Follow the setup wizard (Google Analytics is optional)
5. Click "Create project"

### Step 2: Register Your Web App

1. In your Firebase project dashboard, click the web icon (`</>`) to add a web app
2. Enter an app nickname (e.g., "Easter Registration Website")
3. Check "Also set up Firebase Hosting" if you want to host on Firebase (optional)
4. Click "Register app"
5. Copy the `firebaseConfig` object that appears

### Step 3: Configure Firebase in Your Project

1. Open `src/firebase/config.js` in your project
2. Replace the placeholder configuration with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### Step 4: Enable Firestore Database

1. In Firebase Console, go to "Build" > "Firestore Database"
2. Click "Create database"
3. Select "Start in production mode" or "Start in test mode"
   - **Production mode**: More secure, requires security rules setup
   - **Test mode**: Allows all reads/writes for 30 days (good for development)
4. Choose your Firestore location (select closest to your users)
5. Click "Enable"

### Step 5: Set Up Security Rules

For production, update your Firestore security rules:

1. Go to "Firestore Database" > "Rules"
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to write to registrations
    match /registrations/{document} {
      allow create: if request.auth == null || request.auth != null;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

This allows:
- Anyone to create a registration (for public registration)
- Only authenticated users to read/update/delete registrations

For more restrictive rules (recommended for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /registrations/{document} {
      // Allow anyone to create registrations
      allow create: if true;

      // Only allow authenticated admin users to read
      allow read: if request.auth != null &&
                     request.auth.token.admin == true;

      // Prevent updates and deletes
      allow update, delete: if false;
    }
  }
}
```

3. Click "Publish"

### Step 6: Test Your Setup

1. Run the development server: `npm run dev`
2. Open your browser to `http://localhost:5173`
3. Fill out the registration form
4. Submit the form
5. Check Firebase Console > Firestore Database to see the new registration

## Viewing Registrations

### Option 1: Firebase Console

1. Go to Firebase Console
2. Navigate to "Firestore Database"
3. Click on "registrations" collection
4. View all registration documents

### Option 2: Export Data

You can export data using Firebase CLI or create an admin panel.

## Data Structure

Each registration in the `registrations` collection contains:

```javascript
{
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "(555) 123-4567",
  adults: 2,
  children: 1,
  specialNeeds: "Wheelchair access needed",
  newsletter: true,
  registeredAt: Timestamp,
  status: "confirmed"
}
```

## Local Development

### Development Server

```bash
npm run dev
```

The development server will start at `http://localhost:5173` with:
- Hot Module Replacement (HMR) for instant updates
- Fast refresh for React components
- Automatic browser opening

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Deployment Options

### Option 1: Firebase Hosting

```bash
# Build the project
npm run build

# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init hosting

# Deploy
firebase deploy
```

### Option 2: Netlify

1. Build the project: `npm run build`
2. Create account at [Netlify](https://www.netlify.com/)
3. Connect your GitHub repository OR drag and drop the `dist` folder
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Site will be live instantly

### Option 3: Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts
4. Your site will be deployed

### Option 4: GitHub Pages

1. Build the project: `npm run build`
2. Push code to GitHub repository
3. Go to repository Settings > Pages
4. Select branch and set folder to `/dist`
5. Save and your site will be live

## Customization

### Update Event Details

Edit the respective React components in `src/components/`:

- **Event date, time, location**: Edit `src/components/AboutSection.jsx` (eventDetails array)
- **Program schedule**: Edit `src/components/ProgramSection.jsx` (programItems array)
- **Contact information**: Edit `src/components/Footer.jsx`
- **Hero section text**: Edit `src/components/HeroSection.jsx`

### Change Color Scheme

Edit `src/styles/App.module.css` CSS variables:

```css
:root {
    --primary-color: #8B4513;      /* Main brown color */
    --secondary-color: #D4AF37;    /* Gold accent */
    --accent-color: #654321;       /* Dark brown */
    --text-dark: #2C2C2C;
    --text-light: #666666;
    --background-light: #FFFFFF;
    --background-section: #F8F6F3;
    /* ... other colors ... */
}
```

### Modify Form Fields

1. Edit `src/components/RegistrationSection.jsx` to add/remove form fields
2. Update the initial form state in the component
3. Update `src/hooks/useFormValidation.js` if adding new validation rules
4. Update `src/hooks/useFirebase.js` if changing the data structure sent to Firebase

### Component Structure

Each section is a separate React component:
- `HeroSection.jsx` - Landing section with title and CTA
- `AboutSection.jsx` - Event information
- `ProgramSection.jsx` - Event timeline
- `RegistrationSection.jsx` - Registration form
- `Footer.jsx` - Footer with contact info

Each component has its own CSS Module for isolated styling.

## Troubleshooting

### "Permission Denied" Error

- Check Firestore security rules
- Ensure rules allow public writes to `registrations` collection

### Form Not Submitting

- Open browser console (F12) to check for errors
- Verify Firebase configuration in `src/firebase/config.js`
- Ensure Firebase is properly initialized
- Check that all required dependencies are installed: `npm install`

### Data Not Appearing in Firestore

- Confirm Firestore is enabled in Firebase Console
- Check that collection name is "registrations"
- Verify browser console for error messages

### Development Server Won't Start

- Ensure Node.js version 16 or higher is installed: `node --version`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check that port 5173 is not already in use

### Build Errors

- Clear Vite cache: `rm -rf node_modules/.vite`
- Reinstall dependencies: `npm install`
- Check for TypeScript errors if using TypeScript

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Support

For issues or questions:
- Check Firebase documentation: https://firebase.google.com/docs
- Review browser console for error messages
- Verify all setup steps were completed

## License

This project is open source and available for church and non-profit use.

---

**Built with:** React 18, Vite 5, CSS Modules, Firebase v10

## Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: CSS Modules
- **Database**: Firebase Firestore
- **State Management**: React Hooks (useState, useEffect)
- **Form Handling**: Custom hooks (useFormValidation)
- **Deployment**: Firebase Hosting / Netlify / Vercel
