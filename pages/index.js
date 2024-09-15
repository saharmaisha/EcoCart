import { useAuth, SignInButton, SignOutButton } from '@clerk/nextjs';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { isSignedIn } = useAuth();
  const [scrapingStatus, setScrapingStatus] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ amazonEmail: '', amazonPassword: '' });
  const router = useRouter();

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setScrapingStatus('Scraping completed successfully');
            router.push({
              pathname: '/results',
              query: { data: JSON.stringify(data.data) }, // Pass the results as a query parameter
            });
          } else {
            setScrapingStatus('Scraping failed');
            setError(data.message || 'An unknown error occurred');
          }
        })
        .catch((error) => {
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
            <SignOutButton><button className={styles.button}>Sign Out</button></SignOutButton>
          </>
        ) : (
          <>
            <p className={styles.message}>Please sign in to continue.</p>
            <SignInButton mode="modal"><button className={styles.button}>Sign In</button></SignInButton>
          </>
        )}
      </center>
    </div>
  );
}
