"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import "./CustomerForm.css"

function CustomerForm({ newCustomer, setNewCustomer, transferType, setTransferType, addCustomer }) {
  const [counters, setCounters] = useState({})
  const [calculatedCost, setCalculatedCost] = useState(50)
  const [savedCustomer, setSavedCustomer] = useState(null)
  const [customerHistory, setCustomerHistory] = useState([])

  const fetchCounters = () => {
    fetch("http://localhost:5000/api/counters")
      .then((response) => response.json())
      .then((data) => setCounters(data))
      .catch((error) => console.error("Error fetching counters:", error))
  }

  const fetchCustomerHistory = async (customerId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/customer-history/${customerId}`)
      if (response.data) {
        setCustomerHistory(response.data)
      }
    } catch (err) {
      console.error("Error fetching customer history:", err)
    }
  }

  useEffect(() => {
    fetchCounters()
  }, [])

  useEffect(() => {
    const baseCost = 50
    const floorCost = (5 * newCustomer.floors || 0) * (newCustomer.has_elevators ? 0 : 1)
    const floordCost = (5 * newCustomer.floord || 0) * (newCustomer.has_elevatord ? 0 : 1)
    const totalCost = baseCost + floorCost + floordCost
    setCalculatedCost(totalCost)
  }, [newCustomer.floors, newCustomer.floord, newCustomer.has_elevators, newCustomer.has_elevatord])

  const handleSubmit = (e) => {
    e.preventDefault()
    const isStartingPoint = transferType === "Από Νοσοκομείο για Σπίτι"
    const updatedCustomer = { ...newCustomer, is_starting_point: isStartingPoint }

    addCustomer(updatedCustomer, (response) => {
      if (response && response.counters) {
        setCounters(response.counters)
      }
      setSavedCustomer(updatedCustomer)
      if (response && response.customerId) {
        fetchCustomerHistory(response.customerId)
      }
      fetchCounters()
    })
  }

  const floorOptions = Array.from({ length: 11 }, (_, i) => (
    <option key={i} value={i.toString()}>
      {i}
    </option>
  ))

  return (
    <div className="customer-container">
      <div className="customer-card">
        <div className="customer-content">
          <h2 className="customer-title">Διαχείριση Πελατών</h2>

          <div className="cost-container">
            <div className="cost-box">
              <h3 className="cost-title">Υπολογισμένο Κόστος</h3>
              <div className="cost-value">{calculatedCost} €</div>
            </div>
            <div className="cost-box">
              <h3 className="cost-title">Υπολογισμένο Κόστος + ΦΠΑ</h3>
              <div className="cost-value">{(calculatedCost + calculatedCost * 0.24).toFixed(2)} €</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="customer-form">
            <div className="form-section">
              <h3 className="section-title">Επιλογή Πηγής</h3>
              <select
                className="form-select"
                value={newCustomer.code || ""}
                onChange={(e) => setNewCustomer({ ...newCustomer, code: e.target.value })}
              >
                <option value="">Πηγή</option>
                <option value="166">166</option>
                <option value="153">153</option>
                <option value="011">011</option>
                <option value="1600">1600</option>
              </select>
            </div>

            <div className="counters-section">
              <h3 className="section-title">Στατιστικά Counters</h3>
              <ul className="counters-list">
                <li>166: {counters["166c"] || 0}</li>
                <li>153: {counters["153c"] || 0}</li>
                <li>011: {counters["011c"] || 0}</li>
                <li>1600: {counters["1600c"] || 0}</li>
              </ul>
            </div>

            <div className="form-section">
              <h3 className="section-title">Στοιχεία παραλαβής</h3>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    className="radio-input"
                    value="Από Νοσοκομείο για Σπίτι"
                    checked={transferType === "Από Νοσοκομείο για Σπίτι"}
                    onChange={(e) => setTransferType(e.target.value)}
                  />
                  Από Νοσοκομείο για Σπίτι
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    className="radio-input"
                    value="Από Σπίτι σε Νοσοκομείο/Σπίτι"
                    checked={transferType === "Από Σπίτι σε Νοσοκομείο/Σπίτι"}
                    onChange={(e) => setTransferType(e.target.value)}
                  />
                  Από Σπίτι σε Νοσοκομείο/Σπίτι
                </label>
              </div>
            </div>

            {transferType === "Από Νοσοκομείο για Σπίτι" && (
              <div className="form-section hospital-section">
                <h3 className="section-title">Στοιχεία Νοσοκομείου</h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label className="field-label">Νοσοκομείο</label>
                    <select
                      className="form-select"
                      value={newCustomer.hospital_name || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, hospital_name: e.target.value })}
                    >
                      <option value="">Επιλέξτε Νοσοκομείο</option>
                      <option value="Νοσοκομείο Α">Νοσοκομείο Α</option>
                      <option value="Νοσοκομείο Β">Νοσοκομείο Β</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Κλινική</label>
                    <select
                      className="form-select"
                      value={newCustomer.clinic_name || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, clinic_name: e.target.value })}
                    >
                      <option value="">Επιλέξτε Κλινική</option>
                      <option value="Κλινική Α">Κλινική Α</option>
                      <option value="Κλινική Β">Κλινική Β</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Κτήριο</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Κτήριο"
                      value={newCustomer.building_name || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, building_name: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Όροφος</label>
                    <select
                      className="form-select"
                      value={newCustomer.floor_number || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, floor_number: e.target.value })}
                    >
                      <option value="">Επιλέξτε Όροφο</option>
                      {floorOptions}
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Δωμάτιο</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Δωμάτιο"
                      value={newCustomer.room_number || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, room_number: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Χρήση Οξυγόνου</label>
                    <select
                      className="form-select"
                      value={newCustomer.oxygen_usage === true ? "Ναι" : newCustomer.oxygen_usage === false ? "Όχι" : ""}
                      onChange={(e) => {
                        const boolValue = e.target.value === "Ναι" ? true : e.target.value === "Όχι" ? false : null
                        setNewCustomer({ ...newCustomer, oxygen_usage: boolValue })
                      }}
                    >
                      <option value="">Επιλέξτε</option>
                      <option value="Ναι">Ναι</option>
                      <option value="Όχι">Όχι</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Μέσο Μεταφοράς</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Μέσο Μεταφοράς"
                      value={newCustomer.transport_method || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, transport_method: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {transferType === "Από Σπίτι σε Νοσοκομείο/Σπίτι" && (
              <div className="form-section home-section">
                <h3 className="section-title">Στοιχεία Κατοικίας</h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label className="field-label">Δήμος/Περιοχή/Νομός/Πόλη</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Δήμος/Περιοχή/Νομός/Πόλη"
                      value={newCustomer.citys || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, citys: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Τ/Κ</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Τ/Κ"
                      value={newCustomer.postal_codes || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, postal_codes: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Οδός</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Οδός"
                      value={newCustomer.streets || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, streets: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Αριθμός</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Αριθμός"
                      value={newCustomer.numbers || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, numbers: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Όροφος</label>
                    <select
                      className="form-select"
                      value={newCustomer.floors?.toString() || ""}
                      onChange={(e) =>
                        setNewCustomer({ ...newCustomer, floors: Number.parseInt(e.target.value, 10) || null })
                      }
                    >
                      <option value="">Επιλέξτε Όροφο</option>
                      {floorOptions}
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Κουδούνι</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Κουδούνι"
                      value={newCustomer.doorbells || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, doorbells: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Μέσο Παραλαβής</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Μέσο Παραλαβής"
                      value={newCustomer.transport_methods || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, transport_methods: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Ασανσέρ</label>
                    <select
                      className="form-select"
                      value={newCustomer.has_elevators === true ? "Ναι" : newCustomer.has_elevators === false ? "Όχι" : ""}
                      onChange={(e) => {
                        const boolValue = e.target.value === "Ναι" ? true : e.target.value === "Όχι" ? false : null
                        setNewCustomer({ ...newCustomer, has_elevators: boolValue })
                      }}
                    >
                      <option value="">Επιλέξτε</option>
                      <option value="Ναι">Ναι</option>
                      <option value="Όχι">Όχι</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Χρήση Οξυγόνου</label>
                    <select
                      className="form-select"
                      value={newCustomer.has_o2s === true ? "Ναι" : newCustomer.has_o2s === false ? "Όχι" : ""}
                      onChange={(e) => {
                        const boolValue = e.target.value === "Ναι" ? true : e.target.value === "Όχι" ? false : null
                        setNewCustomer({ ...newCustomer, has_o2s: boolValue })
                      }}
                    >
                      <option value="">Επιλέξτε</option>
                      <option value="Ναι">Ναι</option>
                      <option value="Όχι">Όχι</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="form-section">
              <h3 className="section-title">Στοιχεία Πελάτη</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label className="field-label">Όνομα</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Όνομα"
                    value={newCustomer.first_name || ""}
                    onChange={(e) => setNewCustomer({ ...newCustomer, first_name: e.target.value.trim() })}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Επώνυμο</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Επώνυμο"
                    value={newCustomer.last_name || ""}
                    onChange={(e) => setNewCustomer({ ...newCustomer, last_name: e.target.value.trim() })}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Τηλέφωνο 1</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Τηλέφωνο 1"
                    value={newCustomer.phone_1 || ""}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone_1: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Τηλέφωνο 2</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Τηλέφωνο 2"
                    value={newCustomer.phone_2 || ""}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone_2: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Τηλέφωνο 3</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Τηλέφωνο 3"
                    value={newCustomer.phone_3 || ""}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone_3: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Βάρος</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Βάρος"
                    value={newCustomer.weight || ""}
                    onChange={(e) => setNewCustomer({ ...newCustomer, weight: e.target.value })}
                  />
                </div>

                <div className="form-field wide-field">
                  <label className="field-label">Πληροφορίες</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Πληροφορίες"
                    value={newCustomer.info || ""}
                    onChange={(e) => setNewCustomer({ ...newCustomer, info: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Είδος Συμβάντος/Αιτιολογία</h3>
              <select
                className="form-select"
                value={newCustomer.incident_type || ""}
                onChange={(e) => setNewCustomer({ ...newCustomer, incident_type: e.target.value })}
              >
                <option value="">Επιλέξτε</option>
                <option value="Επείγον">Επείγον</option>
                <option value="Επανεξέταση">Επανεξέταση</option>
                <option value="Χημειοθεραπεία">Χημειοθεραπεία</option>
              </select>
            </div>

            <div className="form-section">
              <h3 className="section-title">Επιλογή Τοποθεσίας</h3>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    className="radio-input"
                    value="Νοσοκομείο"
                    checked={newCustomer.location_type === "Νοσοκομείο"}
                    onChange={(e) => setNewCustomer({ ...newCustomer, location_type: e.target.value })}
                  />
                  Νοσοκομείο
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    className="radio-input"
                    value="Σπίτι"
                    checked={newCustomer.location_type === "Σπίτι"}
                    onChange={(e) => setNewCustomer({ ...newCustomer, location_type: e.target.value })}
                  />
                  Σπίτι
                </label>
              </div>
            </div>

            {newCustomer.location_type === "Νοσοκομείο" && (
              <div className="form-section hospital-section">
                <h3 className="section-title">Στοιχεία Νοσοκομείου</h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label className="field-label">Νοσοκομείο</label>
                    <select
                      className="form-select"
                      value={newCustomer.hospital_name || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, hospital_name: e.target.value })}
                    >
                      <option value="">Επιλέξτε Νοσοκομείο</option>
                      <option value="Νοσοκομείο Α">Νοσοκομείο Α</option>
                      <option value="Νοσοκομείο Β">Νοσοκομείο Β</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Κλινική</label>
                    <select
                      className="form-select"
                      value={newCustomer.clinic_name || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, clinic_name: e.target.value })}
                    >
                      <option value="">Επιλέξτε Κλινική</option>
                      <option value="Κλινική Α">Κλινική Α</option>
                      <option value="Κλινική Β">Κλινική Β</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Κτήριο</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Κτήριο"
                      value={newCustomer.building_name || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, building_name: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Όροφος</label>
                    <select
                      className="form-select"
                      value={newCustomer.floor_number || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, floor_number: e.target.value })}
                    >
                      <option value="">Επιλέξτε Όροφο</option>
                      {floorOptions}
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Δωμάτιο</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Δωμάτιο"
                      value={newCustomer.room_number || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, room_number: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Χρήση Οξυγόνου</label>
                    <select
                      className="form-select"
                      value={newCustomer.oxygen_usage === true ? "Ναι" : newCustomer.oxygen_usage === false ? "Όχι" : ""}
                      onChange={(e) => {
                        const boolValue = e.target.value === "Ναι" ? true : e.target.value === "Όχι" ? false : null
                        setNewCustomer({ ...newCustomer, oxygen_usage: boolValue })
                      }}
                    >
                      <option value="">Επιλέξτε</option>
                      <option value="Ναι">Ναι</option>
                      <option value="Όχι">Όχι</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Μέσο Μεταφοράς</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Μέσο Μεταφοράς"
                      value={newCustomer.transport_method || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, transport_method: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {newCustomer.location_type === "Σπίτι" && (
              <div className="form-section home-section">
                <h3 className="section-title">Στοιχεία Σπιτιού</h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label className="field-label">Δήμος/Περιοχή/Νομός/Πόλη</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Δήμος/Περιοχή/Νομός/Πόλη"
                      value={newCustomer.cityd || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, cityd: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Τ/Κ</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Τ/Κ"
                      value={newCustomer.postal_coded || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, postal_coded: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Οδός</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Οδός"
                      value={newCustomer.streetd || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, streetd: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Αριθμός</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Αριθμός"
                      value={newCustomer.numberd || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, numberd: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Όροφος</label>
                    <select
                      className="form-select"
                      value={newCustomer.floord?.toString() || ""}
                      onChange={(e) =>
                        setNewCustomer({ ...newCustomer, floord: Number.parseInt(e.target.value, 10) || null })
                      }
                    >
                      <option value="">Επιλέξτε Όροφο</option>
                      {floorOptions}
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Κουδούνι</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Κουδούνι"
                      value={newCustomer.doorbelld || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, doorbelld: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Μέσο Μεταφοράς</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Μέσο Μεταφοράς"
                      value={newCustomer.transport_methodd || ""}
                      onChange={(e) => setNewCustomer({ ...newCustomer, transport_methodd: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Ασανσέρ</label>
                    <select
                      className="form-select"
                      value={newCustomer.has_elevatord === true ? "Ναι" : newCustomer.has_elevatord === false ? "Όχι" : ""}
                      onChange={(e) => {
                        const boolValue = e.target.value === "Ναι" ? true : e.target.value === "Όχι" ? false : null
                        setNewCustomer({ ...newCustomer, has_elevatord: boolValue })
                      }}
                    >
                      <option value="">Επιλέξτε</option>
                      <option value="Ναι">Ναι</option>
                      <option value="Όχι">Όχι</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Χρήση Οξυγόνου</label>
                    <select
                      className="form-select"
                      value={newCustomer.has_o2d === true ? "Ναι" : newCustomer.has_o2d === false ? "Όχι" : ""}
                      onChange={(e) => {
                        const boolValue = e.target.value === "Ναι" ? true : e.target.value === "Όχι" ? false : null
                        setNewCustomer({ ...newCustomer, has_o2d: boolValue })
                      }}
                    >
                      <option value="">Επιλέξτε</option>
                      <option value="Ναι">Ναι</option>
                      <option value="Όχι">Όχι</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className="submit-button">
              Αποθήκευση Δεδομένων
            </button>
          </form>
        </div>
      </div>

      {savedCustomer && (
        <div className="saved-customer">
          <div className="saved-content">
            <h3 className="saved-title">Αποθηκευμένα Στοιχεία Πελάτη</h3>
            <div className="saved-grid">
              <div>
                <span className="saved-label">Όνομα:</span> {savedCustomer.first_name}
              </div>
              <div>
                <span className="saved-label">Επώνυμο:</span> {savedCustomer.last_name}
              </div>
              <div>
                <span className="saved-label">Τηλέφωνο 1:</span> {savedCustomer.phone_1}
              </div>
              <div>
                <span className="saved-label">Τηλέφωνο 2:</span> {savedCustomer.phone_2}
              </div>
              <div>
                <span className="saved-label">Τηλέφωνο 3:</span> {savedCustomer.phone_3}
              </div>
              <div>
                <span className="saved-label">Βάρος:</span> {savedCustomer.weight}
              </div>
              <div className="saved-wide">
                <span className="saved-label">Πληροφορίες:</span> {savedCustomer.info}
              </div>
            </div>

            {customerHistory.length > 0 && (
              <div className="history-section">
                <h3 className="history-title">Ιστορικό Πελάτη</h3>
                <div className="history-list">
                  {customerHistory.map((entry, index) => {
                    const formattedDate =
                      entry.event_date && !isNaN(new Date(entry.event_date).getTime())
                        ? new Date(entry.event_date).toLocaleDateString("el-GR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "Μη διαθέσιμη"

                    const formatFloor = (floor) => (floor ? `${floor}ος` : "Μη διαθέσιμο")

                    const formatHospital = (entry) => {
                      return `${entry.hospital_name || "Μη διαθέσιμο"} ${entry.clinic_name || ""} 
                          Κτήριο: ${entry.building_name || "Μη διαθέσιμο"}, 
                          Όροφος: ${formatFloor(entry.floor_number)},
                          Δωμάτιο: ${entry.room_number || "Μη διαθέσιμο"}, 
                          Μέσο μεταφοράς: ${entry.transport_method || "Μη διαθέσιμο"}, 
                          Χρήση οξυγόνου: ${entry.oxygen_usage ? "Ναι" : "Όχι"}`
                    }

                    const startingPoint = entry.starting_city
                      ? `${entry.starting_city}, ${entry.starting_street || ""} ${entry.starting_number || ""},
                          Τ/Κ: ${entry.starting_postal_code || "Μη διαθέσιμο"}, 
                          Όροφος: ${formatFloor(entry.starting_floor)},
                          Ασανσέρ: ${entry.starting_elevator ? "Ναι" : "Όχι"}, 
                          Μέσο μεταφοράς: ${entry.starting_transport_method || "Μη διαθέσιμο"},
                          Χρήση οξυγόνου: ${entry.starting_oxygen_usage ? "Ναι" : "Όχι"}`
                      : formatHospital(entry)

                    const destinationPoint = entry.destination_city
                      ? `${entry.destination_city}, ${entry.destination_street || ""} ${entry.destination_number || ""}, 
                          Τ/Κ: ${entry.destination_postal_code || "Μη διαθέσιμο"},
                          Όροφος: ${formatFloor(entry.destination_floor)}, 
                          Ασανσέρ: ${entry.destination_elevator ? "Ναι" : "Όχι"}, 
                          Μέσο μεταφοράς: ${entry.destination_transport_method || "Μη διαθέσιμο"},
                          Χρήση οξυγόνου: ${entry.destination_oxygen_usage ? "Ναι" : "Όχι"}`
                      : formatHospital(entry)

                    return (
                      <div key={index} className="history-item">
                        <div>
                          <span className="history-label">Ημερομηνία:</span> {formattedDate}
                        </div>
                        <div>
                          <span className="history-label">Αφετηρία:</span> {startingPoint}
                        </div>
                        <div>
                          <span className="history-label">Προορισμός:</span> {destinationPoint}
                        </div>
                        <div>
                          <span className="history-label">Είδος Συμβάντος:</span>{" "}
                          {entry.incident_type || "Μη διαθέσιμο"}
                        </div>
                        <div>
                          <span className="history-label">Κόστος:</span>{" "}
                          {entry.cost ? `${entry.cost} €` : "Μη διαθέσιμο"}
                        </div>
                        <div>
                          <span className="history-label">Χρήση Οξυγόνου:</span>{" "}
                          {entry.oxygen_usage ? "Ναι" : "Όχι"}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerForm