module.exports = {
    transform: {
      '^.+\\.jsx?$': 'babel-jest', // Χρησιμοποιεί το babel-jest για αρχεία .js και .jsx
    },
    testEnvironment: 'jsdom', // Απαραίτητο για δοκιμές React
  };