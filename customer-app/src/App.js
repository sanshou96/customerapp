import React, { useState } from "react";
import CustomerForm from "./components/CustomerForm";
import CountersHistory from "./components/CountersHistory";
import axios from "axios";

function App() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    first_name: "",
    last_name: "",
    phone_1: "",
    phone_2: "",
    phone_3: "",
    weight: "",
    info: "",
    code: "",
  });
  const [transferType, setTransferType] = useState("");
  const [counters, setCounters] = useState({});

  const addCustomer = async (customerData, callback) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/customer",
        customerData,
      );
      if (response.data.counters) {
        setCounters(response.data.counters);
      }
      alert("Customer added successfully!");
      setNewCustomer({
        first_name: "",
        last_name: "",
        phone_1: "",
        phone_2: "",
        phone_3: "",
        weight: "",
        info: "",
        code: "",
      });
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error("Error adding customer:", err);
      alert("Failed to add customer");
      if (callback) {
        callback(null);
      }
    }
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <CustomerForm
        newCustomer={newCustomer}
        setNewCustomer={setNewCustomer}
        transferType={transferType}
        setTransferType={setTransferType}
        addCustomer={addCustomer}
        counters={counters}
        customer={customer} // Περάστε τον πελάτη που βρέθηκε
      />

      <CountersHistory />
    </div>
  );
}

export default App;
