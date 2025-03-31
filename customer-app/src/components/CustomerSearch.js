import React, { useState } from 'react';

function CustomerSearch({ handleSearch }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        handleSearch({ phoneNumber: phoneNumber.trim(), firstName: firstName.trim(), lastName: lastName.trim() });
    };

    return (
        <form onSubmit={onSubmit} style={{ marginBottom: '20px' }}>
            <input
                type="text"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{ padding: '10px', marginRight: '10px', width: '300px' }}
            />
            <input
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{ padding: '10px', marginRight: '10px', width: '300px' }}
            />
            <input
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{ padding: '10px', marginRight: '10px', width: '300px' }}
            />
            <button type="submit" style={{ padding: '10px 20px' }}>Search</button>
        </form>
    );
}

export default CustomerSearch;
