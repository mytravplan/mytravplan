// hooks/useSearch.js

import { useState, useEffect } from 'react';

/**
 * Custom hook for search and sort functionality.
 * @param {Array} data - The dataset to be filtered and sorted.
 * @param {Array} fields - The fields to search in.
 * @param {string} query - The search query.
 * @param {string} sortBy - The field to sort by.
 * @param {string} sortOrder - The order to sort (asc or desc).
 * @returns {Object} - An object containing filtered and sorted data and the search query.
 */
export const useSearchAndSort = (data, fields, query, sortBy, sortOrder) => {
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    let results = [...data];

    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      results = results.filter(item =>
        fields.some(field =>
          (item[field]?.toLowerCase() || '').includes(lowerCaseQuery)
        )
      );
    }

    if (sortBy) {
      results.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(results);
  }, [data, fields, query, sortBy, sortOrder]);

  return { filteredData };
};
