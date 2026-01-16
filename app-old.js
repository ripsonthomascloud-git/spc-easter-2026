// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase configuration
// IMPORTANT: Replace these values with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app;
let db;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
}

// Form handling
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const submitButton = form.querySelector('.submit-button');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoader = submitButton.querySelector('.button-loader');
    const formMessage = document.getElementById('formMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate form
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Disable submit button and show loader
        submitButton.disabled = true;
        buttonText.textContent = 'Submitting...';
        buttonLoader.style.display = 'inline-block';
        formMessage.style.display = 'none';
        formMessage.className = 'form-message';

        // Collect form data
        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            adults: parseInt(document.getElementById('adults').value) || 1,
            children: parseInt(document.getElementById('children').value) || 0,
            specialNeeds: document.getElementById('specialNeeds').value.trim(),
            newsletter: document.getElementById('newsletter').checked,
            registeredAt: serverTimestamp(),
            status: 'confirmed'
        };

        try {
            // Add document to Firestore
            const docRef = await addDoc(collection(db, 'registrations'), formData);

            console.log('Registration submitted successfully with ID:', docRef.id);

            // Show success message
            formMessage.textContent = 'Registration completed successfully! We look forward to seeing you at the event.';
            formMessage.className = 'form-message success';

            // Reset form
            form.reset();

            // Scroll to success message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        } catch (error) {
            console.error('Error submitting registration:', error);

            // Show error message
            let errorMessage = 'An error occurred while submitting your registration. Please try again.';

            if (error.code === 'permission-denied') {
                errorMessage = 'Firebase permission error. Please check your Firebase security rules.';
            } else if (error.code === 'unavailable') {
                errorMessage = 'Unable to connect to the database. Please check your internet connection.';
            }

            formMessage.textContent = errorMessage;
            formMessage.className = 'form-message error';
        } finally {
            // Re-enable submit button and hide loader
            submitButton.disabled = false;
            buttonText.textContent = 'Complete Registration';
            buttonLoader.style.display = 'none';
        }
    });

    // Email validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email && !emailRegex.test(email)) {
            emailInput.setCustomValidity('Please enter a valid email address');
        } else {
            emailInput.setCustomValidity('');
        }
    });

    // Phone number formatting (optional)
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 0) {
            if (value.length <= 3) {
                value = value;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else if (value.length <= 10) {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
            } else {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }

        e.target.value = value;
    });

    // Number input validation
    const adultsInput = document.getElementById('adults');
    const childrenInput = document.getElementById('children');

    [adultsInput, childrenInput].forEach(input => {
        input.addEventListener('input', (e) => {
            if (e.target.value < 0) {
                e.target.value = 0;
            }
        });
    });
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
