"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./CustomerForm.css";
import CountersHistory from "./CountersHistory";
import ClinicDropdown from "./ClinicDropdown";
import HospitalDropdown from "./HospitalDropdown";
const fieldLabels = {
  first_name: "Όνομα",
  last_name: "Επώνυμο",
  phone_1: "Τηλέφωνο 1",
  phone_2: "Τηλέφωνο 2",
  phone_3: "Τηλέφωνο 3",
  info: "Πληροφορίες",
  weight: "Βάρος",
  // Προσθέστε και άλλα πεδία αν χρειάζεται
};
const initialCustomerState = {
  first_name: "",
  last_name: "",
  phone_1: "",
  phone_2: "",
  phone_3: "",
  weight: "",
  info: "",
  code: "",
  hospital_name: "",
  clinic_name: "",
  building_name: "",
  floor_number: "",
  room_number: "",
  oxygen_usage: null,
  transport_method: "",
  citys: "",
  postal_codes: "",
  streets: "",
  numbers: "",
  floors: null,
  doorbells: "",
  has_elevators: null,
  has_o2s: null,
  cityd: "",
  postal_coded: "",
  streetd: "",
  numberd: "",
  floord: null,
  doorbelld: "",
  has_elevatord: null,
  has_o2d: null,
  transport_methodd: "",
  incident_type: "",
  location_type: "",
};
// Δημιουργούμε ένα ξεχωριστό component για κάθε στοιχείο του ιστορικού
function HistoryItem({ entry }) {
  const [showDetails, setShowDetails] = useState(false);

  const formattedDate =
    entry.event_date && !isNaN(new Date(entry.event_date).getTime())
      ? new Date(entry.event_date).toLocaleDateString("el-GR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "Μη διαθέσιμη";

  const formatHospitalDetails = (entry) => (
    <>
      <div>
        <span className="history-label" style={{ fontWeight: "bold" }}>
          Νοσοκομείο:
        </span>{" "}
        <span>{entry.hospital_name || "Μη διαθέσιμο"}</span>
      </div>
      <div>
        <span className="history-label" style={{ fontWeight: "bold" }}>
          Clinic
        </span>{" "}
        <span>{entry.clinic_name || "Μη διαθέσιμο"}</span>
      </div>
      <div>
        <span className="history-label" style={{ fontWeight: "bold" }}>
         Building
        </span>{" "}
        <span>{entry.building_name || "Μη διαθέσιμο"}</span>
      </div>
      <div>
        <span className="history-label" style={{ fontWeight: "bold" }}>
          Floor
        </span>{" "}
        <span>
          {entry.floor_number ? `${entry.floor_number}ος` : "Μη διαθέσιμο"}
        </span>
      </div>
      <div>
        <span className="history-label" style={{ fontWeight: "bold" }}>
          Room
        </span>{" "}
        <span>{entry.room_number || "Μη διαθέσιμο"}</span>
      </div>
      <div>
        <span className="history-label" style={{ fontWeight: "bold" }}>
          O2
        </span>{" "}
        <span>{Number(entry.oxygen_usage) === 1 ? "Ναι" : "Όχι"}</span>
      </div>
      <div>
        <span className="history-label" style={{ fontWeight: "bold" }}>
        assistive mobility devices
        </span>{" "}
        <span>{entry.transport_method || "Μη διαθέσιμο"}</span>
      </div>
    </>
  );

  const startingPoint =
    entry.is_starting_point === 1 ? (
      formatHospitalDetails(entry)
    ) : entry.is_starting_point === 0 || entry.is_starting_point == null ? (
      <>
        <div>
          <span className="history-label" style={{ fontWeight: "bold" }}>
            City
          </span>{" "}
          <span>{entry.starting_city || "Μη διαθέσιμο"}</span>
        </div>
        <div>
          <span className="history-label" style={{ fontWeight: "bold" }}>
            Address
          </span>{" "}
          <span>{entry.starting_street || "Μη διαθέσιμο"}</span>
        </div>
        <div>
          <span className="history-label" style={{ fontWeight: "bold" }}>
            Number
          </span>{" "}
          <span>{entry.starting_number || "Μη διαθέσιμο"}</span>
        </div>
        <div>
          <span className="history-label" style={{ fontWeight: "bold" }}>
            Postal code
          </span>{" "}
          <span>{entry.starting_postal_code || "Μη διαθέσιμο"}</span>
        </div>
        <div>
          <span className="history-label" style={{ fontWeight: "bold" }}>
            Floor
          </span>{" "}
          <span>
            {entry.starting_floor
              ? `${entry.starting_floor}ος`
              : "Μη διαθέσιμο"}
          </span>
        </div>
        <div>
          <span className="history-label" style={{ fontWeight: "bold" }}>
            Lift
          </span>{" "}
          <span>{Number(entry.starting_elevator) === 1 ? "Ναι" : "Όχι"}</span>
        </div>
        <div>
          <span className="history-label" style={{ fontWeight: "bold" }}>
          assistive mobility devices
          </span>{" "}
          <span>{entry.starting_transport_method || "Μη διαθέσιμο"}</span>
        </div>
        <div>
          <span className="history-label" style={{ fontWeight: "bold" }}>
            O2:
          </span>{" "}
          <span>
            {parseInt(entry.starting_oxygen_usage, 10) === 1 ? "Ναι" : "Όχι"}
          </span>
        </div>
      </>
    ) : (
      <span>Μη διαθέσιμα δεδομένα για την αφετηρία</span>
    );

  const destinationPoint =
    entry.is_starting_point === 0 ? (
      formatHospitalDetails(entry)
    ) : entry.is_starting_point === 1 || entry.is_starting_point == null ? (
      <>
        <div>
          <span className="history-label" style={{ fontWeight: "bold" }}>
            City
          </span>{" "}
          <span>{entry.destination_city || "Μη διαθέσιμο"}</span>
        </div>
        <div>
          <span className="history-label" style={{ fontWeight: "bold" }}>
            Address
          </span>{" "}
          <span>{entry.destination_street || "Μη διαθέσιμο"}</span>
        </div>
        <div>
          <span className="history-label" style={{ fontWeight: "bold" }}>
            Number
          </span>{" "}
          <span>{entry.destination_number || "Μη διαθέσιμο"}</span>
        </div>
        <div>
          <span className="history-label" style={{ fontWeight: "bold" }}>
            Τ/Κ:
          </span>{" "}
          <span>{entry.destination_postal_code || "Μη διαθέσιμο"}</span>
        </div>
        <div>
          <span className="history-label" style={{ fontWeight: "bold" }}>
            Floor
          </span>{" "}
          <span>
            {entry.destination_floor
              ? `${entry.destination_floor}ος`
              : "Μη διαθέσιμο"}
          </span>
        </div>
        <div>
          <span className="history-label" style={{ fontWeight: "bold" }}>
            Lift
          </span>{" "}
          <span>
            {Number(entry.destination_elevator) === 1 ? "Ναι" : "Όχι"}
          </span>
        </div>
        <div>
          <span className="history-label" style={{ fontWeight: "bold" }}>
          assistive mobility devices
          </span>{" "}
          <span>{entry.destination_transport_method || "Μη διαθέσιμο"}</span>
        </div>
        <div>
          <span className="history-label" style={{ fontWeight: "bold" }}>
            O2
          </span>{" "}
          <span>
            {parseInt(entry.destination_oxygen_usage, 10) === 1 ? "Ναι" : "Όχι"}
          </span>
        </div>
      </>
    ) : (
      <span>Μη διαθέσιμα δεδομένα για την αφετηρία</span>
    );

  return (
    <div className="history-item">
      <div>
        <span className="history-label" style={{ fontWeight: "bold" }}>
          Date
        </span>{" "}
        <span>{formattedDate}</span>
      </div>
      <div>
        <span className="history-label" style={{ fontWeight: "bold" }}>
          Starting point
        </span>{" "}
        {!showDetails && (
          <span>
            {entry.is_starting_point
              ? entry.hospital_name
              : entry.starting_city || "Μη διαθέσιμο"}
          </span>
        )}
        {showDetails && <div className="history-details">{startingPoint}</div>}
      </div>
      <div>
        <span className="history-label" style={{ fontWeight: "bold" }}>
          Destination
        </span>{" "}
        {!showDetails && (
          <span>
            {entry.is_starting_point === 0
              ? entry.hospital_name || "Μη διαθέσιμο"
              : entry.is_starting_point === 1 || entry.is_starting_point == null
                ? entry.destination_city || "Μη διαθέσιμο"
                : "Μη διαθέσιμα δεδομένα"}
          </span>
        )}
        {showDetails && (
          <div className="history-details">{destinationPoint}</div>
        )}
      </div>
      <div>
        <span className="history-label" style={{ fontWeight: "bold" }}>
          Incident type
        </span>{" "}
        <span>{entry.incident_type || "Μη διαθέσιμο"}</span>
      </div>
      <div>
        <span className="history-label" style={{ fontWeight: "bold" }}>
          Cost
        </span>{" "}
        <span>{entry.cost ? `${entry.cost} €` : "Μη διαθέσιμο"}</span>
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        style={{
          marginTop: "10px",
          padding: "5px 10px",
          fontSize: "12px",
        }}
      >
        {showDetails ? "Less" : "More"}
      </button>
    </div>
  );
}
function CustomerForm({
  newCustomer,
  setNewCustomer,
  transferType,
  setTransferType,
  addCustomer,
}) {
  const [counters, setCounters] = useState({});
  const [calculatedCost, setCalculatedCost] = useState(0);
  const [savedCustomer, setSavedCustomer] = useState(null);
  const [customerHistory, setCustomerHistory] = useState([]);
  const [editingField, setEditingField] = useState(null); // Το πεδίο που επεξεργαζόμαστε
  const [editedValue, setEditedValue] = useState(""); // Η νέα τιμή του πεδίου
  const [additionalCost, setAdditionalCost] = useState(0);
  const customerDetailsRef = useRef(null);
  const fetchCounters = () => {
    fetch("http://localhost:5000/api/counters")
      .then((response) => response.json())
      .then((data) => setCounters(data))
      .catch((error) => console.error("Error fetching counters:", error));
  };
  const scrollToCustomerDetails = () => {
    if (customerDetailsRef.current) {
      customerDetailsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center", // Τοποθετεί το στοιχείο στο κέντρο της οθόνης
      });
    }
  };
  const fetchCustomerHistory = async (customerId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/customer-history/${customerId}`,
      );

      if (response.data) {
        setCustomerHistory(response.data);
      }
    } catch (err) {
      console.error("Error fetching customer history:", err);
    }
  };
  useEffect(() => {}, [customerHistory]);
  useEffect(() => {}, [customerHistory]);
  const updateCustomer = async (field, value) => {
    try {
      // Κλήση API για ενημέρωση στη βάση δεδομένων
      const response = await axios.put(
        `http://localhost:5000/api/customer/${savedCustomer.id}`,
        {
          [field]: value,
        },
      );

      if (response.status === 200) {
        // Ενημέρωση του τοπικού state με τη νέα τιμή
        setSavedCustomer((prev) => ({ ...prev, [field]: value }));
        setEditingField(null);
      } else {
        alert("Η ενημέρωση απέτυχε. Παρακαλώ δοκιμάστε ξανά.");
      }
    } catch (error) {
      console.error("Σφάλμα κατά την ενημέρωση του πελάτη:", error);
      alert("Σφάλμα κατά την ενημέρωση. Παρακαλώ δοκιμάστε ξανά.");
    }
  };
  const handleSearchSubmit = async (searchCriteria) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/customers`, {
        params: searchCriteria,
      });
      if (
        response.data &&
        response.data.customers &&
        response.data.customers.length > 0
      ) {
        setSavedCustomer(response.data.customers[0]); // Αποθήκευση του πρώτου πελάτη που βρέθηκε
        fetchCustomerHistory(response.data.customers[0].id); // Ανάκτηση ιστορικού
      } else {
        alert("No customer found");
      }
    } catch (err) {
      console.error("Error searching for customer:", err);
    }
  };
  useEffect(() => {
    fetchCounters();
  }, []);
  useEffect(() => {
    // Κάθε φορά που το `savedCustomer` αλλάζει, μετακινούμαστε στο στοιχείο
    if (savedCustomer) {
      scrollToCustomerDetails();
    }
  }, [savedCustomer]);
  useEffect(() => {
    const baseCost = 0;
    const floorCost =
      (5 * newCustomer.floors || 0) * (newCustomer.has_elevators ? 0 : 1);
    const floordCost =
      (5 * newCustomer.floord || 0) * (newCustomer.has_elevatord ? 0 : 1);
    const totalCost = baseCost + floorCost + floordCost + additionalCost;
    setCalculatedCost(totalCost);
  }, [
    newCustomer.floors,
    newCustomer.floord,
    newCustomer.has_elevators,
    newCustomer.has_elevatord,
    additionalCost,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Ελέγξτε αν ο πελάτης υπάρχει ήδη στη βάση
      const response = await axios.get(`http://localhost:5000/api/customers`, {
        params: {
          firstName: newCustomer.first_name,
          lastName: newCustomer.last_name,
        },
      });

      let updatedInfo = newCustomer.info; // Ξεκινάμε με το νέο info
      let totalCost = calculatedCost + additionalCost;
      if (
        response.data &&
        response.data.customers &&
        response.data.customers.length > 0
      ) {
        // Ο πελάτης υπάρχει ήδη
        const existingCustomer = response.data.customers[0];
        setSavedCustomer(existingCustomer); // Αποθήκευση του υπάρχοντος πελάτη στο state
        fetchCustomerHistory(existingCustomer.id); // Ανάκτηση ιστορικού πελάτη

        // Συνένωση του υπάρχοντος info με το νέο
        updatedInfo = existingCustomer.info
          ? `${existingCustomer.info}, ${newCustomer.info}`
          : newCustomer.info;
      }

      const isStartingPoint = transferType === "Από Νοσοκομείο για Σπίτι";

      const updatedCustomer = {
        ...newCustomer,
        info: updatedInfo, // Χρησιμοποιούμε το ενημερωμένο info
        is_starting_point: isStartingPoint,
        cost: totalCost, // Προσθήκη συνολικού κόστους
        additionalCost, // Προσθήκη του πρόσθετου κόστους
      };
      console.log("Updated Customer:", updatedCustomer);
      // Αποθήκευση του πελάτη
      addCustomer(updatedCustomer, (response) => {
        if (response && response.counters) {
          setCounters(response.counters);
        }
        setSavedCustomer(updatedCustomer); // Ενημέρωση του savedCustomer
        if (response && response.customerId) {
          fetchCustomerHistory(response.customerId);
        }
        fetchCounters();
        scrollToCustomerDetails();
        setNewCustomer(initialCustomerState);
        setAdditionalCost(0); // Επαναφορά του πρόσθετου κόστους
      });
    } catch (err) {
      console.error("Error fetching existing customer info:", err);
    }
  };

  const floorOptions = Array.from({ length: 11 }, (_, i) => (
    <option key={i} value={i.toString()}>
      {i}
    </option>
  ));

  return (
    <div className="customer-container">
      <div className="counters-and-search">
        <div className="counters-container">
          <div className="counters-grid">
            <div className="counter-box">
              <h4 className="counter-title">166</h4>
              <p className="counter-value">{counters["166c"] || 0}</p>
            </div>
            <div className="counter-box">
              <h4 className="counter-title">153</h4>
              <p className="counter-value">{counters["153c"] || 0}</p>
            </div>
            <div className="counter-box">
              <h4 className="counter-title">011</h4>
              <p className="counter-value">{counters["011c"] || 0}</p>
            </div>
            <div className="counter-box">
              <h4 className="counter-title">1600</h4>
              <p className="counter-value">{counters["1600c"] || 0}</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchSubmit({
              phoneNumber: newCustomer.phone_1,
              firstName: newCustomer.first_name,
              lastName: newCustomer.last_name,
            });
          }}
          className="search-form"
        >
          <p>Enter phone number or first and last name</p>
          <div className="input-group">
            <input
              type="text"
              placeholder="Όνομα"
              value={newCustomer.first_name || ""}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  first_name: e.target.value.trim(),
                })
              }
            />
            <input
              type="text"
              placeholder="Επώνυμο"
              value={newCustomer.last_name || ""}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  last_name: e.target.value.trim(),
                })
              }
            />
            <input
              type="text"
              placeholder="Τηλέφωνο"
              value={newCustomer.phone_1 || ""}
              maxLength={10}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  phone_1: e.target.value.trim(),
                })
              }
            />
            <button type="submit">Search</button>
          </div>
        </form>
      </div>
      <div className="customer-card">
        <div className="customer-content">
          <form onSubmit={handleSubmit} className="main-grid">
            {/* Πρώτο τεταρτημόριο (πάνω και κάτω αριστερά) */}
            <div className="left-section">
              <div className="form-section">
                <h3 className="section-title">Source</h3>
                <select
                  className="form-select"
                  value={newCustomer.code || ""}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, code: e.target.value })
                  }
                >
                  <option value="">Source</option>
                  <option value="166">166</option>
                  <option value="153">153</option>
                  <option value="011">011</option>
                  <option value="1600">1600</option>
                </select>
              </div>
              <div className="form-section">
                <h3 className="section-title">Starting point</h3>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      className="radio-input"
                      value="Από Νοσοκομείο για Σπίτι"
                      checked={transferType === "Από Νοσοκομείο για Σπίτι"}
                      onChange={(e) => setTransferType(e.target.value)}
                    />
                    Hospital
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      className="radio-input"
                      value="Από Σπίτι σε Νοσοκομείο/Σπίτι"
                      checked={transferType === "Από Σπίτι σε Νοσοκομείο/Σπίτι"}
                      onChange={(e) => setTransferType(e.target.value)}
                    />
                    House
                  </label>
                </div>
              </div>
              <div className="form-section">
                {transferType === "Από Νοσοκομείο για Σπίτι" && (
                  <div className="form-section hospital-section">
                    <h3 className="section-title">Hospital details</h3>
                    <div className="form-grid">
                      <div className="form-field">
                        <HospitalDropdown
                          newCustomer={newCustomer}
                          setNewCustomer={setNewCustomer}
                        />
                      </div>

                      <div className="form-field">
                        <ClinicDropdown
                          newCustomer={newCustomer}
                          setNewCustomer={setNewCustomer}
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">Building</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Κτήριο"
                          value={newCustomer.building_name || ""}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              building_name: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">Floor</label>
                        <select
                          className="form-select"
                          value={newCustomer.floor_number || ""}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              floor_number: e.target.value,
                            })
                          }
                        >
                          <option value="">Choose floor</option>
                          {floorOptions}
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="field-label">Room</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Δωμάτιο"
                          value={newCustomer.room_number || ""}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              room_number: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">O2</label>
                        <select
                          className="form-select"
                          value={
                            newCustomer.oxygen_usage === true
                              ? "Ναι"
                              : newCustomer.oxygen_usage === false
                                ? "Όχι"
                                : ""
                          }
                          onChange={(e) => {
                            const boolValue =
                              e.target.value === "Ναι"
                                ? true
                                : e.target.value === "Όχι"
                                  ? false
                                  : null;
                            setNewCustomer({
                              ...newCustomer,
                              oxygen_usage: boolValue,
                            });
                          }}
                        >
                          <option value="">Choose</option>
                          <option value="Ναι">Yes</option>
                          <option value="Όχι">No</option>
                        </select>
                      </div>

                      <div className="form-field">
                      <label className="field-label">assistive mobility devices</label>
                        <select
                          className="form-select"
                          value={newCustomer.transport_method || ""}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              transport_method: e.target.value,
                            })
                          }
                        >
                          <option value="">Choose assistive mobility device</option>
                          <option value="Φορείο">Stretcher</option>
                          <option value="Καρέκλα">Wheelchair</option>
                          <option value="Scoop">Scoop</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {transferType === "Από Σπίτι σε Νοσοκομείο/Σπίτι" && (
                  <div className="form-section home-section">
                    <h3 className="section-title">Home detaisl</h3>
                    <div className="form-grid">
                      <div className="form-field">
                        <label className="field-label">City</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Νομός/Δήμος/Πόλη"
                          value={newCustomer.citys || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^[Α-Ωα-ωΆ-Ώά-ώA-Za-z\s]*$/.test(value)) {
                              // Επιτρέπει μόνο χαρακτήρες και κενά
                              setNewCustomer({ ...newCustomer, citys: value });
                            }
                          }}
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">Postal code</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Τ/Κ"
                          value={newCustomer.postal_codes || ""}
                          maxLength={5}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              // Επιτρέπει μόνο αριθμούς
                              setNewCustomer({
                                ...newCustomer,
                                postal_codes: value,
                              });
                            }
                          }}
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">Address</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Οδός"
                          value={newCustomer.streets || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^[Α-Ωα-ωΆ-Ώά-ώA-Za-z\s]*$/.test(value)) {
                              // Επιτρέπει μόνο χαρακτήρες και κενά
                              setNewCustomer({
                                ...newCustomer,
                                streets: value,
                              });
                            }
                          }}
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">Number</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Αριθμός"
                          value={newCustomer.numbers || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              // Επιτρέπει μόνο αριθμούς
                              setNewCustomer({
                                ...newCustomer,
                                numbers: value,
                              });
                            }
                          }}
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">Floor</label>
                        <select
                          className="form-select"
                          value={newCustomer.floors?.toString() || ""}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              floors:
                                Number.parseInt(e.target.value, 10) || null,
                            })
                          }
                        >
                          <option value="">Choose floor</option>
                          {floorOptions}
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="field-label">Doorbell</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Κουδούνι"
                          value={newCustomer.doorbells || ""}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              doorbells: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="form-field">
                      <label className="field-label">assistive mobility devices</label>
                        <select
                          className="form-select"
                          value={newCustomer.transport_methods || ""}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              transport_methods: e.target.value,
                            })
                          }
                        >
                           <option value="">Choose assistive mobility device</option>
                          <option value="Φορείο">Stretcher</option>
                          <option value="Καρέκλα">Wheelchair</option>
                          <option value="Scoop">Scoop</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="field-label">Lift</label>
                        <select
                          className="form-select"
                          value={
                            newCustomer.has_elevators === true
                              ? "Ναι"
                              : newCustomer.has_elevators === false
                                ? "Όχι"
                                : ""
                          }
                          onChange={(e) => {
                            const boolValue =
                              e.target.value === "Ναι"
                                ? true
                                : e.target.value === "Όχι"
                                  ? false
                                  : null;
                            setNewCustomer({
                              ...newCustomer,
                              has_elevators: boolValue,
                            });
                          }}
                        >
                          <option value="">Choose</option>
                          <option value="Ναι">yes</option>
                          <option value="Όχι">no</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="field-label">O2</label>
                        <select
                          className="form-select"
                          value={
                            newCustomer.has_o2s === true
                              ? "Ναι"
                              : newCustomer.has_o2s === false
                                ? "Όχι"
                                : ""
                          }
                          onChange={(e) => {
                            const boolValue =
                              e.target.value === "Ναι"
                                ? true
                                : e.target.value === "Όχι"
                                  ? false
                                  : null;
                            setNewCustomer({
                              ...newCustomer,
                              has_o2s: boolValue,
                            });
                          }}
                        >
                          <option value="">Choose</option>
                          <option value="Ναι">yes</option>
                          <option value="Όχι">no</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-section">
                <h3 className="section-title">Customer details</h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label className="field-label">First name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Όνομα"
                      value={newCustomer.first_name || ""}
                      onChange={(e) => {
                        const value = e.target.value.trim();
                        if (/^[Α-Ωα-ωΆ-Ώά-ώA-Za-z\s]*$/.test(value)) {
                          // Επιτρέπει μόνο χαρακτήρες και κενά
                          setNewCustomer({ ...newCustomer, first_name: value });
                        }
                      }}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Last name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Επώνυμο"
                      value={newCustomer.last_name || ""}
                      onChange={(e) => {
                        const value = e.target.value.trim();
                        if (/^[Α-Ωα-ωΆ-Ώά-ώA-Za-z\s]*$/.test(value)) {
                          // Επιτρέπει μόνο χαρακτήρες και κενά
                          setNewCustomer({ ...newCustomer, last_name: value });
                        }
                      }}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Phone 1</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Τηλέφωνο 1"
                      value={newCustomer.phone_1 || ""}
                      maxLength={10}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          // Επιτρέπει μόνο αριθμούς
                          setNewCustomer({ ...newCustomer, phone_1: value });
                        }
                      }}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Phone 2</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Τηλέφωνο 2"
                      value={newCustomer.phone_2 || ""}
                      maxLength={10}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          // Επιτρέπει μόνο αριθμούς
                          setNewCustomer({ ...newCustomer, phone_2: value });
                        }
                      }}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Phone 3</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Τηλέφωνο 3"
                      value={newCustomer.phone_3 || ""}
                      maxLength={10}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          // Επιτρέπει μόνο αριθμούς
                          setNewCustomer({ ...newCustomer, phone_3: value });
                        }
                      }}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Weight</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Βάρος"
                      value={newCustomer.weight || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          // Επιτρέπει μόνο αριθμούς
                          setNewCustomer({ ...newCustomer, weight: value });
                        }
                      }}
                    />
                  </div>

                  <div className="form-field wide-field">
                    <label className="field-label">Info</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Πληροφορίες"
                      value={newCustomer.info || ""}
                      onChange={(e) =>
                        setNewCustomer({ ...newCustomer, info: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
              <h3 className="section-title">Incident Type/Reason</h3>
                <select
                  className="form-select"
                  value={newCustomer.incident_type || ""}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      incident_type: e.target.value,
                    })
                  }
                >
                 <option value="">Choose</option>
<option value="Emergency">Emergency</option>
<option value="Follow-up">Follow-up</option>
<option value="Dialysis/Transfusion">Dialysis/Transfusion</option>
<option value="CT/MRI">CT/MRI</option>
<option value="Petscan">Petscan</option>
<option value="Discharge">Discharge</option>
<option value="Emergency">Emergency</option>
<option value="Return Home">Return Home</option>
<option value="Covid">Covid</option>
<option value="Admission">Admission</option>
                </select>
              </div>
            </div>

            {/* Δεύτερο τεταρτημόριο (πάνω δεξιά) */}
            <div className="top-right-section">
              <div className="cost-container">
                <div className="cost-box">
                  <label className="cost-title" htmlFor="additional-cost-input">
                    Cost
                  </label>
                  <input
                    id="additional-cost-input"
                    type="text"
                    value={additionalCost}
                    onChange={(e) => setAdditionalCost(Number(e.target.value))}
                    placeholder="cost"
                    style={{
                      marginLeft: "10px",
                      padding: "5px",
                      width: "100px",
                    }}
                  />
                </div>
                <div className="cost-box">
                  <h3 className="cost-title">calculated cost</h3>
                  <div className="cost-value">{calculatedCost} €</div>
                </div>
              </div>
            </div>

            {/* Τρίτο τεταρτημόριο (κάτω δεξιά) */}
            <div className="bottom-right-section">
              <div className="form-section">
                <h3 className="section-title">Destination</h3>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      className="radio-input"
                      value="Νοσοκομείο"
                      checked={newCustomer.location_type === "Νοσοκομείο"}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          location_type: e.target.value,
                        })
                      }
                    />
                    Hospital
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      className="radio-input"
                      value="Σπίτι"
                      checked={newCustomer.location_type === "Σπίτι"}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          location_type: e.target.value,
                        })
                      }
                    />
                    House
                  </label>
                </div>
                {newCustomer.location_type === "Νοσοκομείο" && (
                  <div className="form-section hospital-section">
                    <h3 className="section-title">Hospital details</h3>
                    <div className="form-grid">
                      <div className="form-field">
                        <HospitalDropdown
                          newCustomer={newCustomer}
                          setNewCustomer={setNewCustomer}
                        />
                      </div>

                      <div className="form-field">
                        <ClinicDropdown
                          newCustomer={newCustomer}
                          setNewCustomer={setNewCustomer}
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">Building</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Κτήριο"
                          value={newCustomer.building_name || ""}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              building_name: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">Floor</label>
                        <select
                          className="form-select"
                          value={newCustomer.floor_number || ""}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              floor_number: e.target.value,
                            })
                          }
                        >
                          <option value="">Choose floor</option>
                          {floorOptions}
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="field-label">Room</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Δωμάτιο"
                          value={newCustomer.room_number || ""}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              room_number: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">O2</label>
                        <select
                          className="form-select"
                          value={
                            newCustomer.oxygen_usage === true
                              ? "Ναι"
                              : newCustomer.oxygen_usage === false
                                ? "Όχι"
                                : ""
                          }
                          onChange={(e) => {
                            const boolValue =
                              e.target.value === "Ναι"
                                ? true
                                : e.target.value === "Όχι"
                                  ? false
                                  : null;
                            setNewCustomer({
                              ...newCustomer,
                              oxygen_usage: boolValue,
                            });
                          }}
                        >
                          <option value="">Choose</option>
                          <option value="Ναι">Yes</option>
                          <option value="Όχι">No</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="field-label">assistive mobility devices</label>
                        <select
                          className="form-select"
                          value={newCustomer.transport_method || ""}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              transport_method: e.target.value,
                            })
                          }
                        >
                          <option value="">Choose assistive mobility device</option>
                          <option value="Φορείο">Stretcher</option>
                          <option value="Καρέκλα">Wheelchair</option>
                          <option value="Scoop">Scoop</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                {newCustomer.location_type === "Σπίτι" && (
                  <div className="form-section home-section">
                    <h3 className="section-title">Home details</h3>
                    <div className="form-grid">
                      <div className="form-field">
                        <label className="field-label">City</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Νομός/Δήμος/Πόλη"
                          value={newCustomer.cityd || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^[Α-Ωα-ωΆ-Ώά-ώA-Za-z\s]*$/.test(value)) {
                              // Επιτρέπει μόνο χαρακτήρες και κενά
                              setNewCustomer({ ...newCustomer, cityd: value });
                            }
                          }}
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">Postal code</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Τ/Κ"
                          value={newCustomer.postal_coded || ""}
                          maxLength={5}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              // Επιτρέπει μόνο αριθμούς
                              setNewCustomer({
                                ...newCustomer,
                                postal_coded: value,
                              });
                            }
                          }}
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">Address</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Οδός"
                          value={newCustomer.streetd || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^[Α-Ωα-ωΆ-Ώά-ώA-Za-z\s]*$/.test(value)) {
                              // Επιτρέπει μόνο χαρακτήρες και κενά
                              setNewCustomer({
                                ...newCustomer,
                                streetd: value,
                              });
                            }
                          }}
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">Number</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Αριθμός"
                          value={newCustomer.numberd || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              // Επιτρέπει μόνο αριθμούς
                              setNewCustomer({
                                ...newCustomer,
                                numberd: value,
                              });
                            }
                          }}
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">Floor</label>
                        <select
                          className="form-select"
                          value={newCustomer.floord?.toString() || ""}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              floord:
                                Number.parseInt(e.target.value, 10) || null,
                            })
                          }
                        >
                          <option value="">Choose floor</option>
                          {floorOptions}
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="field-label">Doorbell</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Κουδούνι"
                          value={newCustomer.doorbelld || ""}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              doorbelld: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">assistive mobility device</label>
                        <select
                          className="form-select"
                          value={newCustomer.transport_methodd || ""}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              transport_methodd: e.target.value,
                            })
                          }
                        >
                          <option value="">Choose assistive mobility device</option>
                          <option value="Φορείο">Stretcher</option>
                          <option value="Καρέκλα">Wheelchair</option>
                          <option value="Scoop">Scoop</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="field-label">Lift</label>
                        <select
                          className="form-select"
                          value={
                            newCustomer.has_elevatord === true
                              ? "Ναι"
                              : newCustomer.has_elevatord === false
                                ? "Όχι"
                                : ""
                          }
                          onChange={(e) => {
                            const boolValue =
                              e.target.value === "Ναι"
                                ? true
                                : e.target.value === "Όχι"
                                  ? false
                                  : null;
                            setNewCustomer({
                              ...newCustomer,
                              has_elevatord: boolValue,
                            });
                          }}
                        >
                          <option value="">Choose</option>
                          <option value="Ναι">Yes</option>
                          <option value="Όχι">No</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="field-label">O2</label>
                        <select
                          className="form-select"
                          value={
                            newCustomer.has_o2d === true
                              ? "Ναι"
                              : newCustomer.has_o2d === false
                                ? "Όχι"
                                : ""
                          }
                          onChange={(e) => {
                            const boolValue =
                              e.target.value === "Ναι"
                                ? true
                                : e.target.value === "Όχι"
                                  ? false
                                  : null;
                            setNewCustomer({
                              ...newCustomer,
                              has_o2d: boolValue,
                            });
                          }}
                        >
                          <option value="">Choose</option>
                          <option value="Ναι">Yes</option>
                          <option value="Όχι">No</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="submit-button">
              Form Submit
            </button>
          </form>
        </div>
      </div>
      {savedCustomer && (
        <div ref={customerDetailsRef} className="saved-customer">
          <div className="saved-content">
            <h3 className="saved-title">Retrieved customer details</h3>
            <div className="table">
              {[
                "first_name",
                "last_name",
                "phone_1",
                "phone_2",
                "phone_3",
                "weight",
                "info",
              ].map((field) => (
                <div key={field} className="table-row">
                  <div className="table-cell">
                    {fieldLabels[field] || field}
                  </div>
                  <div className="table-cell">
                    {editingField === field ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          updateCustomer(field, editedValue);
                        }}
                        style={{ display: "inline" }}
                      >
                        <input
                          type="text"
                          value={editedValue}
                          onChange={(e) =>
                            setEditedValue(e.target.value.trim())
                          }
                          style={{ padding: "5px", width: "150px" }}
                        />
                      </form>
                    ) : (
                      <span>{savedCustomer[field] || "Edit"}</span>
                    )}
                  </div>
                  <div className="table-cell">
                    {editingField === field ? (
                      <>
                        <button
                          type="submit"
                          onClick={(e) => {
                            e.preventDefault();
                            updateCustomer(field, editedValue);
                          }}
                          style={{
                            marginLeft: "5px",
                            padding: "5px 10px",
                            fontSize: "12px",
                          }}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingField(null)}
                          style={{
                            marginLeft: "5px",
                            padding: "5px 10px",
                            fontSize: "12px",
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingField(field);
                          setEditedValue(savedCustomer[field] || "");
                        }}
                        style={{
                          marginLeft: "10px",
                          padding: "5px 10px",
                          fontSize: "12px",
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {customerHistory.length > 0 && (
              <div className="history-section">
                <h3 className="history-title">Customer history</h3>
                <div className="history-list">
                  {customerHistory.map((entry, index) => (
                    <HistoryItem key={index} entry={entry} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerForm;
