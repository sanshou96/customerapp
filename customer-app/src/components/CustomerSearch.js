import React from 'react';
import axios from 'axios';
function CustomerSearch({ phoneNumber, setPhoneNumber, handleSearch }) {
    return (
        <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
            <input
                type="text"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{ padding: '10px', marginRight: '10px', width: '300px' }}
            />
            <button type="submit" style={{ padding: '10px 20px' }}>Search</button>
        </form>
    );
}

export default CustomerSearch;
