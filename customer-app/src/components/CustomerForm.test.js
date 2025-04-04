import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CustomerForm from "./CustomerForm";
import axios from "axios";

jest.mock("axios");

describe("CustomerForm Component", () => {
    const mockSetNewCustomer = jest.fn();
    const mockSetTransferType = jest.fn();
    const mockAddCustomer = jest.fn();

    const defaultProps = {
        newCustomer: {
            phone_1: "",
            first_name: "",
            last_name: "",
            floors: 0,
            floord: 0,
            has_elevators: false,
            has_elevatord: false,
        },
        setNewCustomer: mockSetNewCustomer,
        transferType: "Από Νοσοκομείο για Σπίτι",
        setTransferType: mockSetTransferType,
        addCustomer: mockAddCustomer,
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders the form with initial elements", () => {
        render(<CustomerForm {...defaultProps} />);

        expect(screen.getByText("Διαχείριση Πελατών")).toBeInTheDocument();
        expect(screen.getByText("Υπολογισμένο Κόστος")).toBeInTheDocument();
        expect(screen.getByText("Υπολογισμένο Κόστος + ΦΠΑ")).toBeInTheDocument();
        expect(screen.getByText("Αναζήτηση Πελάτη")).toBeInTheDocument();
        expect(screen.getByText("Αποθήκευση Δεδομένων")).toBeInTheDocument();
    });

    test("updates newCustomer state on input change", () => {
        render(<CustomerForm {...defaultProps} />);

        const firstNameInput = screen.getByPlaceholderText("Όνομα");
        fireEvent.change(firstNameInput, { target: { value: "John" } });

        expect(mockSetNewCustomer).toHaveBeenCalledWith({
            ...defaultProps.newCustomer,
            first_name: "John",
        });
    });

    test("calls handleSearchSubmit on search form submission", async () => {
        axios.get.mockResolvedValueOnce({
            data: { customer: { id: 1, first_name: "John", last_name: "Doe" } },
        });

        render(<CustomerForm {...defaultProps} />);

        const searchButton = screen.getByText("Αναζήτηση");
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/api/customers", {
                params: {
                    phoneNumber: "",
                    firstName: "",
                    lastName: "",
                },
            });
        });
    });

    test("calls addCustomer on form submission", () => {
        render(<CustomerForm {...defaultProps} />);

        const submitButton = screen.getByText("Αποθήκευση Δεδομένων");
        fireEvent.click(submitButton);

        expect(mockAddCustomer).toHaveBeenCalled();
    });

    test("calculates cost correctly based on floors and elevator usage", () => {
        const updatedProps = {
            ...defaultProps,
            newCustomer: {
                ...defaultProps.newCustomer,
                floors: 2,
                floord: 3,
                has_elevators: false,
                has_elevatord: true,
            },
        };

        render(<CustomerForm {...updatedProps} />);

        expect(screen.getByText("60 €")).toBeInTheDocument(); // Base cost + floor costs
    });

    test("renders saved customer details when savedCustomer is set", async () => {
        const updatedProps = {
            ...defaultProps,
            newCustomer: {
                ...defaultProps.newCustomer,
                phone_1: "123456789",
                first_name: "John",
                last_name: "Doe",
            },
        };

        axios.get.mockResolvedValueOnce({
            data: { customer: { id: 1, first_name: "John", last_name: "Doe" } },
        });

        render(<CustomerForm {...updatedProps} />);

        const searchButton = screen.getByText("Αναζήτηση");
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(screen.getByText("Αποθηκευμένα Στοιχεία Πελάτη")).toBeInTheDocument();
            expect(screen.getByText("John")).toBeInTheDocument();
            expect(screen.getByText("Doe")).toBeInTheDocument();
        });
    });
});