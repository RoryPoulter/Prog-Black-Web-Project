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

    // Test search GET method input validation
    // minIngredients > maxIngredients
    test('GET /search?minIngredients=8&maxIngredients=6 fails', () =>{
        return request(app)
        .get('/search?minIngredients=8&maxIngredients=6')
        .expect(422);
    });

    test('GET /search?minIngredients=8&maxIngredients=6 returns JSON', () =>{
        return request(app)
        .get('/search?minIngredients=8&maxIngredients=6')
        .expect('Content-type', /json/);
    });

    test('GET /search?minIngredients=8&maxIngredients=6 sends correct error message', () =>{
        return request(app)
        .get('/search?minIngredients=8&maxIngredients=6')
        .expect('{"error":"Query param minIngredients greater than maxIngredients (8 > 6)"}');
    });

    // minIngredients out of range
    test('GET /search?minIngredients=16 fails', () =>{
        return request(app)
        .get('/search?minIngredients=16')
        .expect(422);
    });

    test('GET /search?minIngredients=16 returns JSON', () =>{
        return request(app)
        .get('/search?minIngredients=16')
        .expect('Content-type', /json/);
    });

    test('GET /search?minIngredients=1 sends correct error message', () =>{
        return request(app)
        .get('/search?minIngredients=1')
        .expect('{"error":"Query param minIngredients out of range (1)"}');
    });

    // Test submit POST method input validation
    test('POST /submit fails with empty inputs', () => {
        const params = {
            'strName': '',
            'strInstructions': '',
            'strIngredient1': '',
            'strIngredientAmount1': '',
            'strIngredient2': '',
            'strIngredientAmount2': ''
        };
        return request(app)
        .post('/submit')
        .send(params)
	    .expect(422);
    });

    test('POST /submit with empty inputs returns correct error message', () => {
        const params = {
            'strName': '',
            'strInstructions': '',
            'strIngredient1': '',
            'strIngredientAmount1': '',
            'strIngredient2': '',
            'strIngredientAmount2': ''
        };
        return request(app)
        .post('/submit')
        .send(params)
	    .expect('{"error":"Missing required inputs"}');
    });

    test('POST /submit fails with extra inputs', () => {
        const params = {
            'extraInput': 'extraValue'
        };
        return request(app)
        .post('/submit')
        .send(params)
	    .expect(422);
    });

    test('POST /submit with extra inputs returns correct error message', () => {
        const params = {
            'extraInput': 'extraValue'
        };
        return request(app)
        .post('/submit')
        .send(params)
	    .expect('{"error":"Extra params passed (34)"}');
    });

    test('POST /submit fails with incomplete ingredient-amount pairs', () => {
        const params = {
            'strName': 'vodka & tonic',
            'strInstructions': 'Pour ingredients into an ice-filled glass. Garnish with a lime wedge and serve.',
            'strIngredient1': 'vodka',
            'strIngredientAmount1': '50ml',
            'strIngredient2': 'tonic water',
            'strIngredientAmount2': '120ml',
            'strIngredientAmount3': '30ml'
        };
        return request(app)
        .post('/submit')
        .send(params)
	    .expect(422);
    });

    test('POST /submit with incomplete ingredient-amount pairs returns correct error message', () => {
        const params = {
            'strName': 'vodka & tonic',
            'strInstructions': 'Pour ingredients into an ice-filled glass. Garnish with a lime wedge and serve.',
            'strIngredient1': 'vodka',
            'strIngredientAmount1': '50ml',
            'strIngredient2': 'tonic water',
            'strIngredientAmount2': '120ml',
            'strIngredientAmount3': '30ml'
        };
        return request(app)
        .post('/submit')
        .send(params)
	    .expect('{"error":"Ingredient-amount pair no. 3 incomplete"}');
    });

    test('POST /submit succeeds with valid inputs', () => {
        const params = {
            'strName': 'vodka & tonic',
            'strInstructions': 'Pour ingredients into an ice-filled glass. Garnish with a lime wedge and serve.',
            'strIngredient1': 'vodka',
            'strIngredientAmount1': '50ml',
            'strIngredient2': 'tonic water',
            'strIngredientAmount2': '120ml'
        };
        return request(app)
        .post('/submit')
        .send(params)
	    .expect(200);
    });

    test('POST /submit fails with repeated inputs', () => {
        const params = {
            'strName': 'vodka & tonic',
            'strInstructions': 'Pour ingredients into an ice-filled glass. Garnish with a lime wedge and serve.',
            'strIngredient1': 'vodka',
            'strIngredientAmount1': '50ml',
            'strIngredient2': 'tonic water',
            'strIngredientAmount2': '120ml'
        };
        return request(app)
        .post('/submit')
        .send(params)
	    .expect('{"error":"Name VODKA & TONIC is not unique"}');
    });

    test('GET /ingredients returns JSON', () => {
        return request(app)
	    .get('/ingredients')
	    .expect('Content-type', /json/);
    });
});