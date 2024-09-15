import { useRouter } from 'next/router';
import React from 'react';
import styles from '../styles/Results.module.css';

export default function Results() {
    const router = useRouter();
    const { data } = router.query;
  
    let results = [];
  
    if (data) {
      results = JSON.parse(data); // Parse the results passed via the query
    }
  
    return (
      <div className={styles.container}>
        <h1>Scraping Results</h1>
        <div className={styles.resultsGrid}>
          {results.length === 0 ? (
            <p>No products found.</p>
          ) : (
            results.map((product, index) => (
              <div key={index} className={styles.productCard}>
                <h2>{product.productName}</h2>
                <p><strong>Ingredients:</strong> {product.ingredients || 'No ingredients found'}</p>
                <p><strong>Sustainability Score:</strong> {product.sustainabilityScore || 'Coming soon...'}</p>
                <p><strong>Good Ingredients:</strong> {product.goodIngredients || 'No data available'}</p>
                <p><strong>Bad Ingredients:</strong> {product.badIngredients || 'No data available'}</p>
                <a href={product.url} target="_blank" rel="noopener noreferrer">
                  View Product
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
  