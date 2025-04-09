import React, { useState, useEffect } from "react";

function HospitalDropdown({ newCustomer, setNewCustomer }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false); // Κατάσταση για τη φόρμα προσθήκης
  const [newHospital, setNewHospital] = useState(""); // Νέο νοσοκομείο
  const [successMessage, setSuccessMessage] = useState(""); // Μήνυμα επιτυχίας
  const [isMessageVisible, setIsMessageVisible] = useState(false); // Κατάσταση για fade-out

  // Ανάκτηση δεδομένων από το API
  const fetchHospitals = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/hospitals"); // Το endpoint του backend
      const data = await response.json();
      setHospitals(data.map((hospital) => hospital.name)); // Εξαγωγή μόνο των ονομάτων
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  // Φιλτράρισμα των νοσοκομείων με βάση το search term
  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Αποθήκευση νέου νοσοκομείου στη βάση δεδομένων
  const handleAddHospital = async () => {
    if (!newHospital.trim()) return; // Έλεγχος για κενό πεδίο
    try {
      const response = await fetch("http://localhost:5000/api/hospitals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newHospital }),
      });
      if (response.ok) {
        setNewHospital(""); // Καθαρισμός πεδίου
        setIsAddFormOpen(false); // Κλείσιμο φόρμας
        setSuccessMessage("Το νοσοκομείο προστέθηκε επιτυχώς!"); // Ενημέρωση μηνύματος επιτυχίας
        setIsMessageVisible(true); // Εμφάνιση μηνύματος
        await fetchHospitals(); // Ανανέωση του πίνακα με τα νοσοκομεία
        setSearchTerm(""); // Καθαρισμός του search term για να εμφανιστούν όλα τα νοσοκομεία
        setIsDropdownOpen(true); // Επαναφορά του dropdown για να εμφανιστεί το νέο νοσοκομείο
        setTimeout(() => setIsMessageVisible(false), 3000); // Απόκρυψη μηνύματος μετά από 3 δευτερόλεπτα
      } else {
        console.error("Failed to add hospital");
      }
    } catch (error) {
      console.error("Error adding hospital:", error);
    }
  };

  return (
    <div className="form-field">
      <label className="field-label">Νοσοκομείο</label>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          className="form-input"
          placeholder="Αναζήτηση Νοσοκομείου"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)} // Άνοιγμα dropdown όταν το input έχει focus
        />
        <button
          type="button" // Αποφυγή υποβολής φόρμας
          style={{
            marginLeft: "10px",
            backgroundColor: isAddFormOpen ? "red" : "green", // Αλλαγή χρώματος αν είναι ανοιχτή η φόρμα
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
          }}
          onClick={() => setIsAddFormOpen((prev) => !prev)} // Toggle φόρμας προσθήκης
        >
          {isAddFormOpen ? "-" : "+"} {/* Αλλαγή συμβόλου */}
        </button>
      </div>
      {isDropdownOpen && (
        <select
          className="form-select"
          size={5} // Περιορισμός ύψους με δυνατότητα scroll
          value={newCustomer.hospital_name || ""}
          onChange={(e) => {
            const selectedHospital = e.target.value;
            setNewCustomer({
              ...newCustomer,
              hospital_name: selectedHospital,
            });
            setSearchTerm(selectedHospital); // Ενημέρωση του searchTerm με την επιλογή
            setIsDropdownOpen(false); // Κλείσιμο dropdown μετά την επιλογή
          }}
          onBlur={() => setIsDropdownOpen(false)} // Κλείσιμο dropdown όταν χάνει το focus
          style={{
            overflowY: "auto", // Ενεργοποίηση scroll
            height: "auto", // Αυτόματο ύψος
          }}
        >
          {filteredHospitals.map((hospital, index) => (
            <option key={index} value={hospital}>
              {hospital}
            </option>
          ))}
        </select>
      )}
      {isAddFormOpen && (
        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            className="form-input"
            placeholder="Προσθήκη Νοσοκομείου"
            value={newHospital}
            onChange={(e) => setNewHospital(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <button
            type="button" // Αποφυγή υποβολής φόρμας
            style={{
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
            }}
            onClick={handleAddHospital} // Αποθήκευση νέου νοσοκομείου
          >
            Αποθήκευση
          </button>
        </div>
      )}
      {successMessage && (
        <div
          style={{
            marginTop: "10px",
            color: "green",
            fontWeight: "bold",
            opacity: isMessageVisible ? 1 : 0, // Εφέ fade-out
            transition: "opacity 0.5s ease-in-out", // Ομαλή μετάβαση
            display: isMessageVisible ? "block" : "none", // Απόκρυψη όταν δεν είναι ορατό
          }}
        >
          {successMessage}
        </div>
      )}
    </div>
  );
}

export default HospitalDropdown;
