import React, { useState } from "react";
import "./CustomerForm.css";

function ClinicDropdown({ newCustomer, setNewCustomer }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredClinic, setHoveredClinic] = useState(null); // Κατάσταση για την επιλογή που είναι ενεργή

  const clinics = [
    "Hematology",
    "Cardiology",
    "Nephrology",
    "Neurology",
    "Neurosurgery",
    "Orthopedics",
    "Urology",
    "Ophthalmology",
    "Internal Medicine",
    "Rheumatology",
    "Surgery",
  ];

  // Φιλτράρισμα των κλινικών με βάση το search term
  const filteredClinics = clinics.filter((clinic) =>
    clinic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="form-field">
      <label className="field-label">Clinic</label>
      <input
        type="text"
        className="form-input"
        placeholder="Search Clinic"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsDropdownOpen(true)} // Άνοιγμα dropdown όταν το input έχει focus
      />
      {isDropdownOpen && (
        <select
          className="form-select"
          size={5} // Περιορισμός ύψους με δυνατότητα scroll
          value={newCustomer.clinic_name || ""} // Ενημέρωση της τιμής με βάση την επιλογή
          onMouseDown={(e) => {
            const selectedClinic = e.target.value;
            setNewCustomer({
              ...newCustomer,
              clinic_name: selectedClinic, // Ενημέρωση του πεδίου clinic_name
            });
            setSearchTerm(selectedClinic); // Καθαρισμός του search term για να εμφανιστούν όλες οι κλινικές
            setIsDropdownOpen(false); // Κλείσιμο του dropdown μετά την επιλογή
          }}
          onBlur={() => setIsDropdownOpen(false)} // Κλείσιμο dropdown όταν χάνει το focus
          style={{
            overflowY: "auto", // Ενεργοποίηση scroll
            height: "auto", // Αυτόματο ύψος
          }}
        >
          {filteredClinics.map((clinic, index) => (
            <option
              key={index}
              value={clinic}
              onMouseOver={() => setHoveredClinic(clinic)} // Ενημέρωση του hoveredClinic
              onMouseOut={() => setHoveredClinic(null)} // Καθαρισμός όταν ο κέρσορας φεύγει
              style={{
                backgroundColor: hoveredClinic === clinic ? "#f0f8ff" : "white", // Αλλαγή χρώματος
                color: hoveredClinic === clinic ? "black" : "inherit", // Αλλαγή χρώματος κειμένου
              }}
            >
              {clinic}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default ClinicDropdown;