import { useAuth, SignInButton, SignOutButton } from '@clerk/nextjs';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';

import {
  GlobalStyle,
} from '../components/styles';  

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
      <GlobalStyle />
      {isSignedIn && (
        <div> 
          <nav className="navbar navbar-light bg-transparent" style={{ position: 'fixed', top: 0, left: 10, backgroundColor: 'transparent', border: 'none' }}>
            <a className="navbar-brand" href="#">
              <img src="/imgs/Logo.png" width="85" height="85" alt="Logo" style={{ display: 'block' }} />
            </a>
          </nav>
              <SignOutButton><button className={styles.button} style={{ position: 'fixed', top: 35, right: 20}}>Sign Out</button></SignOutButton>
        </div>
      )}
      <center>
        {isSignedIn ? ( 
            <> 
            <p class="mb-3" style={{color: '#2C5F34', fontSize: '5rem', textAlign: 'center', fontFamily: 'sans-serif', marginBottom: 0, fontWeight: 'bold', marginTop: 20}}>Amazon Login</p>
            <form onSubmit={handleSubmit}>
              <div class="form-group mb-3"> 
                <input 
                  type="email" 
                  class="form-control" 
                  id="amazonEmail" 
                  name="amazonEmail" 
                  value={formData.amazonEmail}
                  onChange={handleInputChange}
                  required
                  placeholder="Email" 
                  onClick={(e) => {   
                    e.target.style.borderColor = '#3D8C40';
                    e.target.style.boxShadow = '0 0 8px rgba(61, 140, 64, 1)';
                  }}
                  onBlur={(e) => { 
                    e.target.style.borderColor = '';   
                    e.target.style.boxShadow = 'none';     
                  }}
                /> 
              </div> 
              <div class="form-group mb-3"> 
                <input 
                  type="password" 
                  class="form-control" 
                  id="amazonPassword" 
                  name="amazonPassword"
                  value={formData.amazonPassword}
                  onChange={handleInputChange}
                  required
                  placeholder='Password' 
                  onClick={(e) => { 
                    e.target.style.borderColor = '#3D8C40';
                    e.target.style.boxShadow = '0 0 8px rgba(61, 140, 64, 1)';
                  }}
                  onBlur={(e) => { 
                    e.target.style.borderColor = '';   
                    e.target.style.boxShadow = 'none';     
                  }}
                />
              </div> 
              <button
                className="btn btn-primary"
                id="login"
                type="submit"
                style={{
                  backgroundColor: '#2C5F34',  
                  borderColor: '#2C5F34',     
                  color: 'white',              
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#3D8C40';  
                  e.target.style.borderColor = '#3D8C40';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#2C5F34';  
                  e.target.style.borderColor = '#2C5F34';
                }}
              >
                Start Scraping
              </button> 
              <p className={styles.message} style={{ textAlign: 'center', color: '#3D8C40', marginTop: '20px' }}>{scrapingStatus}</p>
             {error && <p className={styles.error} style={{ textAlign: 'center', color: 'red', marginTop: '10px' }}>{error}</p>}
            </form> 
            </> 
        ) : (
          <>
          <Container> 
            <p style={{color: '#2C5F34', fontSize: '5rem', textAlign: 'center', fontFamily: 'sans-serif', marginBottom: 0, fontWeight: 'bold', marginTop: 2}}>EcoCart</p>
            <img style={{marginTop: 0, padding: 0}} src="/imgs/Logo.png" alt="Logo" /> 
            <div class="d-grid gap-2 col-6 mx-auto">
              <SignInButton mode="modal"> 
              <button
                className="btn"
                id="login"
                type="button"
                style={{
                  backgroundColor: '#2C5F34',  
                  borderColor: '#2C5F34',     
                  color: 'white',              
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#3D8C40';  
                  e.target.style.borderColor = '#3D8C40';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#2C5F34';  
                  e.target.style.borderColor = '#2C5F34';
                }}
              >
                Login
              </button>
              </SignInButton>
            </div>
          </Container>
          </>
        )}
      </center>
    </div>
  );
}
