// utils/generateCode.js

/**
 * Generates a random alphanumeric string for use as a class code.
 * @param {number} length - The desired length of the code. Default is 6.
 * @returns {string} The generated code (e.g., "A3X9T1").
 */
const generateUniqueCode = (length = 6) => {
    // Define the characters pool: uppercase letters and numbers (excluding 0, O, I, L to reduce confusion)
    const characters = 'ABCDEFGHJKMNPQRSTUVWXYZ123456789';
    let result = '';
    const charactersLength = characters.length;
    
    for (let i = 0; i < length; i++) {
        // Generate a random index and append the character
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
};

export default generateUniqueCode;