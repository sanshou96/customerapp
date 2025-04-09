import React, { useState } from "react";
import "./CustomerForm.css";
function ClinicDropdown({ newCustomer, setNewCustomer }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const clinics = [
    "Αιματολογική",
    "Καρδιολογική",
    "Νεφρολογική",
    "Νευρολογική",
    "Νευροχειρουργική",
    "Ορθοπεδική",
    "Ουρολογική",
    "Οφθαλμολογική",
    "Παθολογική",
    "Ρευματολογική",
    "Χειρουργική",
  ];

  // Φιλτράρισμα των κλινικών με βάση το search term
  const filteredClinics = clinics.filter((clinic) =>
    clinic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="form-field">
      <label className="field-label">Κλινική</label>
      <input
        type="text"
        className="form-input"
        placeholder="Αναζήτηση Κλινικής"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsDropdownOpen(true)} // Άνοιγμα dropdown όταν το input έχει focus
      />
      {isDropdownOpen && (
        <select
          className="form-select"
          size={5} // Περιορισμός ύψους με δυνατότητα scroll
          value={newCustomer.clinic_name || ""}
          onChange={(e) => {
            const selectedClinic = e.target.value;
            setNewCustomer({
              ...newCustomer,
              clinic_name: selectedClinic,
            });
            setSearchTerm(selectedClinic); // Ενημέρωση του searchTerm με την επιλογή
            setIsDropdownOpen(false); // Κλείσιμο dropdown μετά την επιλογή
          }}
          onBlur={() => setIsDropdownOpen(false)} // Κλείσιμο dropdown όταν χάνει το focus
          style={{
            overflowY: "auto", // Ενεργοποίηση scroll
            height: "auto", // Αυτόματο ύψος
          }}
        >
          {filteredClinics.map((clinic, index) => (
            <option key={index} value={clinic}>
              {clinic}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default ClinicDropdown;