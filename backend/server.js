const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const twilio = require('twilio'); // Προσθήκη Twilio

const accountSid = 'ACf85ef31755844de990aa67a6a52a5446'; // Αντικατέστησε με το SID σου
const authToken = '9e3e4ffcee524ea9090ad4276fa30545';   // Αντικατέστησε με το Token σου
const client = twilio(accountSid, authToken); // Twilio client

const app = express();
const port = 5000;

// Σύνδεση με τη βάση δεδομένων
const db = new sqlite3.Database('./customers.db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Για URL-encoded data

// Αποθηκεύουμε τους συνδρομητές SSE
let sseClients = [];

// Endpoint για SSE
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Προσθέτουμε τον client στη λίστα
    sseClients.push(res);

    // Αφαιρούμε τον client όταν κλείσει η σύνδεση
    req.on('close', () => {
        sseClients = sseClients.filter(client => client !== res);
    });
});

// Ενημέρωση όλων των συνδρομητών SSE
const notifyClients = (data) => {
    sseClients.forEach(client => {
        client.write(`data: ${JSON.stringify(data)}\n\n`);
    });
};

// Endpoint για Twilio XML Response
app.post('/twiml', (req, res) => {
    res.type('text/xml'); // Ορίζουμε τον τύπο της απάντησης ως XML
    res.send(`
        <Response>
            <Say>Thank you for calling. Please hold while we process your call.</Say>
        </Response>
    `);
});

// Λίστα ψευδών αριθμών
const simulatedNumbers = {
    '306998765432': { 
        name: 'Jane Smith', 
        address: 'Thessaloniki, Greece', 
        email: 'jane@example.com', 
        other_info: 'VIP customer' 
    }
};

// Μεταβλητή για αποθήκευση της τελευταίας κλήσης
let lastCall = null;

// Ενημέρωση στο `/incoming-call`
app.post('/incoming-call', (req, res) => {
    console.log('Incoming call data:', req.body);
    const callerNumber = req.body.From; // Ο αριθμός που καλεί
    console.log(`Incoming call from: ${callerNumber}`);
    const formattedNumber = callerNumber.replace('+30', '');

    // Αποθήκευση της τελευταίας κλήσης
    lastCall = formattedNumber;

    // Ενημέρωση των συνδρομητών SSE
    notifyClients({ callerNumber: formattedNumber });

    // Απάντηση στον Twilio (απαιτείται από το Twilio)
    res.type('text/xml');
    res.send(`
        <Response>
            <Say>Thank you for calling. Please hold while we process your call.</Say>
        </Response>
    `);
});

// Endpoint για λήψη της τελευταίας κλήσης
app.get('/last-call', (req, res) => {
    res.json({ callerNumber: lastCall });
});

// Endpoint για αναζήτηση πελάτη
app.get('/api/customer', (req, res) => {
    console.log('Received request for phone number:', req.query.phone_number);
    const phoneNumber = req.query.phone_number;
    const query = `SELECT * FROM Customers WHERE phone_number = ?`;

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

// Νέο Endpoint για προσθήκη πελάτη
app.post('/api/customer', (req, res) => {
    const { name, phone_number, address, email, other_info } = req.body;

    const query = `INSERT INTO Customers (name, phone_number, address, email, other_info) VALUES (?, ?, ?, ?, ?)`;

    db.run(query, [name, phone_number, address, email, other_info], function (err) {
        if (err) {
            console.error('Error inserting data:', err.message);
            return res.status(500).json({ error: 'Failed to insert customer' });
        }
        res.status(201).json({ message: 'Customer added successfully', id: this.lastID });
    });
});

// Νέο Endpoint για ενημέρωση πελάτη
app.put('/api/customer/:id', (req, res) => {
    const { id } = req.params;
    const { name, phone_number, address, email, other_info } = req.body;

    const query = `
        UPDATE Customers
        SET name = ?, phone_number = ?, address = ?, email = ?, other_info = ?
        WHERE id = ?
    `;

    db.run(query, [name, phone_number, address, email, other_info, id], function (err) {
        if (err) {
            console.error('Error updating customer:', err.message);
            return res.status(500).json({ error: 'Failed to update customer' });
        }
        res.json({ message: 'Customer updated successfully' });
    });
});

// Νέο Endpoint για πραγματοποίηση κλήσης μέσω Twilio
app.post('/make-call', (req, res) => {
    const { to } = req.body; // Ο αριθμός που θα καλέσεις

    client.calls
        .create({
            url: 'http://demo.twilio.com/docs/voice.xml', // URL για το TwiML
            to: '+19705140186',
            from: '+306940199334' // Αντικατάστησε με τον αριθμό Twilio σου
        })
        .then(call => {
            console.log(`Call initiated with SID: ${call.sid}`);
            res.status(200).json({ message: 'Call initiated', sid: call.sid });
        })
        .catch(err => {
            console.error('Error initiating call:', err);
            res.status(500).json({ error: 'Failed to initiate call' });
        });
});

// Εκκίνηση του server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});