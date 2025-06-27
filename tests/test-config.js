// Test configuration
process.env.NODE_ENV = 'test';

// Set a different port for tests to avoid conflicts
process.env.PORT = process.env.PORT || 3001;

// Disable console logs during tests
if (process.env.NODE_ENV === 'test') {
    console.log = () => {};
}