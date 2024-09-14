import { useAuth, SignInButton, SignOutButton } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { isSignedIn } = useAuth();
  const [scrapingStatus, setScrapingStatus] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    amazonEmail: '',
    amazonPassword: '',
  });

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSignedIn) {
      setScrapingStatus('Starting scraping process...');
      setError('');
      fetch('/api/scrape-amazon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),  // Pass the form data (email and password)
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setScrapingStatus('Scraping completed successfully');
            console.log('Scraping results:', data.data);
          } else {
            setScrapingStatus('Scraping failed');
            setError(data.message || 'An unknown error occurred');
          }
        })
        .catch((error) => {
          console.error('Error during scraping:', error);
          setScrapingStatus('Error occurred during scraping');
          setError(error.toString());
        });
    }
  };

  return (
    <div className={styles.container}>
      <center>
        {isSignedIn ? (
          <>
            <p className={styles.message}>Welcome! You are signed in.</p>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="amazonEmail">Amazon Email:</label>
                <input
                  id="amazonEmail"
                  type="email"
                  name="amazonEmail"
                  value={formData.amazonEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="amazonPassword">Amazon Password:</label>
                <input
                  id="amazonPassword"
                  type="password"
                  name="amazonPassword"
                  value={formData.amazonPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit">Start Scraping</button>
            </form>
            <p className={styles.message}>{scrapingStatus}</p>
            {error && <p className={styles.error}>{error}</p>}
            <SignOutButton>
              <button className={styles.button}>Sign Out</button>
            </SignOutButton>
          </>
        ) : (
          <>
            <p className={styles.message}>Please sign in to continue.</p>
            <SignInButton mode="modal">
              <button className={styles.button}>Sign In</button>
            </SignInButton>
          </>
        )}
      </center>
    </div>
  );
}
