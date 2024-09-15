import { useState } from 'react';
import { useRouter } from 'next/router';
import React from 'react';
import { SignOutButton } from '@clerk/nextjs';
import styles from '../styles/Home.module.css';
import { Container, Row, Col, Button, Card } from 'react-bootstrap'; // Import Bootstrap components
import { GlobalStyle } from '../components/styles'; // Assuming GlobalStyle is correctly defined
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

export default function Results() {
  const router = useRouter();
  const { data } = router.query;

  let results = [];

  if (data) {
    results = JSON.parse(data); // Parse the results passed via the query
  }

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <Container>
      <GlobalStyle />
      <div> 
          <nav className="navbar navbar-light bg-transparent" style={{ position: 'fixed', top: 0, left: 10, backgroundColor: 'transparent', border: 'none' }}>
            <a className="navbar-brand" href="#">
              <img src="/imgs/Logo.png" width="85" height="85" alt="Logo" style={{ display: 'block' }} />
            </a>
          </nav> 
          <div style={{ position: 'fixed', top: 35, right: 40, display: 'flex', alignItems: 'center' }}>
          <button className={styles.button} onClick={handleGoBack} style={{ position: 'fixed', top: 35, right: 135}}>Back</button>
          <SignOutButton><button className={styles.button} style={{ position: 'fixed', top: 35, right: 20}}>Sign Out</button></SignOutButton>
          </div> 
      </div>
      <Row className="justify-content-center my-4">
        <Col md={8}>
          <h1 className="text-center" style={{ color: '#2C5F34', fontSize: '4rem' }}>Results</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        {results.length === 0 ? (
          <Col md={6}>
            <p className="text-center">No products found.</p>
          </Col>
        ) : (
          results.map((product, index) => (
            <Col key={index} md={6} lg={4} className="mb-4">
              <ProductCard product={product} />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

// ProductCard component
function ProductCard({ product }) {
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Set color based on sustainability score
  const scoreColor = product.sustainabilityScore >= 5 ? 'text-success' : 'text-danger';

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title>{product.productName}</Card.Title>
        <Card.Text><strong>Ingredients:</strong> {product.ingredients || 'No ingredients found'}</Card.Text>

        {/* Conditional styling for sustainability score */}
        <Card.Text>
          <strong>Sustainability Score: </strong>
          <span className={scoreColor}>{product.sustainabilityScore || 'Coming soon...'}</span>
        </Card.Text>

        <Card.Text><strong>Good Ingredients:</strong> {product.goodIngredients || 'No data available'}</Card.Text>
        <Card.Text><strong>Bad Ingredients:</strong> {product.badIngredients || 'No data available'}</Card.Text>

        {/* If sustainability score is less than 5, show recommendations */}
        {product.sustainabilityScore < 5 && product.sustainabilityScore !== 'Coming soon...' && (
          <>
            <Button variant="warning" className="mb-3" onClick={() => setShowRecommendations(!showRecommendations)}>
              Show Alternative Recommendations
            </Button>
            {showRecommendations && (
              <div className="recommendations">
                <h5>Recommended Alternatives</h5>
                {/* Check if product.recommendations exists and is an array */}
                {product.recommendations?.length ? (
                  product.recommendations.map((rec, i) => (
                    <div key={i}>
                      {rec.name || rec} {/* Display either the name or the recommendation text */}
                    </div>
                  ))
                ) : (
                  <div>No recommendations available.</div>
                )}
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
}
