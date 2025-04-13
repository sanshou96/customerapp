module.exports = {
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest", // Χρησιμοποιήστε το Babel για τη μετατροπή ES Modules
    },
    transformIgnorePatterns: [
      "/node_modules/(?!axios)/", // Μετατρέψτε το axios και άλλα ES Modules
    ],
  };