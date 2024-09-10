'use client';

import { useState, useEffect } from 'react';
import ContinentResults from '../components/ContinentResults';
import CityResults from '../components/CityResults';
import CountryResults from '../components/CountryResults';
import PackageResults from '../components/PackageResults';
import ActivityResults from '../components/ActivityResults';
import BlogResults from '../components/BlogResults';
import Layout from '@/app/_common/layout/layout';
import camerabg from '../../assets/home_images/camera-bg.png';
import Link from 'next/link';
import LoadingBar from '@/app/_common/innerLoader/innerLoader';

const SearchPage = () => {
    const [searchResults, setSearchResults] = useState({
        continents: [],
        cities: [],
        countries: [],
        packages: [],
        activities: [],
        blogs: []
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const query = new URLSearchParams(window.location.search).get('query') || '';
            setSearchQuery(query);

            if (query) {
                fetchSearchResults(query);
            } else {
                setLoading(false); // Stop loading if there is no query
            }
        }
    }, []); // Empty dependency array so it runs only once after component mounts

    const fetchSearchResults = async (query) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/v1/search?query=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data.success) {
                setSearchResults(data.results || {});
            } else {
                console.error('Search API response error:', data.message);
                setSearchResults({}); // Set empty results if there's an error
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            setSearchResults({}); // Set empty results if there's an error
        } finally {
            setLoading(false);
        }
    };

    const hasResults = (category) => searchResults[category] && searchResults[category].length > 0;

    return (
        <Layout>
            <div className="search-page">
                <div className="search_page_inner" style={{ backgroundImage: `url(${camerabg.src})` }}>
                    <div className="search-results">
                        {loading && searchQuery ? (
                            <LoadingBar/>
                        ) : (
                            <>
                                {searchQuery === '' && !loading && (
                                    <div className="no-query-message">
                                        <h2>Welcome to the Search Page!</h2>
                                        <p>Enter a keyword to start searching for continents, countries, cities, packages, activities, and blogs.</p>
                                        <p>Try searching for something like {"New Zealand"} or {"Adventure packages"}.</p>
                                    </div>
                                )}

                                {searchQuery && !Object.keys(searchResults).some(hasResults) && !loading && (
                                    <div className="no-results">
                                        <h2>No Results Found</h2>
                                        <p>We could not find anything matching your search. Please try different keywords or check your spelling.</p>
                                        <p>Need help? <Link href="/contact-us">Contact us</Link> for assistance.</p>
                                    </div>
                                )}
                                <div className='outer_section'>
                                    {hasResults('continents') && <ContinentResults results={searchResults.continents} />}
                                    {hasResults('countries') && <CountryResults results={searchResults.countries} />}
                                    {hasResults('cities') && <CityResults results={searchResults.cities} />}
                                    {hasResults('packages') && <PackageResults results={searchResults.packages} />}
                                    {hasResults('activities') && <ActivityResults results={searchResults.activities} />}
                                    {hasResults('blogs') && <BlogResults results={searchResults.blogs} />}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SearchPage;
