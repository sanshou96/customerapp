import React, { useState } from 'react';
import CustomerForm from './components/CustomerForm';
import CustomerSearch from './components/CustomerSearch';
import CustomerDetails from './components/CustomerDetails';
import axios from 'axios';

function App() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [customer, setCustomer] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [editedValue, setEditedValue] = useState('');
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
            // Στείλε τα δεδομένα του πελάτη στο backend
            const response = await axios.post('http://localhost:5000/api/customer', customerData);
    
            // Ενημέρωσε το state counters με τα νέα δεδομένα που επιστρέφονται από το backend
            if (response.data.counters) {
                console.log('Backend counters:', response.data.counters); // Προσθήκη log για debugging
                setCounters(response.data.counters);
            }
    
            // Ενημέρωσε το state ή εμφάνισε μήνυμα επιτυχίας
            alert('Customer added successfully!');
            setNewCustomer({
                first_name: '',
                last_name: '',
                phone_1: '',
                phone_2: '',
                phone_3: '',
                weight: '',
                info: '',
                hospital_name: '',
                clinic_name: '',
                building_name: '',
                floor_number: '',
                room_number: '',
                oxygen_usage: '',
                transport_method: '',
                code: ''
            });
    
            // Επιστροφή των δεδομένων στο callback (αν υπάρχει)
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

    const fetchCustomer = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await axios.get(`http://localhost:5000/api/customer?phone=${phoneNumber}`);
            if (response.data) {
                setCustomer(response.data);
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

    const updateCustomer = async (field, value) => {
        try {
            if (!customer) {
                setError('No customer selected');
                return;
            }
            const updatedCustomer = { ...customer, [field]: value };
            const response = await axios.put(`http://localhost:5000/api/customer/${customer.id}`, updatedCustomer);
            
            setCustomer(updatedCustomer);
            setEditingField(null);
            setEditedValue('');
        } catch (err) {
            console.error('Error updating customer:', err);
            setError('Failed to update customer');
        }
    };

    const handleSearch = async ({ phoneNumber, firstName, lastName }) => {
        try {
            setIsLoading(true);
            setError('');
            setCustomer(null); // Καθαρισμός προηγούμενων αποτελεσμάτων
    
            const queryParams = new URLSearchParams();
            if (phoneNumber) queryParams.append('phone', phoneNumber);
            if (firstName) queryParams.append('firstName', firstName);
            if (lastName) queryParams.append('lastName', lastName);
    
            const response = await axios.get(`http://localhost:5000/api/customers?${queryParams.toString()}`);
            if (response.data && response.data.length > 0) {
                setCustomer(response.data[0]); // Ενημέρωση του state με τον πρώτο πελάτη που βρέθηκε
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
        <div style={{ padding: '20px' }}>
            <h1>Customer Management</h1>
            <CustomerForm
                newCustomer={newCustomer}
                setNewCustomer={setNewCustomer}
                transferType={transferType}
                setTransferType={setTransferType}
                addCustomer={addCustomer}              
                counters={counters} // Πέρασμα των counters στο CustomerForm
            />
            <CustomerSearch
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                handleSearch={handleSearch}
            />
            {isLoading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {customer && (
                <CustomerDetails
                    customer={customer}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    editedValue={editedValue}
                    setEditedValue={setEditedValue}
                    updateCustomer={updateCustomer}
                />
            )}
        </div>
    );
}

export default App;