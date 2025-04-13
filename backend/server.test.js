const request = require('supertest');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = require('./server'); // Assuming server.js exports the app

jest.mock('sqlite3', () => {
    const mockDatabase = {
        get: jest.fn(),
        close: jest.fn(),
    };
    return {
        verbose: jest.fn(() => ({
            Database: jest.fn(() => mockDatabase),
        })),
    };
});

describe('GET /api/counters', () => {
    let dbMock;

    beforeEach(() => {
        dbMock = new sqlite3.verbose().Database();
        app.locals.db = dbMock; // Connect the mock database with the app
    });

    afterEach(() => {
        dbMock.close.mockClear();
        jest.clearAllMocks();
    });

    it('should return counters successfully', async () => {
        const mockCounters = { "166c": 10, "153c": 5, "011c": 3, "1600c": 8 };
        dbMock.get.mockImplementation((query, callback) => {
            callback(null, mockCounters);
        });

        const response = await request(app).get('/api/counters');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockCounters);
        expect(dbMock.get).toHaveBeenCalledWith(
            `SELECT "166c", "153c", "011c", "1600c" FROM Counters`,
            expect.any(Function)
        );
    });

    it('should handle database errors', async () => {
        dbMock.get.mockImplementation((query, callback) => {
            callback(new Error('Database error'), null);
        });

        const response = await request(app).get('/api/counters');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to fetch counters' });
        expect(dbMock.get).toHaveBeenCalledWith(
            `SELECT "166c", "153c", "011c", "1600c" FROM Counters`,
            expect.any(Function)
        );
    });
});