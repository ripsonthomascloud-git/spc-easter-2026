import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useFirebase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitRegistration = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const registrationData = {
        ...formData,
        registeredAt: serverTimestamp(),
        status: 'confirmed'
      };

      const docRef = await addDoc(collection(db, 'registrations'), registrationData);
      console.log('Registration submitted successfully with ID:', docRef.id);

      setSuccess(true);
      setLoading(false);
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error('Error submitting registration:', err);

      let errorMessage = 'An error occurred while submitting your registration. Please try again.';

      if (err.code === 'permission-denied') {
        errorMessage = 'Firebase permission error. Please check your Firebase security rules.';
      } else if (err.code === 'unavailable') {
        errorMessage = 'Unable to connect to the database. Please check your internet connection.';
      }

      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const resetState = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return {
    loading,
    error,
    success,
    submitRegistration,
    resetState
  };
};
