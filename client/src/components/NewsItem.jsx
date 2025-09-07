import React from "react";
import styled from "styled-components";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Styled Component for NewsItem with pastel theme
const NewsCard = styled.div`
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: auto;
  max-width: 400px;
  margin: 10px;
  border-radius: 10px;
  background-color: #fffde7; /* Pastel yellow */
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-bottom: 2px solid #d4f1c5; /* Soft pastel green border */
  }

  div {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-grow: 1;
  }

  h5 {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0;
    color: #a5d6a7; /* Pastel green title */
  }

  p {
    color: #666;
    font-size: 0.95rem;
    margin: 0;
    flex-grow: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    text-overflow: ellipsis;
  }

  a {
    color: #a5d6a7; /* Pastel green link */
    font-weight: bold;
    text-decoration: none;
    border: 1px solid #a5d6a7;
    border-radius: 5px;
    padding: 10px 15px;
    text-align: center;
    transition: all 0.3s ease;
    margin-top: auto;
  }

  a:hover {
    background-color: #a5d6a7;
    color: white;
  }

  button {
    background-color: #a5d6a7; /* Pastel green button */
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  button:hover {
    background-color: #81c784; /* Slightly darker pastel green */
  }

  @media (max-width: 768px) {
    max-width: 100%;
    img {
      height: 150px;
    }
    h5 {
      font-size: 1rem;
    }
    p {
      font-size: 0.85rem;
    }
  }
`;

export default function NewsItem({
  title,
  description,
  imageUrl,
  newsUrl,
  source,
  username,
  saved
}) {
  if (!title) {
    return null;
  }

  const saveNews = async () => {
    try {
      const response = await axios.post('https://new-news-augo.onrender.com/save-news', { 
        title,
        description,
        imageUrl,
        newsUrl,
        source,
        username
      });
      if (response.status === 200) {
        toast.success('News saved successfully!');
      } else {
        toast.error('Failed to save the news.');
      }
    } catch (error) {
      console.error('Error saving the news:', error);
      toast.error('An error occurred while saving the news.');
    }
  };

  return (
    <>
      <NewsCard>
        <img src={imageUrl} alt="News" />
        <div>
          <h5>{title}...</h5>
          <p>{description}</p>
          <a href={newsUrl} target="_blank" rel="noopener noreferrer">
            Read more
          </a>
          {!saved && <button onClick={saveNews}>Save News</button>}
        </div>
      </NewsCard>
      <ToastContainer />
    </>
  );
}
