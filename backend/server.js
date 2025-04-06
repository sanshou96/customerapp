const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 5000;

// Database connection
const db = new sqlite3.Database('./customers.db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Search customer by phone number
app.get('/api/customer', (req, res) => {
 
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

// Add or update customer information
app.post('/api/customer', async (req, res) => {
  
  
  try {
    const {
      first_name, last_name, phone_1, phone_2, phone_3, weight, info,
      hospital_name, clinic_name, building_name, floor_number, room_number,
      oxygen_usage, transport_method, transport_methods, transport_methodd,
      citys, cityd, streets, streetd, numbers, numberd, floors, floord,
      doorbells, doorbelld, has_elevators, has_elevatord, postal_codes,
      postal_coded, has_o2s, has_o2d, code, is_starting_point, incident_type
    } = req.body;
   let cost = 50;
   let fpa = 0;

    // Helper functions for database operations
    function insertCustomer(data) {
      return new Promise((resolve, reject) => {
        const query = `
          INSERT INTO Customer (first_name, last_name, phone_1, phone_2, phone_3, weight, info)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.run(query, [
          data.first_name || null,
          data.last_name || null,
          data.phone_1 || null,
          data.phone_2 || null,
          data.phone_3 || null,
          data.weight || null,
          data.info || null
        ], function(err) {
          if (err) {
            console.error('Error inserting customer:', err.message);
            return reject(err);
          }
          resolve(this.lastID);
        });
      });
    }
    
    function insertHospital(data) {
        if (hospital_name || clinic_name || building_name || floor_number || room_number || oxygen_usage || transport_method || is_starting_point) {
      return new Promise((resolve, reject) => {
        const query = `
          INSERT INTO Hospital (hospital_name, clinic_name, building_name, floor_number, room_number, oxygen_usage, transport_method, is_starting_point)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.run(query, [
          data.hospital_name || null,
          data.clinic_name || null,
          data.building_name || null,
          data.floor_number || null,
          data.room_number || null,
          data.oxygen_usage ? 1 : 0,
          data.transport_method || null,
          data.is_starting_point ? 1 : 0
        ], function(err) {
          if (err) {
            console.error('Error inserting hospital:', err.message);
            return reject(err);
          }
          resolve(this.lastID);
        });
      });
    }
}
    function insertStartingPoint(data) {
        if (citys || streets || numbers || floors || doorbells || transport_methods || has_elevators !== undefined || postal_codes || has_o2s !== undefined) {
      return new Promise((resolve, reject) => {
        const query = `
          INSERT INTO Starting_point (citys, streets, numbers, floors, doorbells, transport_methods, has_elevators, postal_codes, has_o2s)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.run(query, [
          data.citys || null,
          data.streets || null,
          data.numbers || null,
          data.floors || null,
          data.doorbells || null,
          data.transport_methods || null,
          data.has_elevators ? 1 : 0,
          data.postal_codes || null,
          data.has_o2s ? 1 : 0
        ], function(err) {
          if (err) {
            console.error('Error inserting starting point:', err.message);
            return reject(err);
          }
          resolve({
            id: this.lastID,       // Το ID της εισαγωγής (προαιρετικό)
            floors: data.floors,  // Η τιμή που μπήκε στη βάση
            has_elevators: data.has_elevators ? 1 : 0  // Boolean → 0/1
        });
        });
      });
    }return Promise.resolve({
        id: null,       // Το ID της εισαγωγής (προαιρετικό)
        floors: null,  // Η τιμή που μπήκε στη βάση
        has_elevators: null // Boolean → 0/1
    });
}
    function insertDestination(data) {
        if (cityd || streetd || numberd || floord || doorbelld || transport_methodd || has_elevatord !== undefined || postal_coded || has_o2d !== undefined) {
      return new Promise((resolve, reject) => {
        const query = `
          INSERT INTO Destination (cityd, streetd, numberd, floord, has_elevatord, doorbelld, transport_methodd, postal_coded, has_o2d)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.run(query, [
          data.cityd || null,
          data.streetd || null,
          data.numberd || null,
          data.floord || null,
          data.has_elevatord ? 1 : 0,
          data.doorbelld || null,
          data.transport_methodd || null,
          data.postal_coded || null,
          data.has_o2d ? 1 : 0
        ], function(err) {
          if (err) {
            console.error('Error inserting destination:', err.message);
            return reject(err);
          }
          resolve({
            id: this.lastID,       // Το ID της εισαγωγής (προαιρετικό)
            floord: data.floord,  // Η τιμή που μπήκε στη βάση
            has_elevatord: data.has_elevatord ? 1 : 0  // Boolean → 0/1
        });
        });
      });
    }else {
        // Επιστρέφουμε ένα κενό αντικείμενο αν δεν υπάρχουν δεδομένα
        return Promise.resolve({
            id: null,       // Το ID της εισαγωγής (προαιρετικό)
            floord: null,  // Η τιμή που μπήκε στη βάση
            has_elevatord: null // Boolean → 0/1
        });
      }
}
   
    function insertCustomerHistory(customer_id, hospital_id, destination_id, starting_point_id, cost,fpa, incident_type) {
       
        return new Promise((resolve, reject) => {
          const query = `
            INSERT INTO CustomerHistory (customer_id, hospital_id, destination_id, starting_point_id, cost,fpa, incident_type)
            VALUES (?, ?, ?, ?, ?, ?,?)
          `;
          db.run(query, [
            customer_id || null,
            hospital_id || null,
            destination_id || null,
            starting_point_id || null,
            cost, 
            fpa,
            incident_type || null
          ], function(err) {
            if (err) {
              console.error('Error inserting customer history:', err.message);
              return reject(err);
            }
            resolve(this.lastID);
          });
        });
      }
    
    function updateCounter(code) {
      return new Promise((resolve, reject) => {
        const counterField = `"${code}c"`;
        const updateCounterQuery = `UPDATE Counters SET ${counterField} = ${counterField} + 1`;
        
        db.run(updateCounterQuery, function(err) {
          if (err) {
            console.error(`Error updating counter ${counterField}:`, err.message);
            return reject(err);
          }
         
          
          // Return updated counters
          const fetchCountersQuery = `SELECT "166c", "153c", "011c", "1600c" FROM Counters`;
          db.get(fetchCountersQuery, (err, row) => {
            if (err) {
              console.error('Error fetching counters:', err.message);
              return reject(err);
            }
            resolve(row);
          });
        });
      });
    }
    
    // Check if customer exists
    const checkCustomerQuery = `SELECT id, info FROM Customer WHERE first_name = ? AND last_name = ?`;
    db.get(checkCustomerQuery, [first_name, last_name], async (err, row) => {
      if (err) {
        console.error('Error checking customer:', err.message);
        return res.status(500).json({ error: 'Failed to check customer' });
      }
      
      let customerId;
      
      if (row) {
        // Update existing customer
        customerId = row.id;
        const updatedInfo = row.info ? `${row.info},${info}` : info; // Συνένωση του υπάρχοντος info με το νέο
        const updateCustomerQuery = `
          UPDATE Customer
          SET phone_1 = ?, phone_2 = ?, phone_3 = ?, weight = ?, info = ?
          WHERE id = ?
        `;
        db.run(updateCustomerQuery, [phone_1, phone_2, phone_3, weight,updatedInfo, customerId], function(err) {
          if (err) {
            
            console.error('Error updating customer:', err.message);
            return res.status(500).json({ error: 'Failed to update customer' });
          }
          console.log(updatedInfo);
          console.log(row.info);
          console.log('Customer updated successfully');
        });
      } else {
        // Insert new customer
        try {
          customerId = await insertCustomer(req.body);
          console.log('Customer added successfully with ID:', customerId);
        } catch (error) {
          console.error('Error inserting customer:', error.message);
          return res.status(500).json({ error: 'Failed to insert customer' });
        }
      }
      
      try {
        // Process other data
        const hospitalId = await insertHospital(req.body);
        
        const startingPointId = await insertStartingPoint(req.body);
        
        const destinationId = await insertDestination(req.body);
       
       
    
        // Insert customer history
        let historyId = null;
        const customer_id = customerId;
        const hospital_id = hospitalId;
        const destination_id = destinationId.id ||null;
        const starting_point_id = startingPointId.id || null;
        

        if (customerId || hospitalId || startingPointId || destinationId || cost || fpa) {
            if (destinationId && destinationId.has_elevatord === 0 && destinationId.floord != 'undefined') {
                cost += ((destinationId.floord || 0) * 5);
               
            }else{
                destinationId.floord= null;
            }
            if (startingPointId && startingPointId.has_elevators === 0 && startingPointId.floors != 'undefined') {
                cost += (5 * (startingPointId.floors || 0));
                
            }
           fpa = cost+cost * 0.24;
          try {
            historyId = await insertCustomerHistory(
              customer_id, 
              hospital_id, 
              destination_id, 
              starting_point_id, 
              cost, 
              fpa,
              incident_type
            );
      
           
          } catch (error) {
            console.error('Error inserting customer history:', error.message);
            // Continue execution even if history insertion fails
          }
        }
         // Endpoint για αποθήκευση ιστορικού πελάτη

        // Process code counter if provided
        let counters = null;
        if (code) {
          try {
            counters = await updateCounter(code);
            
          } catch (error) {
            console.error('Error updating counters:', error.message);
            // Continue execution even if counter update fails
          }
        }
        
        if (!res.headersSent) {
          res.status(200).json({ 
            message: 'Data saved successfully',
            customerId,
            hospitalId,
            startingPointId,
            destinationId,
            historyId,
            counters
          });
        }
      } catch (error) {
        console.error('Error processing data:', error.message);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to process data' });
        }
      }
    });
  } catch (error) {
    console.error('Error saving data:', error.message);
    res.status(500).json({ error: 'Failed to save data' });
  }
});



// Get customer history
app.get('/api/customer-history/:customerId', async (req, res) => {
  const { customerId } = req.params;

  try {
    console.log('Fetching history for customer ID:', customerId); // Καταγραφή του customerId

    const query = `
      SELECT ch.*, 
             c.first_name, c.last_name, c.phone_1,
             h.hospital_name, h.clinic_name, h.building_name, h.floor_number, h.room_number, h.is_starting_point,
             h.transport_method, h.oxygen_usage,
             COALESCE(sp.citys, h.hospital_name) as starting_city,
             COALESCE(sp.streets, h.clinic_name) as starting_street,
             COALESCE(sp.numbers, h.building_name) as starting_number,
             COALESCE(sp.postal_codes, '') as starting_postal_code,
             COALESCE(sp.floors, h.floor_number) as starting_floor,
             COALESCE(sp.has_elevators, 0) as starting_elevator,
             COALESCE(sp.transport_methods, h.transport_method) as starting_transport_method,
             COALESCE(sp.has_o2s, h.oxygen_usage) as starting_oxygen_usage,
             COALESCE(d.cityd, h.hospital_name) as destination_city,
             COALESCE(d.streetd, h.clinic_name) as destination_street,
             COALESCE(d.numberd, h.building_name) as destination_number,
             COALESCE(d.postal_coded, '') as destination_postal_code,
             COALESCE(d.floord, h.floor_number) as destination_floor,
             COALESCE(d.has_elevatord, 0) as destination_elevator,
             COALESCE(d.doorbelld, '') as destination_doorbell,
             COALESCE(sp.doorbells, '') as starting_doorbell,
             COALESCE(d.transport_methodd, h.transport_method) as destination_transport_method,
             COALESCE(d.has_o2d, h.oxygen_usage) as destination_oxygen_usage,
             ch.fpa -- Προσθήκη του FPA
      FROM CustomerHistory ch
      LEFT JOIN Customer c ON ch.customer_id = c.id
      LEFT JOIN Hospital h ON ch.hospital_id = h.id
      LEFT JOIN Starting_point sp ON ch.starting_point_id = sp.id
      LEFT JOIN Destination d ON ch.destination_id = d.id
      WHERE ch.customer_id = ?
      ORDER BY ch.id DESC;
    `;

    console.log('Executing query:', query); // Καταγραφή του query

    db.all(query, [customerId], (err, rows) => {
      if (err) {
        console.error('Error executing query:', err.message); // Καταγραφή του σφάλματος
        return res.status(500).json({ error: 'Failed to fetch customer history' });
      }

      console.log('Query result:', rows); // Καταγραφή των αποτελεσμάτων
      res.json(rows);
    });
  } catch (error) {
    console.error('Error fetching customer history:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update customer endpoint
app.put('/api/customer/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    // Δημιουργία δυναμικού query
    const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
    const values = Object.values(updates);
  
    const query = `
      UPDATE Customer
      SET ${fields}
      WHERE id = ?
    `;
  
    db.run(query, [...values, id], function(err) {
      if (err) {
        console.error('Error updating customer:', err.message);
        return res.status(500).json({ error: 'Failed to update customer' });
      }
      res.json({ message: 'Customer updated successfully' });
    });
  });

// Get counters endpoint
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

app.get('/api/customers', (req, res) => {
    const { phoneNumber, firstName, lastName } = req.query;
  
    let query = 'SELECT * FROM Customer WHERE 1=1';
    const params = [];
  
    if (phoneNumber) {
      query += ' AND phone_1 = ?';
      params.push(phoneNumber);
    }
    if (firstName && lastName) {
      query += ' AND first_name = ? AND last_name = ?';
      params.push(firstName, lastName);
    }
  
    db.get(query, params, (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Error fetching customer');
      } else {
        res.json({ customer: row });
      }
    });
  });
  app.get('/api/customers', (req, res) => {
    const { firstName, lastName } = req.query;
  
    const query = `SELECT * FROM Customer WHERE first_name = ? AND last_name = ?`;
    db.get(query, [firstName, lastName], (err, row) => {
      if (err) {
        console.error('Error fetching customer:', err.message);
        return res.status(500).json({ error: 'Failed to fetch customer' });
      }
  
      if (row) {
        res.json({ customer: row });
      } else {
        res.status(404).json({ message: 'Customer not found' });
      }
    });
  });
// Close the database connection when the server shuts down
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});