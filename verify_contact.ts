
// import axios from 'axios';
// import jwt from 'jsonwebtoken';

// const BASE_URL = 'http://localhost:5000/api/v1';
// const JWT_SECRET = '0ab803014b805f51442b4909e5b90e44068499c71ab85cbee51d96911cfae4e2';

// // User ID from the user's message (this ID must exist in DB for auto-fill to work)
// const MOCK_USER_ID = "69790f314d6217d841e7ee84";

// async function verifyContact() {
//     console.log('--- Verifying Contact Module ---');

//     // 1. Create Contact (Guest Mode)
//     console.log('\n1. Testing Create Contact (Guest Mode)...');
//     try {
//         const response = await axios.post(`${BASE_URL}/create_contact`, {
//             name: "Verify Guest",
//             email: "guest@verify.com",
//             title: "Guest Inquiry",
//             description: "Guest description text."
//         });
//         console.log('Guest Create Success:', response.data.success);
//     } catch (error: any) {
//         console.log('Guest Create Error:', error.response ? error.response.data : error.message);
//     }

//     // 2. Auth Check (Auto-fill)
//     console.log('\n2. Testing Create Contact (Authenticated / Auto-fill)...');

//     // Create a token
//     const token = jwt.sign(
//         { id: MOCK_USER_ID, role: 'superAdmin', email: 'parvesmosarof2@gmail.com' },
//         JWT_SECRET,
//         { expiresIn: '1h' }
//     );

//     try {
//         // NOTE: We are NOT sending name and email. 
//         // The backend should fill them from the user found by MOCK_USER_ID.
//         // If MOCK_USER_ID does not exist in the DB, this will fail with 400 (Name/Email required).

//         const response = await axios.post(
//             `${BASE_URL}/create_contact`,
//             {
//                 title: "Auth Inquiry",
//                 description: "This should have my name and email auto-filled."
//             },
//             {
//                 headers: {
//                     Authorization: token
//                 }
//             }
//         );
//         console.log('Auth Create Success:', response.data.success);
//         if (response.data.data) {
//             console.log(' > Created Contact Name:', response.data.data.name);
//             console.log(' > Created Contact Email:', response.data.data.email);
//         }
//     } catch (error: any) {
//         console.log('Auth Create Error:', error.response ? error.response.data : error.message);
//         if (error.response && error.response.data.message === "Name and Email are required") {
//             console.log(" > NOTE: This likely failed because the user ID in the token was not found in the database.");
//         }
//     }
// }

// verifyContact();