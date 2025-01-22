'use strict';

const request = require('supertest');
const app = require('./app');

describe('Test the things service', () => {
    test('GET / succeeds', () => {
        return request(app)
	    .get('/')
	    .expect(200);
    });

    test('GET /search?ingredient=vodka returns JSON', () => {
        return request(app)
	    .get('/search?ingredient=vodka')
	    .expect('Content-type', /json/);
    });

    test('GET /search?ingredient=invalid returns empty JSON', () => {
        return request(app)
	    .get('/search?ingredient=invalid')
	    .expect('{"drinks":null}');
    });

    test('POST /submit fails with empty inputs', () => {
        const params = {'drinkName': '', 'drinkInst': '', 'drinkIngr1': '', 'drinkIngrAm1': '', 'drinkIngr2': '', 'drinkIngrAm2': ''};
        return request(app)
        .post('/submit')
        .send(params)
	    .expect(422);
    });
});