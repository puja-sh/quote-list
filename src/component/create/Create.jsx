import React, { useState } from 'react';
import './create.css';
import { useAuth } from "../../context/AuthContext";

const Create = () => {
    const [quoteValue, setQuoteValue] = useState("");
    const [imageFile, setImageFile] = useState("");
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { token } = useAuth();

    const uploadImageHandler = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setImageFile(URL.createObjectURL(file));

        setLoading(true);
        setError("");

        try {
            const response = await fetch('https://crafto.app/crafto/v1.0/media/assignment/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Image upload failed');
            }

            const data = await response.json();
            setUploadedImageUrl(data[0].url);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    const addQuoteHandler = async () => {

        if (!quoteValue?.length || !imageFile?.name?.length) {
            setError("Please provide both a quote and an image.");
            return;
        }


        setLoading(true);
        setError("");

        try {
            debugger
            if (!uploadedImageUrl && imageFile) {
                const file = imageFile; // The file object
                await uploadImageHandler(file);
            }

            const response = await fetch('https://assignment.stage.crafto.app/postQuote', {
                method: 'POST',
                headers: {
                    'Authorization': `${ token }`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: quoteValue,
                    mediaUrl: uploadedImageUrl
                })
            });

            if (!response.ok) {
                throw new Error('Quote submission failed');
            }

            alert('Quote submitted successfully');
            setQuoteValue("");
            setUploadedImageUrl("");
            setImageFile("");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const resetHandler = () => {
        setUploadedImageUrl("");
        setImageFile("");
        setQuoteValue("");
        setError("");
    }

    return (
        <div>
            <div className="form-container">
                <textarea
                    value={ quoteValue }
                    placeholder="Enter your quote"
                    onChange={ (e) => setQuoteValue(e.target.value) }
                />

                <div className='create-button-container'>
                    { imageFile && (
                        <div className="image-preview">
                            <p>Selected Image ✅</p>
                            <img src={ imageFile } alt="Selected"/>
                        </div>
                    ) }

                    { !imageFile.length ? (
                        <label className="file-upload-label">
                            <input
                                type='file'
                                accept="image/*"
                                onChange={ (e) => {
                                    if (e.target.files[0]) {
                                        setImageFile(e.target.files[0]);
                                    }
                                } }
                            />
                            <span>Choose Image</span>
                        </label>
                    ) : null }
                </div>

                { loading && <p>Loading...</p> }
                { error && <p style={ { color: 'red' } }>{ error }</p> }
            </div>

            <div className='create-new-quote-container'>
                <button onClick={ addQuoteHandler } disabled={ loading } className='submit-form'>
                    { loading ? 'Submitting...' : 'Add Quote' }
                </button>
                <button className="clear-btn" onClick={ resetHandler }
                        disabled={ !quoteValue.length && !imageFile }>
                    ✗
                </button>
            </div>
        </div>
    );
};

export default Create;
