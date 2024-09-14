import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "../../context/AuthContext";
import './home.css';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            setQuotes([]);
            setPage(0);
            setHasMore(true);
            setError(null);
            fetchQuotes(true);
        }
    }, [token, navigate]);

    const fetchQuotes = useCallback(async (isInitial = false) => {
        if (!hasMore || (loading && !isInitial)) return;

        if (isInitial) {
            setLoading(true);
        }

        try {
            const response = await fetch(`https://assignment.stage.crafto.app/getQuotes?limit=5&offset=${ page }`, {
                method: 'GET',
                headers: {
                    'Authorization': `${ token }`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const finalData = data.data;

            if (finalData.length > 0) {
                setQuotes(prevQuotes => [...prevQuotes, ...finalData]);
                setPage(prevPage => prevPage + 1);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [page, hasMore, token, loading]);


    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
            const totalHeight = document.documentElement.offsetHeight;

            if (scrollPosition >= totalHeight - 100 && !loadingMore && hasMore) {
                setLoadingMore(true);
                setTimeout(() => {
                    fetchQuotes();
                }, 2000);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [fetchQuotes, loadingMore, hasMore]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const handleCreateQuote = () => {
        navigate('/create');
    };

    const handleLogout = () => {
        setQuotes([]);
        setPage(0);
        setHasMore(true);
        setError(null);

        logout();
        navigate('/login');
    };

    if (loading && quotes.length === 0) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: { error }</div>;
    }

    return (
        <div className="feed-container">
            <button className="logout-btn" onClick={ handleLogout }>
                Logout
            </button>
            <button className="create-new-btn" onClick={ handleCreateQuote }>
                Add quote
            </button>
            <ul>
                { quotes.map((quote, index) => {
                    const { text, mediaUrl, createdAt, username } = quote;

                    return (
                        <li key={ index } className='quote-li'>
                            <p className='quote-text'>{ text }</p>
                            <div className="quote-content">
                                <div className='user-details-container'>
                                    <img src={ mediaUrl } alt={ text } className="quote-image"/>
                                    <p className='username-text'>{ username }</p>
                                </div>
                                <div>
                                    <p className='date-text'>{ formatDate(createdAt) }</p>
                                </div>
                            </div>
                        </li>
                    );
                }) }
            </ul>
            { loadingMore && <div className='loading-more-text'>Loading more...</div> }
            { !hasMore && <div>No more quotes available</div> }
        </div>
    );
};

export default Home;
