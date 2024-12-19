'use strict';

const request = require('supertest');
const app = require('./app');

describe('Test the things service', () => {
    test('GET / succeeds', () => {
        return request(app)
	    .get('/')
	    .expect(200);
    });

    test('GET /stars/3 returns JSON', () => {
        return request(app)
	    .get('/stars/3')
	    .expect('Content-type', /json/);
    });

    test('POST /review fails with empty inputs', () => {
        const params = {'strName': '', 'strComment': '', 'numberStars': 3};
        return request(app)
        .post('/review')
        .send(params)
	    .expect(422);
    });
});