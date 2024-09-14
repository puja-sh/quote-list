import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "../../context/AuthContext";
import './home.css'
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);  // Track the current page
    const [hasMore, setHasMore] = useState(true);  // Determine if more quotes are available
    const { token } = useAuth();
    const navigate =  useNavigate()

    const fetchQuotes = useCallback(async () => {
        if (!hasMore || !token) return;

        setLoading(true);
        try {
            const response = await fetch(`https://assignment.stage.crafto.app/getQuotes?limit=5&offset=${ page * 5 }`, {
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
            const finalData = data.data

            if (finalData.length > 0) {
                setQuotes(prevQuotes => [...prevQuotes, ...finalData]);
                setPage(prevPage => prevPage + 1);  // Move to the next page
            } else {
                setHasMore(false);  // No more quotes available
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [page, hasMore, token]);

    useEffect(() => {
        fetchQuotes();
    }, [fetchQuotes]);

    // useEffect(() => {
    //     fetchQuotes();
    // }, [])

    // useEffect(() => {
    //     const handleScroll = () => {
    //         if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
    //             fetchQuotes();
    //         }
    //     };
    //
    //     window.addEventListener('scroll', handleScroll);
    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //     };
    // }, [fetchQuotes]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Adjust format as needed
    };

    const handleCreateQuote = () => {
        navigate('/create')
    };

    if (loading && quotes.length === 0) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: { error }</div>;
    }


    return (
        <div className="feed-container">
            Welcome!
            <button className="create-new-btn" onClick={handleCreateQuote}>
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
                    )
                }) }
            </ul>
            { loading && <div>Loading more...</div> }
            { !hasMore && <div>No more quotes available</div> }


        </div>
    );
};

export default Home;