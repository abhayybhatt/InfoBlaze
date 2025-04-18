import React, { useEffect, useState, useRef } from 'react'
import Card from './Card'

const Newsapp = () => {
    const [search, setSearch] = useState("");
    const [newsData, setNewsData] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState("us");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        // Check if theme preference exists in localStorage
        const savedTheme = localStorage.getItem('theme');
        // Return true if saved theme is 'dark', false otherwise
        return savedTheme === 'dark';
    });
    const dropdownRef = useRef(null);
    // Using API key from environment variables
    const API_KEY = import.meta.env.VITE_API_KEY;

    const countries = [
        { code: "us", name: "USA" },
        { code: "gb", name: "UK" },
        { code: "in", name: "India" },
        { code: "ca", name: "Canada" },
        { code: "au", name: "Australia" },
        { code: "fr", name: "France" },
        { code: "de", name: "Germany" },
        { code: "jp", name: "Japan" }
    ];

    // Apply theme class to document body
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    // Toggle dark mode
    const toggleTheme = () => {
        setDarkMode(prevMode => !prevMode);
    };

    const getData = async() => {
        try {
            // Check if API key is available
            if (!API_KEY) {
                console.error("API Key is missing from environment variables");
                setNewsData([]);
                return;
            }
            
            let url;
            console.log("Fetching technology news with params:", { country: selectedCountry, search });

            // If there's a search query, use the 'everything' endpoint with technology focus
            if (search && search.trim() !== "" && search !== "trending") {
                url = `https://newsapi.org/v2/everything?q=${search}+AND+technology&sortBy=publishedAt&apiKey=${API_KEY}`;
                console.log("Using 'everything' endpoint with technology search:", search);
            } 
            // For trending technology news
            else if (search === "trending") {
                url = `https://newsapi.org/v2/everything?q=trending+AND+technology&sortBy=popularity&apiKey=${API_KEY}`;
                console.log("Using 'everything' endpoint for trending technology news");
            }
            // For country-specific technology news
            else {
                // Always use technology category
                url = `https://newsapi.org/v2/top-headlines?country=${selectedCountry}&category=technology&apiKey=${API_KEY}`;
                console.log("Using 'top-headlines' endpoint with country and technology category:", selectedCountry);
            }
            
            console.log("Fetching URL:", url);
            const response = await fetch(url);
            const jsonData = await response.json();
            console.log("API response:", jsonData);
            
            if (jsonData.status === "error") {
                console.error("API Error:", jsonData.message);
                setNewsData([]);
                return;
            }
            
            if (!jsonData.articles || jsonData.articles.length === 0) {
                console.log("No technology articles found, trying with broader search");
                
                // If no articles found with country code, try with broader technology search
                if (selectedCountry) {
                    const countryName = countries.find(c => c.code === selectedCountry)?.name || "";
                    if (countryName) {
                        const fallbackUrl = `https://newsapi.org/v2/everything?q=${countryName}+AND+technology&sortBy=publishedAt&apiKey=${API_KEY}`;
                        console.log("Fallback URL:", fallbackUrl);
                        
                        const fallbackResponse = await fetch(fallbackUrl);
                        const fallbackData = await fallbackResponse.json();
                        
                        if (fallbackData.status === "ok" && fallbackData.articles && fallbackData.articles.length > 0) {
                            console.log("Found technology articles with country name search");
                            let dt = fallbackData.articles.slice(0, 12);
                            setNewsData(dt);
                            return;
                        }
                    }
                }
                
                // Final fallback - just get general technology news
                const globalTechUrl = `https://newsapi.org/v2/everything?q=technology&sortBy=publishedAt&apiKey=${API_KEY}`;
                const globalTechResponse = await fetch(globalTechUrl);
                const globalTechData = await globalTechResponse.json();
                
                if (globalTechData.status === "ok" && globalTechData.articles && globalTechData.articles.length > 0) {
                    console.log("Found global technology articles");
                    let dt = globalTechData.articles.slice(0, 12);
                    setNewsData(dt);
                    return;
                }
                
                setNewsData([]);
                return;
            }
            
            let dt = jsonData.articles.slice(0, 12);
            setNewsData(dt);
        } catch (error) {
            console.error("Error fetching news:", error);
            setNewsData([]);
        }
    }

    useEffect(() => {
        getData();
    }, [selectedCountry]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleInput = (e) => {
        setSearch(e.target.value);
    }

    const handleSearch = () => {
        getData();
    }

    const handleCountryChange = (countryCode) => {
        setSelectedCountry(countryCode);
        setSearch("");
    }

    const handleAllTechNews = () => {
        setSearch("");
        getData();
    }

    const handleTrendingTech = () => {
        setSearch("trending");
        getData();
    }

    return (
        <div className="app-container">
            <nav className="tech-navbar">
                <div className="logo-section">
                    <div className="logo-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/>
                        </svg>
                    </div>
                    <h1>InfoBlaze</h1>
                </div>
                <ul className="nav-links">
                    <button 
                        className={`nav-btn ${!search ? "active" : ""}`} 
                        onClick={handleAllTechNews}
                    >
                        Latest Tech
                    </button>
                    <button 
                        className={`nav-btn ${search === "trending" ? "active" : ""}`}
                        onClick={handleTrendingTech}
                    >
                        Trending Tech
                    </button>
                </ul>
                <div className='searchBar'>
                    <input type='text' placeholder='Search Tech News' value={search} onChange={handleInput} />
                    <button onClick={handleSearch} className="search-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                    <button 
                        className="theme-toggle" 
                        onClick={toggleTheme}
                        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {darkMode ? (
                            <span className="mode-icon">☀️</span>
                        ) : (
                            <span className="mode-icon">🌙</span>
                        )}
                    </button>
                </div>
            </nav>
            <div className="page-header">
                <p className='head'>Stay Updated with the Latest in Technology</p>
                <p className="subhead">Discover breaking news, innovations, and trends in the tech world</p>
            </div>
            
            <div className="country-dropdown-container">
                <div className="country-dropdown" ref={dropdownRef}>
                    <div className="selected-country" onClick={toggleDropdown}>
                        <img 
                            src={`https://flagcdn.com/48x36/${selectedCountry}.png`}
                            alt={countries.find(c => c.code === selectedCountry)?.name || "Country flag"}
                        />
                        <span>{countries.find(c => c.code === selectedCountry)?.name || "Select Country"}</span>
                        <i className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}>▼</i>
                    </div>
                    <div className={`country-options ${dropdownOpen ? 'show' : ''}`}>
                        {countries.map((country) => (
                            <div 
                                key={country.code}
                                className={`country-option ${selectedCountry === country.code ? "selected" : ""}`}
                                onClick={() => {
                                    handleCountryChange(country.code);
                                    setDropdownOpen(false);
                                }}
                            >
                                <img 
                                    src={`https://flagcdn.com/48x36/${country.code}.png`} 
                                    alt={`${country.name} flag`}
                                />
                                <span>{country.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                {newsData ? <Card data={newsData} darkMode={darkMode} /> : 
                <div className="inline-loading">
                    <div className="spinner"></div>
                    <p>Loading technology news...</p>
                </div>}
            </div>
        </div>
    )
}

export default Newsapp