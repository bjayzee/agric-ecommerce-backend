const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../index');

const setupTestDB = require('../utils/setupTestDB');


describe('Product routes', () => {
    describe('POST /v1/category', () => {
        test('should return 200 and the category object if data is ok', async () => {

            const res = await request(app)
                .post(`/v1/category/`)
                .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk3YmVmNWIwLWJhYWItNDZiMy1iYmQwLTQ2NWE5OWY3ZWVkYyIsInJvbGUiOiJzZWxsZXIiLCJpYXQiOjE3MDA0MzcxODIsImV4cCI6MTcwMDUyMzU4Mn0.XcRTjoEdkuik3s2C1ZeH1A3yXBLP6mUy4O5zoI3lDEg')
                .send()
                .expect(httpStatus.OK);

            expect(res.body).not.toHaveProperty('password');
            expect(res.body).toEqual({
                id: userOne._id.toHexString(),
                email: userOne.email,
                name: userOne.name,
                role: userOne.role,
                isEmailVerified: userOne.isEmailVerified,
            });
        });

    });




    describe('POST /v1/product', () => {

    });



    describe('PUT /v1/product/edit', () => {

    });

    describe('GET /v1/seller/products', () => {

    });


    describe('GET /v1/seller/products/search', () => {

    });

})
