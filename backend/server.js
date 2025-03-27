const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 5000;

// Σύνδεση με τη βάση δεδομένων
const db = new sqlite3.Database('./customers.db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Για URL-encoded data

// Endpoint για αναζήτηση πελάτη
app.get('/api/customer', (req, res) => {
    console.log('Received request for phone number:', req.query.phone_1);
    const phoneNumber = req.query.phone_1;
    const query = `SELECT * FROM Customer WHERE phone_1 = ?`;

    db.get(query, [phoneNumber], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    });
});

// Νέο Endpoint για προσθήκη ή ενημέρωση πελάτη
app.post('/api/customer', (req, res) => {
    console.log('Received customer data:', req.body); // Debugging log
    const {
        first_name,
        last_name,
        phone_1,
        phone_2,
        phone_3,
        weight,
        info,
        hospital_name,
        clinic_name,
        building_name,
        floor_number,
        room_number,
        oxygen_usage,
        transport_method,
        transport_methods,
        transport_methodd,
        citys,
        cityd,
        streets,
        streetd,
        numbers,
        numberd,
        floors,
        floord,
        doorbells,
        doorbelld,
        has_elevators,
        has_elevatord,
        postal_codes,
        postal_coded,
        has_o2s,
        has_o2d,
        code
    } = req.body;

    // Αποθήκευση δεδομένων στον Customer
    if (first_name || last_name || phone_1 || phone_2 || phone_3 || weight || info) {
        const insertCustomerQuery = `
            INSERT INTO Customer (first_name, last_name, phone_1, phone_2, phone_3, weight, info)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(insertCustomerQuery, [first_name || null, last_name || null, phone_1 || null, phone_2 || null, phone_3 || null, weight || null, info || null], function (err) {
            if (err) {
                console.error('Error inserting customer:', err.message);
            } else {
                console.log('Customer data added successfully with ID:', this.lastID);
            }
        });
    }

    // Αποθήκευση δεδομένων στο Hospital
    if (hospital_name || clinic_name || building_name || floor_number || room_number || oxygen_usage || transport_method) {
        const hospitalQuery = `
            INSERT INTO Hospital (hospital_name, clinic_name, building_name, floor_number, room_number, oxygen_usage, transport_method)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(hospitalQuery, [
            hospital_name || null,
            clinic_name || null,
            building_name || null,
            floor_number || null,
            room_number || null,
            oxygen_usage ? 1 : 0,
            transport_method || null
        ], function (err) {
            if (err) {
                console.error('Error inserting hospital data:', err.message);
            } else {
                console.log('Hospital data added successfully');
            }
        });
    }

    // Αποθήκευση δεδομένων στο Starting_point
    if (citys || streets || numbers || floors || doorbells || transport_methods || has_elevators !== undefined || postal_codes || has_o2s !== undefined) {
        const startingPointQuery = `
            INSERT INTO Starting_point (citys, streets, numbers, floors, doorbells, transport_methods, has_elevators, postal_codes, has_o2s)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(startingPointQuery, [
            citys || null,
            streets || null,
            numbers || null,
            floors || null,
            doorbells || null,
            transport_methods || null,
            has_elevators ? 1 : 0,
            postal_codes || null,
            has_o2s ? 1 : 0
        ], function (err) {
            if (err) {
                console.error('Error inserting starting point data:', err.message);
            } else {
                console.log('Starting point data added successfully');
            }
        });
    }

    // Αποθήκευση δεδομένων στο Destination
    if (cityd || streetd || numberd || floord || doorbelld || transport_methodd || has_elevatord !== undefined || postal_coded || has_o2d !== undefined) {
        const destinationQuery = `
            INSERT INTO Destination (cityd, streetd, numberd, floord, has_elevatord, doorbelld, transport_methodd, postal_coded, has_o2d)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(destinationQuery, [
            cityd || null,
            streetd || null,
            numberd || null,
            floord || null,
            has_elevatord ? 1 : 0,
            doorbelld || null,
            transport_methodd || null,
            postal_coded || null,
            has_o2d ? 1 : 0
        ], function (err) {
            if (err) {
                console.error('Error inserting destination data:', err.message);
            } else {
                console.log('Destination data added successfully');
            }
        });
    }


    // Αύξηση του αντίστοιχου counter
    if (code) {
        const counterField = `"${code}c"`;
        const updateCounterQuery = `UPDATE Counters SET ${counterField} = ${counterField} + 1`;

        db.run(updateCounterQuery, function (err) {
            if (err) {
                console.error(`Error updating counter ${counterField}:`, err.message);
                return res.status(500).json({ error: 'Failed to update counter' });
            }
            console.log(`Counter ${counterField} updated successfully`);

            // Επιστροφή των ενημερωμένων counters
            const fetchCountersQuery = `SELECT "166c", "153c", "011c", "1600c" FROM Counters`;
            db.get(fetchCountersQuery, (err, row) => {
                if (err) {
                    console.error('Error fetching counters:', err.message);
                    return res.status(500).json({ error: 'Failed to fetch counters' });
                }
                return res.status(200).json({ message: 'Operation completed successfully', counters: row });
            });
        });
        return; // Σταματάμε την εκτέλεση εδώ για να μην σταλεί δεύτερη απάντηση
    }

    // Απάντηση στον πελάτη αν δεν υπάρχει κωδικός
    res.status(200).json({ message: 'Operation completed successfully' });
});



// Νέο Endpoint για ενημέρωση πελάτη
app.put('/api/customer/:id', (req, res) => {
    const { id } = req.params;
    const { first_name,last_name, phone_1, phone_2, phone_3, info,weight } = req.body;

    const query = `
        UPDATE Customer
        SET first_name = ?,last_name = ?, phone_1 = ?, phone_2 = ?, phone_3 = ?, info = ?, weight = ?
        WHERE id = ?
    `;

    db.run(query, [first_name, last_name, phone_1, phone_2, phone_3,info, weight, id], function (err) {
        if (err) {
            console.error('Error updating customer:', err.message);
            return res.status(500).json({ error: 'Failed to update customer' });
        }
        res.json({ message: 'Customer updated successfully' });
    });
});

// Endpoint για ανάκτηση των counters
app.get('/api/counters', (req, res) => {
    const query = `SELECT "166c", "153c", "011c", "1600c" FROM Counters`;

    db.get(query, (err, row) => {
        if (err) {
            console.error('Error fetching counters:', err.message);
            return res.status(500).json({ error: 'Failed to fetch counters' });
        }
        res.json(row);
    });
});

// Εκκίνηση του server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});