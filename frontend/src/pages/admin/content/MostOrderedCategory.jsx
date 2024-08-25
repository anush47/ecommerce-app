import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseUrl = 'http://127.0.0.1:5000';

const MostOrderedCategory = () => {
  const [categoryHierarchy, setCategoryHierarchy] = useState([]);

  useEffect(() => {
    axios.get(`${baseUrl}/api/reports/most-selling-category`)
      .then(response => {
        setCategoryHierarchy(response.data);
      })
      .catch(error => {
        console.error('Error fetching the most selling category hierarchy:', error);
      });
  }, []);

  return (
    <div style={{display:'flex', flexDirection:'column', padding : '30px'}}>
      <p style={{ fontSize: "30pt", fontWeight: "600", marginBottom: "20px" }}>
        Most Selling Category
      </p>
      <ul>
        {categoryHierarchy.map(category => (
          <li key={category.category_id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default MostOrderedCategory;
