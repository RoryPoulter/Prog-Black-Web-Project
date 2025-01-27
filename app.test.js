'use strict';

const request = require('supertest');
const app = require('./app');

describe('Test the things service', () => {
    test('GET / succeeds', () => {
        return request(app)
	    .get('/')
	    .expect(200);
    });

    test('GET / returns HTML', () => {
        return request(app)
        .get('/')
        .expect('Content-type', /html/);
    });

    test('GET /search?ingredients=vodka returns JSON', () => {
        return request(app)
	    .get('/search?ingredients=vodka')
	    .expect('Content-type', /json/);
    });

    test('GET /search?ingredients=invalid returns empty JSON', () => {
        return request(app)
	    .get('/search?ingredients=invalid')
	    .expect('{"drinks":null}');
    });

    test('POST /submit fails with empty inputs', () => {
        const params = {'drinkName': '', 'drinkInst': '', 'drinkIngr1': '', 'drinkIngrAm1': '', 'drinkIngr2': '', 'drinkIngrAm2': ''};
        return request(app)
        .post('/submit')
        .send(params)
	    .expect(422);
    });

    test('GET /ingredients returns JSON', () => {
        return request(app)
	    .get('/ingredients')
	    .expect('Content-type', /json/);
    });
});