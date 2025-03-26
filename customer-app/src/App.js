import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [customer, setCustomer] = useState(null);
    const [error, setError] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editingField, setEditingField] = useState(null); // Το πεδίο που επεξεργαζόμαστε
    const [editedValue, setEditedValue] = useState(''); // Η νέα τιμή του πεδίου

    // Νέα πεδία για εισαγωγή δεδομένων
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        phone_number: '',
        address: '',
        email: '',
        other_info: ''
    });

    // Συνάρτηση για εισαγωγή πελάτη
    const addCustomer = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/customer', newCustomer);
            console.log('Customer added:', response.data);
            alert('Customer added successfully!');
            setNewCustomer({ name: '', phone_number: '', address: '', email: '', other_info: '' }); // Καθαρισμός φόρμας
        } catch (err) {
            console.error('Error adding customer:', err);
            alert('Failed to add customer');
        }
    };

    // Συνάρτηση για αναζήτηση πελάτη μέσω πεδίου εισαγωγής
    const fetchCustomer = async () => {
        try {
            setIsLoading(true);
            
            const response = await axios.get(`http://localhost:5000/api/customer?phone_number=${phoneNumber}`);
            console.log('API Response:', response.data);
            setCustomer(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching customer:', err);
            setCustomer(null);
            setError('Customer not found');
        } finally {
            setIsLoading(false);
        }
    };

    // Συνάρτηση για ενημέρωση πελάτη
    const updateCustomer = async (field, value) => {
        try {
            const updatedCustomer = { ...customer, [field]: value };
            const response = await axios.put(`http://localhost:5000/api/customer/${customer.id}`, updatedCustomer);
            console.log('Customer updated:', response.data);
            setCustomer(updatedCustomer);
            setEditingField(null); // Κλείσιμο της φόρμας επεξεργασίας
        } catch (err) {
            console.error('Error updating customer:', err);
            alert('Failed to update customer');
        }
    };

    // Συνάρτηση για εμφάνιση της φόρμας επεξεργασίας
    const handleEdit = (field, currentValue) => {
        setEditingField(field);
        setEditedValue(currentValue);
    };

    // Συνάρτηση για ανάκτηση της τελευταίας κλήσης
    const fetchLastCall = async () => {
        try {
            const response = await axios.get('http://localhost:5000/last-call');
            const callerNumber = response.data.callerNumber;

            if (callerNumber) {
                const customerResponse = await axios.get(
                    `http://localhost:5000/api/customer?phone_number=${callerNumber}`
                );
                setCustomer(customerResponse.data);
                setError('');
            }
        } catch (err) {
            console.error('Error fetching last call:', err);
            setCustomer(null);
            setError('Customer not found');
        }
    };

    // Συνάρτηση για πραγματοποίηση κλήσης
    const makeCall = async () => {
        try {
            const response = await axios.post('http://localhost:5000/make-call', {
                to: '+19705140186'
            });
            console.log('Call initiated:', response.data);
        } catch (err) {
            console.error('Error making call:', err);
        }
    };

    // Περιοδικός έλεγχος για νέες κλήσεις
 

    useEffect(() => {
        // Δημιουργία σύνδεσης με το SSE endpoint
        const eventSource = new EventSource('http://localhost:5000/events');

        // Λήψη δεδομένων όταν υπάρχει νέα εισερχόμενη κλήση
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Incoming call:', data);

            // Εκτέλεση του fetchLastCall όταν υπάρχει νέα κλήση
            fetchLastCall();
        };

        // Καθαρισμός της σύνδεσης όταν το component αποσυνδεθεί
        return () => {
            eventSource.close();
        };
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCustomer();
    };

    // Παρακολούθηση της κατάστασης του customer
    console.log('Customer state:', customer);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Customer Management</h1>

            {/* Φόρμα για εισαγωγή νέου πελάτη */}
            <h2>Add New Customer</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    addCustomer();
                }}
                style={{ marginBottom: '20px' }}
            >
                <input
                    type="text"
                    placeholder="Name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    style={{ padding: '10px', marginRight: '10px', width: '200px' }}
                />
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={newCustomer.phone_number}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone_number: e.target.value })}
                    style={{ padding: '10px', marginRight: '10px', width: '200px' }}
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    style={{ padding: '10px', marginRight: '10px', width: '200px' }}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    style={{ padding: '10px', marginRight: '10px', width: '200px' }}
                />
                <input
                    type="text"
                    placeholder="Other Info"
                    value={newCustomer.other_info}
                    onChange={(e) => setNewCustomer({ ...newCustomer, other_info: e.target.value })}
                    style={{ padding: '10px', marginRight: '10px', width: '200px' }}
                />
                <button type="submit" style={{ padding: '10px 20px' }}>Add Customer</button>
            </form>

            {/* Υπάρχουσα λογική για αναζήτηση πελάτη */}
            <h2>Search Customer</h2>
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

            {isLoading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {customer && (
                <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
                    <h2>Customer Details</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}>Field</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}>Value</th>
                                <th style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(customer)
                                .filter(([field]) => field !== 'id') // Αφαιρούμε το πεδίο id
                                .map(([field, value]) => (
                                    <tr key={field}>
                                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>{field}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                                            {editingField === field ? (
                                                <form
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        updateCustomer(field, editedValue);
                                                    }}
                                                >
                                                    <input
                                                        type="text"
                                                        value={editedValue}
                                                        onChange={(e) => setEditedValue(e.target.value)}
                                                        style={{ padding: '5px', width: '100%' }}
                                                    />
                                                </form>
                                            ) : (
                                                value
                                            )}
                                        </td>
                                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                                            {editingField === field ? (
                                                <>
                                                    <button
                                                        onClick={() => updateCustomer(field, editedValue)}
                                                        style={{ padding: '5px 10px', marginRight: '5px' }}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingField(null)}
                                                        style={{ padding: '5px 10px' }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleEdit(field, value)}
                                                    style={{ padding: '5px 10px' }}
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default App;

