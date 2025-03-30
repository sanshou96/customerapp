import React, { useState, useEffect } from 'react';

function CustomerForm({ newCustomer, setNewCustomer, transferType, setTransferType, addCustomer }) {
    const [counters, setCounters] = useState({});
    const [calculatedCost, setCalculatedCost] = useState(50); // Αρχική τιμή κόστους
    const [savedCustomer, setSavedCustomer] = useState(null); // Νέο state για αποθηκευμένα δεδομένα πελάτη
    const [customerHistory, setCustomerHistory] = useState([]); // State για το ιστορικό του πελάτη

    // Συνάρτηση για την ανάκτηση των counters από το backend
    const fetchCounters = () => {
        fetch('http://localhost:5000/api/counters')
            .then((response) => response.json())
            .then((data) => {
                
                setCounters(data); // Ενημέρωση του state με τους νέους counters
            })
            .catch((error) => console.error('Error fetching counters:', error));
    };
    const fetchCustomerHistory = (customerId) => {
        fetch(`http://localhost:5000/api/customer-history/${customerId}`)
            .then((response) => response.json())
            .then((data) => {
                setCustomerHistory(data); // Ενημέρωση του state με το ιστορικό του πελάτη
            })
            .catch((error) => console.error('Error fetching customer history:', error));
    };
    // Ανάκτηση των counters κατά την αρχική φόρτωση
    useEffect(() => {
        fetchCounters();
    }, []);
    useEffect(() => {
        const baseCost = 50;
        const floorCost = (5*newCustomer.floors || 0) * (newCustomer.has_elevators ? 0 : 1);
        const floordCost = (5*newCustomer.floord || 0) * (newCustomer.has_elevatord ? 0 : 1);
        const totalCost = baseCost + floorCost + floordCost;
      
        setCalculatedCost(totalCost); // Ενημέρωση του δυναμικού κόστους
    }, [newCustomer.floors, newCustomer.floord, newCustomer.has_elevators, newCustomer.has_elevatord]);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Καθορισμός του is_starting_point με βάση τις επιλογές
        const isStartingPoint = transferType === 'Από Νοσοκομείο για Σπίτι';
        const updatedCustomer = { ...newCustomer, is_starting_point: isStartingPoint };
    
    
        addCustomer(updatedCustomer, (response) => {
            if (response && response.counters) {
                setCounters(response.counters); // Ενημέρωση του state με τους νέους counters
            }
            setSavedCustomer(updatedCustomer);
            if (updatedCustomer.id) {
                fetchCustomerHistory(updatedCustomer.id);
            }
            fetchCounters(); // Επαναφορά των counters μετά την αποθήκευση
        });
    };
   

    return (
        <div>
            <form
            onSubmit={handleSubmit}
            style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}
        >
            {/* Βασικά πεδία */}
            <h2>Customer Management</h2>
       {/* Δυναμική Εμφάνιση Κόστους */}
       <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                <label>Υπολογισμένο Κόστος</label>
                <input
                    type="text"
                    value={`${calculatedCost} €`}
                    readOnly
                    style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                <label>Υπολογισμένο Κόστος + ΦΠΑ</label>
                <input
                    type="text"
                    value={`${calculatedCost + (calculatedCost*0.24) } €`}
                    readOnly
                    style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}
                />
            </div>
                  {/* Option Selector */}
                  <div style={{ width: '100%', marginTop: '20px' }}>
                <label style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>Επιλογή Πηγής</label>
                <select
                    value={newCustomer.code || ''}
                    onChange={(e) => setNewCustomer({ ...newCustomer, code: e.target.value })}
                    style={{ padding: '10px', width: '200px' }}
                >
                    <option value="">Πηγή</option>
                    <option value="166">166</option>
                    <option value="153">153</option>
                    <option value="011">011</option>
                    <option value="1600">1600</option>
                </select>
            </div>

            {/* Στατιστικά Counters */}
            <div style={{ width: '100%', marginTop: '10px' }}>
    <h3>Στατιστικά Counters</h3>
    <ul>
        <li>166: {counters["166c"] || 0}</li>
        <li>153: {counters["153c"] || 0}</li>
        <li>011: {counters["011c"] || 0}</li>
        <li>1600: {counters["1600c"] || 0}</li>
    </ul>
</div>
            {/* Radio Buttons */}
            <div style={{ width: '100%' }}>
                <h2>Στοιχεία παραλαβής</h2>
                <div style={{ marginTop: '10px' }}>
                    <label>
                        <input
                            type="radio"
                            name="transfer_type"
                            value="Από Νοσοκομείο για Σπίτι"
                            checked={transferType === 'Από Νοσοκομείο για Σπίτι'}
                            onChange={(e) => setTransferType(e.target.value)}
                        />
                        Από Νοσοκομείο για Σπίτι
                    </label>
                    <br />
                    <label>
                        <input
                            type="radio"
                            name="transfer_type"
                            value="Από Σπίτι σε Νοσοκομείο/Σπίτι"
                            checked={transferType === 'Από Σπίτι σε Νοσοκομείο/Σπίτι'}
                            onChange={(e) => setTransferType(e.target.value)}
                        />
                        Από Σπίτι σε Νοσοκομείο/Σπίτι
                    </label>
                </div>
            </div>
           
            {/* Επιπλέον Φόρμα για "Από Νοσοκομείο για Σπίτι" */}
            {transferType === 'Από Νοσοκομείο για Σπίτι' && (
                <div style={{ width: '100%', marginTop: '20px' }}>
                    <h3>Στοιχεία Νοσοκομείου</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Νοσοκομείο</label>
                            <select
                                value={newCustomer.hospital_name || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, hospital_name: e.target.value })}
                                style={{ padding: '10px' }}
                            >
                                <option value="">Επιλέξτε Νοσοκομείο</option>
                                <option value="Νοσοκομείο Α">Νοσοκομείο Α</option>
                                <option value="Νοσοκομείο Β">Νοσοκομείο Β</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Κλινική</label>
                            <select
                                value={newCustomer.clinic_name || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, clinic_name: e.target.value })}
                                style={{ padding: '10px' }}
                            >
                                <option value="">Επιλέξτε Κλινική</option>
                                <option value="Κλινική Α">Κλινική Α</option>
                                <option value="Κλινική Β">Κλινική Β</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Κτήριο</label>
                            <input
                                type="text"
                                placeholder="Κτήριο"
                                value={newCustomer.building_name || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, building_name: e.target.value })}
                                style={{ padding: '10px' }}
                            />
                        </div>
                       
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
    <label>Όροφος</label>
    <select
        value={newCustomer.floor_number || ''}
        onChange={(e) => setNewCustomer({ ...newCustomer, floor_number: e.target.value })}
        style={{ padding: '10px' }}
    >
        <option value="">Επιλέξτε Όροφο</option>
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
    </select>
</div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Δωμάτιο</label>
                            <input
                                type="text"
                                placeholder="Δωμάτιο"
                                value={newCustomer.room_number || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, room_number: e.target.value })}
                                style={{ padding: '10px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Χρήση Οξυγόνου</label>
                            <select
                                value={newCustomer.oxygen_usage === true ? 'Ναι' : newCustomer.oxygen_usage === false ? 'Όχι' : ''}
                                onChange={(e) => {
                                    const value = e.target.value === 'Ναι' ? true : e.target.value === 'Όχι' ? false : null;
                                    setNewCustomer({ ...newCustomer, oxygen_usage: value });
                                }}
                                style={{ padding: '10px' }}
                            >
                                <option value="">Επιλέξτε</option>
                                <option value="Ναι">Ναι</option>
                                <option value="Όχι">Όχι</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Μέσο Μεταφοράς</label>
                            <input
                                type="text"
                                placeholder="Μέσο Μεταφοράς"
                                value={newCustomer.transport_method || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, transport_method: e.target.value })}
                                style={{ padding: '10px' }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Επιπλέον Φόρμα για "Από Σπίτι σε Νοσοκομείο/Σπίτι" */}
{transferType === 'Από Σπίτι σε Νοσοκομείο/Σπίτι' && (
                <div style={{ width: '100%', marginTop: '20px' }}>
                    <h3>Στοιχεία Κατοικίας</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                            <label>Δήμος/Περιοχή/Νομός/Πόλη</label>
                            <input
                                type="text"
                                placeholder="Δήμος/Περιοχή/Νομός/Πόλη"
                                value={newCustomer.citys || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, citys: e.target.value })}
                                style={{ padding: '10px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Τ/Κ</label>
                            <input
                                type="text"
                                placeholder="Τ/Κ"
                                value={newCustomer.postal_codes || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, postal_codes: e.target.value })}
                                style={{ padding: '10px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Οδός</label>
                            <input
                                type="text"
                                placeholder="Οδός"
                                value={newCustomer.streets || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, streets: e.target.value })}
                                style={{ padding: '10px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Αριθμός</label>
                            <input
                                type="text"
                                placeholder="Αριθμός"
                                value={newCustomer.numbers || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, numbers: e.target.value })}
                                style={{ padding: '10px' }}
                            />
                        </div>
                      
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
    <label>Όροφος</label>
    <select
        value={newCustomer.floors || ''}
        onChange={(e) => setNewCustomer({ ...newCustomer, floors: parseInt(e.target.value, 10) || null})}
        style={{ padding: '10px' }}
    >
        <option value="">Επιλέξτε Όροφο</option>
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
    </select>
</div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Κουδούνι</label>
                            <input
                                type="text"
                                placeholder="Κουδούνι"
                                value={newCustomer.doorbells || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, doorbells: e.target.value })}
                                style={{ padding: '10px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Μέσο Παραλαβής</label>
                            <input
                                type="text"
                                placeholder="Μέσο Παραλαβής"
                                value={newCustomer.transport_methods || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, transport_methods: e.target.value })}
                                style={{ padding: '10px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Ασανσέρ</label>
                            <select
    value={newCustomer.has_elevators === true ? 'Ναι' : newCustomer.has_elevators === false ? 'Όχι' : ''}
    onChange={(e) => {
        const value = e.target.value === 'Ναι' ? true : e.target.value === 'Όχι' ? false : null;
        setNewCustomer({ ...newCustomer, has_elevators: value });
    }}
    style={{ padding: '10px' }}
>
    <option value="">Επιλέξτε</option>
    <option value="Ναι">Ναι</option>
    <option value="Όχι">Όχι</option>
</select>
                        </div>
                   
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
    <label>Χρήση Οξυγόνου</label>
    <select
        value={newCustomer.has_o2s === true ? 'Ναι' : newCustomer.has_o2s === false ? 'Όχι' : ''}
        onChange={(e) => setNewCustomer({ ...newCustomer, has_o2s: e.target.value === 'Ναι' })}
        style={{ padding: '10px' }}
    >
        <option value="">Επιλέξτε</option>
        <option value="Ναι">Ναι</option>
        <option value="Όχι">Όχι</option>
    </select>
</div>
                    </div>
                </div>
            )}
         <h3>Στοιχεία Πελάτη</h3>
                    <div style={{ width: '100%', marginTop: '20px',display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                <label>First Name</label>
                <input
                    type="text"
                    placeholder="First Name"
                    value={newCustomer.first_name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, first_name: e.target.value })}
                    style={{ padding: '10px' }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                <label>Last Name</label>
                <input
                    type="text"
                    placeholder="Last Name"
                    value={newCustomer.last_name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, last_name: e.target.value })}
                    style={{ padding: '10px' }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                <label>Phone 1</label>
                <input
                    type="text"
                    placeholder="Phone 1"
                    value={newCustomer.phone_1}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone_1: e.target.value })}
                    style={{ padding: '10px' }}
                />
            </div>
<div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                <label>Phone 2</label>
                <input
                    type="text"
                    placeholder="Phone 2"
                    value={newCustomer.phone_2}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone_2: e.target.value })}
                    style={{ padding: '10px' }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                <label>Phone 3</label>
                <input
                    type="text"
                    placeholder="Phone 3"
                    value={newCustomer.phone_3}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone_3: e.target.value })}
                    style={{ padding: '10px' }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                <label>Weight</label>
                <input
                    type="text"
                    placeholder="Weight"
                    value={newCustomer.weight}
                    onChange={(e) => setNewCustomer({ ...newCustomer, weight: e.target.value })}
                    style={{ padding: '10px' }}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '400px' }}>
                <label>Info</label>
                <textarea
                    placeholder="Info"
                    value={newCustomer.info}
                    onChange={(e) => setNewCustomer({ ...newCustomer, info: e.target.value })}
                    style={{ padding: '10px', height: '100px' }}
                />
            </div>
        </div>
        {/* Πεδίο για Είδος Συμβάντος/Αιτιολογία */}
<div style={{ display: 'flex', flexDirection: 'column', width: '200px', marginTop: '20px' }}>
    <label>Είδος Συμβάντος/Αιτιολογία</label>
    <select
        value={newCustomer.incident_type || ''}
        onChange={(e) => setNewCustomer({ ...newCustomer, incident_type: e.target.value })}
        style={{ padding: '10px' }}
    >
        <option value="">Επιλέξτε</option>
        <option value="Επείγον">Επείγον</option>
        <option value="Επανεξέταση">Επανεξέταση</option>
        <option value="Χημειοθεραπεία">Χημειοθεραπεία</option>
    </select>
</div>
            <div style={{ width: '100%', marginTop: '20px' }}>
                <h3>Επιλογή Τοποθεσίας</h3>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <label>
                        <input
                            type="radio"
                            name="location_type"
                            value="Νοσοκομείο"
                            checked={newCustomer.location_type === 'Νοσοκομείο'}
                            onChange={(e) => setNewCustomer({ ...newCustomer, location_type: e.target.value })}
                        />
                        Νοσοκομείο
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="location_type"
                            value="Σπίτι"
                            checked={newCustomer.location_type === 'Σπίτι'}
                            onChange={(e) => setNewCustomer({ ...newCustomer, location_type: e.target.value })}
                        />
                        Σπίτι
                    </label>
                </div>
            </div>

            {/* Επιπλέον Φόρμα για "Νοσοκομείο" */}
            {newCustomer.location_type === 'Νοσοκομείο' && (
                <div style={{ width: '100%', marginTop: '20px' }}>
                    <h3>Στοιχεία Νοσοκομείου</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Νοσοκομείο</label>
                            <select
                                value={newCustomer.hospital_name || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, hospital_name: e.target.value })}
                                style={{ padding: '10px' }}
                            >
                                <option value="">Επιλέξτε Νοσοκομείο</option>
                                <option value="Νοσοκομείο Α">Νοσοκομείο Α</option>
                                <option value="Νοσοκομείο Β">Νοσοκομείο Β</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Κλινική</label>
                            <select
                                value={newCustomer.clinic_name || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, clinic_name: e.target.value })}
                                style={{ padding: '10px' }}
                            >
                                <option value="">Επιλέξτε Κλινική</option>
                                <option value="Κλινική Α">Κλινική Α</option>
                                <option value="Κλινική Β">Κλινική Β</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Κτήριο</label>
                            <input
                                type="text"
                                placeholder="Κτήριο"
                                value={newCustomer.building_name || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, building_name: e.target.value })}
                                style={{ padding: '10px' }}
                            />
                        </div>
                   
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
    <label>Όροφος</label>
    <select
        value={newCustomer.floor_number || ''}
        onChange={(e) => setNewCustomer({ ...newCustomer, floor_number: e.target.value })}
        style={{ padding: '10px' }}
    >
        <option value="">Επιλέξτε Όροφο</option>
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
    </select>
</div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Δωμάτιο</label>
                            <input
                                type="text"
                                placeholder="Δωμάτιο"
                                value={newCustomer.room_number || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, room_number: e.target.value })}
                                style={{ padding: '10px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Χρήση Οξυγόνου</label>
                            <select
                                value={newCustomer.oxygen_usage === true ? 'Ναι' : newCustomer.oxygen_usage === false ? 'Όχι' : ''}
                                onChange={(e) => {
                                    const value = e.target.value === 'Ναι' ? true : e.target.value === 'Όχι' ? false : null;
                                    setNewCustomer({ ...newCustomer, oxygen_usage: value });
                                }}
                                style={{ padding: '10px' }}
                            >
                                <option value="">Επιλέξτε</option>
                                <option value="Ναι">Ναι</option>
                                <option value="Όχι">Όχι</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Μέσο Μεταφοράς</label>
                            <input
                                type="text"
                                placeholder="Μέσο Μεταφοράς"
                                value={newCustomer.transport_method || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, transport_method: e.target.value })}
                                style={{ padding: '10px' }}
                            />
                        </div>
                    </div>
                </div>
            )}
            {newCustomer.location_type === 'Σπίτι' && (
                <div style={{ width: '100%', marginTop: '20px' }}>
                    <h3>Στοιχεία Σπιτιού</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                            <label>Δήμος/Περιοχή/Νομός/Πόλη</label>
                            <input
                                type="text"
                                placeholder="Δήμος/Περιοχή/Νομός/Πόλη"
                                value={newCustomer.cityd || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, cityd: e.target.value })}
                                style={{ padding: '10px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Τ/Κ</label>
                            <input
                                type="text"
                                placeholder="Τ/Κ"
                                value={newCustomer.postal_coded || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, postal_coded: e.target.value })}
                                style={{ padding: '10px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Οδός</label>
                            <input
                                type="text"
                                placeholder="Οδός"
                                value={newCustomer.streetd || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, streetd: e.target.value })}
                                style={{ padding: '10px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Αριθμός</label>
                            <input
                                type="text"
                                placeholder="Αριθμός"
                                value={newCustomer.numberd || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, numberd: e.target.value })}
                                style={{ padding: '10px' }}
                            />
                        </div>
                       
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
    <label>Όροφος</label>
    <select
        value={newCustomer.floord || ''}
        onChange={(e) => setNewCustomer({ ...newCustomer, floord: parseInt(e.target.value, 10) || null })}
        style={{ padding: '10px' }}
    >
        <option value="">Επιλέξτε Όροφο</option>
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
    </select>
</div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Κουδούνι</label>
                            <input
                                type="text"
                                placeholder="Κουδούνι"
                                value={newCustomer.doorbelld || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, doorbelld: e.target.value })}
                                style={{ padding: '10px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Μέσο Μεταφοράς</label>
                            <input
                                type="text"
                                placeholder="Μέσο Μεταφοράς"
                                value={newCustomer.transport_methodd || ''}
                                onChange={(e) => setNewCustomer({ ...newCustomer, transport_methodd: e.target.value })}
                                style={{ padding: '10px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Ασανσέρ</label>
                            <select
                                value={newCustomer.has_elevatord === true ? 'Ναι' : newCustomer.has_elevatord === false ? 'Όχι' : ''}
                                onChange={(e) => {
                                    const value = e.target.value === 'Ναι' ? true : e.target.value === 'Όχι' ? false : null;
                                    setNewCustomer({ ...newCustomer, has_elevatord: value });
                                }}
                                style={{ padding: '10px' }}
                            >
                                <option value="">Επιλέξτε</option>
                                <option value="Ναι">Ναι</option>
                                <option value="Όχι">Όχι</option>
                            </select>
                        </div>
                     
                     
                        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                            <label>Χρήση Οξυγόνου</label>
                            <select
                                value={newCustomer.has_o2d === true ? 'Ναι' : newCustomer.has_o2d === false ? 'Όχι' : ''}
                                onChange={(e) => {
                                    const value = e.target.value === 'Ναι' ? true : e.target.value === 'Όχι' ? false : null;
                                    setNewCustomer({ ...newCustomer, has_o2d: value });
                                }}
                                style={{ padding: '10px' }}
                            >
                                <option value="">Επιλέξτε</option>
                                <option value="Ναι">Ναι</option>
                                <option value="Όχι">Όχι</option>
                            </select>
                        </div>
                    
                    </div>
                </div>
            )}
            <button type="submit" style={{ padding: '10px 20px', marginTop: '10px' }}>Αποθήκευση Δεδομένων</button>
        </form>
         {/* Εμφάνιση αποθηκευμένων δεδομένων πελάτη */}
         {savedCustomer && (
    <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>Αποθηκευμένα Στοιχεία Πελάτη</h3>
        <p><strong>Όνομα:</strong> {savedCustomer.first_name}</p>
        <p><strong>Επώνυμο:</strong> {savedCustomer.last_name}</p>
        <p><strong>Τηλέφωνο 1:</strong> {savedCustomer.phone_1}</p>
        <p><strong>Τηλέφωνο 2:</strong> {savedCustomer.phone_2}</p>
        <p><strong>Τηλέφωνο 3:</strong> {savedCustomer.phone_3}</p>
        <p><strong>Βάρος:</strong> {savedCustomer.weight}</p>
        <p><strong>Πληροφορίες:</strong> {savedCustomer.info}</p>

        {/* Εμφάνιση Ιστορικού Πελάτη */}
        {customerHistory.length > 0 && (
            <div style={{ marginTop: '20px' }}>
                <h3>Ιστορικό Πελάτη</h3>
                <ul>
                    {customerHistory.map((entry, index) => (
                        <li key={index} style={{ marginBottom: '10px' }}>
                            <p><strong>Ημερομηνία:</strong> {new Date(entry.date).toLocaleDateString()}</p>
                            <p><strong>Αφετηρία:</strong> {entry.starting_point}</p>
                            <p><strong>Προορισμός:</strong> {entry.destination}</p>
                            <p><strong>Είδος Συμβάντος:</strong> {entry.incident_type}</p>
                            <p><strong>Κόστος:</strong> {entry.cost} €</p>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
)}
        </div>
    );
}

export default CustomerForm;
