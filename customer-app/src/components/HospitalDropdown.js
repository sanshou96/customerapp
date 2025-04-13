import React, { useState, useEffect } from "react";

function HospitalDropdown({ newCustomer, setNewCustomer }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newHospital, setNewHospital] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [hoveredHospital, setHoveredHospital] = useState(null); // Κατάσταση για το hovered hospital

  // Ανάκτηση δεδομένων από το API
  const fetchHospitals = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/hospitals");
      const data = await response.json();
      setHospitals(data.map((hospital) => hospital.name));
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  // Φιλτράρισμα των νοσοκομείων με βάση το search term
  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Αποθήκευση νέου νοσοκομείου στη βάση δεδομένων
  const handleAddHospital = async () => {
    if (!newHospital.trim()) return;
    try {
      const response = await fetch("http://localhost:5000/api/hospitals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newHospital }),
      });
      if (response.ok) {
        setNewHospital("");
        setIsAddFormOpen(false);
        setSuccessMessage("The hospital was added successfully!");
        setIsMessageVisible(true);
        await fetchHospitals();
        setSearchTerm("");
        setIsDropdownOpen(true);
        setTimeout(() => setIsMessageVisible(false), 3000);
      } else {
        console.error("Failed to add hospital");
      }
    } catch (error) {
      console.error("Error adding hospital:", error);
    }
  };

  return (
    <div className="form-field">
      <label className="field-label">Hospital</label>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search Hospital"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
        />
        <button
          type="button"
          style={{
            marginLeft: "10px",
            backgroundColor: isAddFormOpen ? "red" : "green",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
          }}
          onClick={() => setIsAddFormOpen((prev) => !prev)}
        >
          {isAddFormOpen ? "-" : "+"}
        </button>
      </div>
      {isDropdownOpen && (
        <select
          className="form-select"
          size={5}
          value={newCustomer.hospital_name || ""}
          onMouseDown={(e) => {
            const selectedHospital = e.target.value;
            setNewCustomer({
              ...newCustomer,
              hospital_name: selectedHospital,
            });
            setSearchTerm(selectedHospital);
            setIsDropdownOpen(false);
          }}
          onBlur={() => setIsDropdownOpen(false)}
          style={{
            overflowY: "auto",
            height: "auto",
          }}
        >
          {filteredHospitals.map((hospital, index) => (
            <option
              key={index}
              value={hospital}
              onMouseOver={() => setHoveredHospital(hospital)} // Ενημέρωση του hoveredHospital
              onMouseOut={() => setHoveredHospital(null)} // Καθαρισμός όταν ο κέρσορας φεύγει
              style={{
                backgroundColor: hoveredHospital === hospital ? "#f0f8ff" : "white", // Αλλαγή χρώματος
                color: hoveredHospital === hospital ? "black" : "inherit", // Αλλαγή χρώματος κειμένου
              }}
            >
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
            placeholder="Add Hospital"
            value={newHospital}
            onChange={(e) => setNewHospital(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <button
            type="button"
            style={{
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
            }}
            onClick={handleAddHospital}
          >
            Save
          </button>
        </div>
      )}
      {successMessage && (
        <div
          style={{
            marginTop: "10px",
            color: "green",
            fontWeight: "bold",
            opacity: isMessageVisible ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
            display: isMessageVisible ? "block" : "none",
          }}
        >
          {successMessage}
        </div>
      )}
    </div>
  );
}

export default HospitalDropdown;