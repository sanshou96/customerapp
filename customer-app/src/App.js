import React, { useState } from 'react';
import CustomerForm from './components/CustomerForm';
import CustomerSearch from './components/CustomerSearch';
import axios from 'axios';

function App() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [customer, setCustomer] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        first_name: '',
        last_name: '',
        phone_1: '',
        phone_2: '',
        phone_3: '',
        weight: '',
        info: '',
        code: '',
    });
    const [transferType, setTransferType] = useState('');
    const [counters, setCounters] = useState({});

    const addCustomer = async (customerData, callback) => {
        try {
            const response = await axios.post('http://localhost:5000/api/customer', customerData);
            if (response.data.counters) {
                setCounters(response.data.counters);
            }
            alert('Customer added successfully!');
            setNewCustomer({
                first_name: '',
                last_name: '',
                phone_1: '',
                phone_2: '',
                phone_3: '',
                weight: '',
                info: '',
                code: '',
            });
            if (callback) {
                callback(response.data);
            }
        } catch (err) {
            console.error('Error adding customer:', err);
            alert('Failed to add customer');
            if (callback) {
                callback(null);
            }
        }
    };

    const handleSearch = async ({ phoneNumber, firstName, lastName }) => {
        try {
            setIsLoading(true);
            setError('');
            setCustomer(null);

            const queryParams = new URLSearchParams();
            if (phoneNumber) queryParams.append('phone', phoneNumber);
            if (firstName) queryParams.append('firstName', firstName);
            if (lastName) queryParams.append('lastName', lastName);

            const response = await axios.get(`http://localhost:5000/api/customers?${queryParams.toString()}`);
            if (response.data && response.data.length > 0) {
                setCustomer(response.data[0]);
            } else {
                setError('Customer not found');
            }
        } catch (err) {
            console.error('Error fetching customer:', err);
            setError('Failed to fetch customer');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div >
            
         
            {isLoading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <CustomerForm
                newCustomer={newCustomer}
                setNewCustomer={setNewCustomer}
                transferType={transferType}
                setTransferType={setTransferType}
                addCustomer={addCustomer}
                counters={counters}
                customer={customer} // Περάστε τον πελάτη που βρέθηκε
            />
        </div>
    );
}

export default App;