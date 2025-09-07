import React, { useState, useEffect } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import styled from 'styled-components';
import axios from 'axios';

// Styled component for NewsBlockContainer with pastel theme
const NewsBlockContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 20px;
  flex-wrap: wrap;
  gap: 10px;
  background-color: #fffde7; /* Pastel yellow background */

  @media (max-width: 768px) {
    padding: 10px;
    flex-direction: column;
  }
`;

export default function NewsFromDB() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem('loggedInUser');

  useEffect(() => {
    const fetchNewsFromDB = async () => {
      try {
        const response = await axios.get('https://new-news-augo.onrender.com/get-news');
        setNewsData(response.data); // Assuming the data is an array of news articles
      } catch (error) {
        console.error('Error fetching news from the backend', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsFromDB();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <NewsBlockContainer>
      {newsData.map((newsItem) =>
        newsItem.username === username ? (
          <NewsItem
            key={newsItem._id}
            title={newsItem.title}
            description={newsItem.description}
            imageUrl={newsItem.imageUrl}
            newsUrl={newsItem.newsUrl}
            source={newsItem.source}
            username={newsItem.username}
            saved={1} // Mark as saved
          />
        ) : null
      )}
    </NewsBlockContainer>
  );
}
