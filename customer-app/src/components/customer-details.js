import React, { useState, useEffect } from 'react';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('el-GR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function CustomerDetails({ customerId }) {
  const [customer, setCustomer] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!customerId) return;
    
    setLoading(true);
    
    // Fetch customer details
    fetch(`http://localhost:5000/api/customer/${customerId}`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch customer details');
        return response.json();
      })
      .then(data => {
        setCustomer(data);
        
        // Fetch customer history
        return fetch(`http://localhost:5000/api/customer-history/${customerId}`);
      })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch customer history');
        return response.json();
      })
      .then(historyData => {
        setHistory(historyData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching customer data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [customerId]);

  if (loading) return <div>Φόρτωση στοιχείων πελάτη...</div>;
  if (error) return <div>Σφάλμα: {error}</div>;
  if (!customer) return <div>Δεν βρέθηκαν στοιχεία πελάτη</div>;

  return (
    <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Στοιχεία Πελάτη</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h3>Προσωπικά Στοιχεία</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Όνομα:</td>
                <td style={{ padding: '8px' }}>{customer.first_name}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Επώνυμο:</td>
                <td style={{ padding: '8px' }}>{customer.last_name}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Τηλέφωνο 1:</td>
                <td style={{ padding: '8px' }}>{customer.phone_1}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Τηλέφωνο 2:</td>
                <td style={{ padding: '8px' }}>{customer.phone_2}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Τηλέφωνο 3:</td>
                <td style={{ padding: '8px' }}>{customer.phone_3}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Βάρος:</td>
                <td style={{ padding: '8px' }}>{customer.weight}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Πληροφορίες:</td>
                <td style={{ padding: '8px' }}>{customer.info}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h3>Ιστορικό Μεταφορών</h3>
      {history.length === 0 ? (
        <p>Δεν υπάρχει ιστορικό μεταφορών για αυτόν τον πελάτη.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Ημερομηνία</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Είδος Συμβάντος</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Αφετηρία</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Προορισμός</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Νοσοκομείο</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Κόστος</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{formatDate(record.created_at)}</td>
                  <td style={{ padding: '10px' }}>{record.incident_type || '-'}</td>
                  <td style={{ padding: '10px' }}>
                    {record.starting_city ? (
                      <>
                        {record.starting_city}, {record.starting_street || ''}
                      </>
                    ) : (
                      record.hospital_name || '-'
                    )}
                  </td>
                  <td style={{ padding: '10px' }}>
                    {record.destination_city ? (
                      <>
                        {record.destination_city}, {record.destination_street || ''}
                      </>
                    ) : (
                      record.hospital_name || '-'
                    )}
                  </td>
                  <td style={{ padding: '10px' }}>
                    {record.hospital_name ? (
                      <>
                        {record.hospital_name} {record.clinic_name ? `(${record.clinic_name})` : ''}
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td style={{ padding: '10px' }}>{record.cost ? `${record.cost} €` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CustomerDetails;