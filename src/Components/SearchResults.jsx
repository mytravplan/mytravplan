
// // // /app/components/SearchResults.jsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const formatQuery = (query) => query.trim().toLowerCase().replace(/\s+/g, '-');

const rotatingWords = ['continents', 'countries', 'cities', 'packages', 'activities', 'blogs'];

const SearchResults = ({ query, closePopup }) => {
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState(''); // To store the no data message
  const [currentWord, setCurrentWord] = useState(rotatingWords[0]);
  
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord(prevWord => {
        const currentIndex = rotatingWords.indexOf(prevWord);
        const nextIndex = (currentIndex + 1) % rotatingWords.length;
        return rotatingWords[nextIndex];
      });
    }, 2000); // Changed interval to 2 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!query) {
      setResults(null);
      setMessage(''); // Clear any message when input is empty
      return;
    }

    const fetchSearchResults = async () => {
      setSearching(true);
      try {
        const response = await fetch(`/api/v1/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.success && data.results && (
            data.results.continents.length > 0 ||
            data.results.cities.length > 0 ||
            data.results.countries.length > 0 ||
            data.results.packages.length > 0 ||
            data.results.activities.length > 0 ||
            data.results.blogs.length > 0
          )) {
          setResults(data.results);
          setMessage(''); // Clear any previous no data message
        } else {
          setResults({});
          setMessage('No data found for the given search.'); // Show message if no results found
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults({});
        setMessage('Error fetching search results.'); // Show error message
      } finally {
        setSearching(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleResultClick = (title, type) => {
    const formattedQuery = formatQuery(title);
    router.push(`/search?query=${encodeURIComponent(formattedQuery)}`);
    closePopup();
  };

  return (
    <div className="searchResults">
      {searching && <div>Searching...</div>}

      {!searching && results === null && (
        <div className="search-placeholder">Start typing to search {currentWord}...</div>
      )}

      {!searching && results && Object.keys(results).length === 0 && message && (
        <div>{message}</div>
      )}

      {!searching && results && Object.keys(results).length > 0 && (
        <>
          {results.continents?.length > 0 && (
            <div>
              <h4>Continents</h4>
              {results.continents.map(item => (
                <div className='resp_url' key={item._id} onClick={() => handleResultClick(item.title, 'continents')}>
                  {item.title}
                </div>
              ))}
            </div>
          )}
          {results.countries?.length > 0 && (
            <div>
              <h4>Countries</h4>
              {results.countries.map(item => (
                <div className='resp_url' key={item._id} onClick={() => handleResultClick(item.title, 'countries')}>
                  {item.title}
                </div>
              ))}
            </div>
          )}
          {results.cities?.length > 0 && (
            <div>
              <h4>Cities</h4>
              {results.cities.map(item => (
                <div className='resp_url' key={item._id} onClick={() => handleResultClick(item.title, 'cities')}>
                  {item.title}
                </div>
              ))}
            </div>
          )}
          {results.packages?.length > 0 && (
            <div>
              <h4>Packages</h4>
              {results.packages.map(item => (
                <div className='resp_url' key={item._id} onClick={() => handleResultClick(item.title, 'packages')}>
                  {item.title}
                </div>
              ))}
            </div>
          )}
          {results.activities?.length > 0 && (
            <div>
              <h4>Activities</h4>
              {results.activities.map(item => (
                <div className='resp_url' key={item._id} onClick={() => handleResultClick(item.title, 'activity')}>
                  {item.title}
                </div>
              ))}
            </div>
          )}
          {results.blogs?.length > 0 && (
            <div>
              <h4>Blogs</h4>
              {results.blogs.map(item => (
                <div className='resp_url' key={item._id} onClick={() => handleResultClick(item.title, 'blog')}>
                  {item.title}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
