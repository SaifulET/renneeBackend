
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1/discounts';

async function verifyDiscounts() {
    try {
        console.log('1. Creating a discount...');
        const createPayload = {
            title: 'Summer Sale',
            percentage: 20,
        };
        // Note: Creating requires auth. Expecting failure or success depending on middleware.
        // Since I can't easily mock auth in this script without a token, I'll assume 
        // the user will test this manually with Postman or I can try a publicly accessible endpoint first.
        // However, I'll write the script to hit the endpoints and log the status.

        try {
            const response = await axios.post(BASE_URL, createPayload);
            console.log('Create Response:', response.data);
        } catch (error: any) {
            if (error.response) {
                console.log('Create Error Status:', error.response.status);
                console.log('Create Error Data:', error.response.data);
            } else {
                console.log('Create Error:', error.message);
            }
        }

        console.log('\n2. Getting all discounts...');
        try {
            const response = await axios.get(BASE_URL);
            console.log('Get All Response:', response.data);
        } catch (error: any) {
            console.log('Get All Error:', error.message);
        }

    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

verifyDiscounts();
