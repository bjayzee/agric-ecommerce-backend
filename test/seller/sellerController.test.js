const request = require('supertest');
const jest = require('jest');
const app = require('../../index'); 
const { Seller, AgrikoUser } = require('../../models/index');
const { encryptPassword } = require('../../config/token');
const { registerSellerValidationSchema } = require('../../validations/index');
const httpStatus = require('http-status');
const ApiError = require('../../config/ApiError');

// Jest setup to extend the timeout, as database operations may take some time
jest.setTimeout(10000);

describe('Seller Controller', () => {
    
    beforeEach(async () => {
        
    });

    test('POST /api/sellers should create a new seller', async () => {
        const sellerData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            phone_number: '1234567890',
        };

        // Use Supertest to make a request to the createSeller endpoint
        const response = await request(app)
            .post('/api/sellers')
            .send(sellerData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(httpStatus.CREATED);

        // Validate the response structure
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Seller created successfully');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.firstname).toBe(sellerData.firstname);
        expect(response.body.data.lastname).toBe(sellerData.lastname);
        expect(response.body.data.email).toBe(sellerData.email);
        expect(response.body.data.phone_number).toBe(sellerData.phone_number);

        // Validate that the seller and associated AgrikoUser were created in the database
        const createdSeller = await Seller.findByPk(response.body.data.id);
        const agrikoUser = await AgrikoUser.findByPk(createdSeller.AgrikoUserId);

        expect(createdSeller).not.toBeNull();
        expect(agrikoUser).not.toBeNull();
        expect(agrikoUser.firstname).toBe(sellerData.firstname);
        expect(agrikoUser.lastname).toBe(sellerData.lastname);
        expect(agrikoUser.email).toBe(sellerData.email);

        
    });

    
});






describe('Seller Controller', () => {
    // Assume there is an authenticated seller for testing purposes
    let authenticatedSeller;

    beforeAll(async () => {
        // Perform any setup here, like creating a test seller
        // ...

        // Log in the seller and get the authentication token
        const loginResponse = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'testpassword' });

        authenticatedSeller = loginResponse.body.token;
    });

    describe('createSeller', () => {
        it('should create a new seller', async () => {
            const response = await request(app)
                .post('/create-seller')
                .set('Authorization', `Bearer ${authenticatedSeller}`)
                .send({ /* your test data */ });

            expect(response.statusCode).toBe(201);
            expect(response.body.success).toBe(true);
            // Add more assertions as needed
        });
    });

    
});

