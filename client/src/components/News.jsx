import React, { useEffect, useState, useCallback } from "react";
import Spinner from "./Spinner";
import NewsItem from "./NewsItem";
import styled from "styled-components";

// Styled component for NewsBlockContainer
const NewsBlockContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 20px;
  flex-wrap: wrap;
  gap: 10px;
  background-color: #f4f9f4; /* Very soft pastel green background */

  @media (max-width: 768px) {
    padding: 10px;
    flex-direction: column;
  }
`;

// Styled component for each news block (NewsItemWrapper)
const NewsItemWrapper = styled.div`
  flex: 1 1 32%;
  max-width: 400px;
  margin: 10px;
  overflow: hidden;
  background-color: #fffde7; /* Pastel yellow card background */
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  gap: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    flex: 1 1 100%;
  }
`;

// Styled component for NewsHeading
const NewsHeading = styled.h2`
  font-size: 32px;
  font-weight: bold;
  color: #a5d6a7; /* Pastel green */
  text-align: center;
  margin: 20px 0;
  background-color: #fff9c4; /* Pastel yellow */
  border: 2px solid #d4f1c5; /* Light pastel green border */
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.03);
  }

  @media (max-width: 768px) {
    font-size: 24px;
    padding: 10px;
  }
`;

const News = (props) => {
  const { saved, category } = props;
  const username = localStorage.getItem("loggedInUser");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const updateNews = useCallback(async () => {
    setLoading(true);
    const url = `https://saurav.tech/NewsAPI/top-headlines/category/${category}/in.json`;

    try {
      let response = await fetch(url);
      if (!response.ok) {
        console.error("HTTP error:", response.status, response.statusText);
        setLoading(false);
        return;
      }
      let parsedData = await response.json();
      if (parsedData.articles) {
        setArticles(parsedData.articles);
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    updateNews();
  }, [category, updateNews]);

  const gizmodoArticles = articles.filter((article) => article.source.name === "CNBCTV18");
  const vergeArticles = articles.filter((article) => article.source.name === "Moneycontrol");
  const BBCArticles = articles.filter((article) => article.source.name === "News18");

  return (
    <>
      {loading && <Spinner />}

      <NewsBlockContainer>
        <NewsItemWrapper>
          <NewsHeading>CNBCTV18</NewsHeading>
          {gizmodoArticles.map((element) => (
            <NewsItem
              key={element.url}
              title={element.title ? element.title.slice(0, 45) : ""}
              description={element.description}
              imageUrl={element.urlToImage}
              newsUrl={element.url}
              author={element.author}
              date={element.publishedAt}
              source={element.source.name}
              username={username}
              saved={saved}
            />
          ))}
        </NewsItemWrapper>

        <NewsItemWrapper>
          <NewsHeading>Moneycontrol</NewsHeading>
          {vergeArticles.map((element) => (
            <NewsItem
              key={element.url}
              title={element.title ? element.title.slice(0, 45) : ""}
              description={element.description}
              imageUrl={element.urlToImage}
              newsUrl={element.url}
              author={element.author}
              date={element.publishedAt}
              source={element.source.name}
              username={username}
              saved={saved}
            />
          ))}
        </NewsItemWrapper>

        <NewsItemWrapper>
          <NewsHeading>News18</NewsHeading>
          {BBCArticles.map((element) => (
            <NewsItem
              key={element.url}
              title={element.title ? element.title.slice(0, 45) : ""}
              description={element.description}
              imageUrl={element.urlToImage}
              newsUrl={element.url}
              author={element.author}
              date={element.publishedAt}
              source={element.source.name}
              username={username}
              saved={saved}
            />
          ))}
        </NewsItemWrapper>
      </NewsBlockContainer>
    </>
  );
};

export default News;
