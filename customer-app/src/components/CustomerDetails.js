import React from "react";

function CustomerDetails({
  customer,
  editingField,
  setEditingField,
  editedValue,
  setEditedValue,
  updateCustomer,
}) {
  return (
    <div
      style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px" }}
    >
      <h2>Customer Details</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                textAlign: "left",
              }}
            >
              Field
            </th>
            <th
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                textAlign: "left",
              }}
            >
              Value
            </th>
            <th
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                textAlign: "left",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(customer)
            .filter(([field]) => field !== "id") // Αφαιρούμε το πεδίο id
            .map(([field, value]) => (
              <tr key={field}>
                <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                  {field}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                  {editingField === field ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        updateCustomer(field, editedValue);
                      }}
                    >
                      <input
                        type="text"
                        value={editedValue}
                        onChange={(e) => setEditedValue(e.target.value)}
                        style={{ padding: "5px", width: "100%" }}
                      />
                    </form>
                  ) : (
                    value
                  )}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                  {editingField === field ? (
                    <>
                      <button
                        onClick={() => updateCustomer(field, editedValue)}
                        style={{ padding: "5px 10px", marginRight: "5px" }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        style={{ padding: "5px 10px" }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingField(field);
                        setEditedValue(value);
                      }}
                      style={{ padding: "5px 10px" }}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerDetails;
