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

    // Test DELETE method input validation
    test('DELETE /delete/ fails without parameter', () => {
        return request(app)
        .delete('/delete/')
        .expect(404);
    });

    test('DELETE /delete/ fails and returns JSON', () => {
        return request(app)
        .delete('/delete/')
        .expect('Content-type', /html/);
    });

    test('DELETE /delete/artlantic succeeds', () => {
        return request(app)
        .delete('/delete/artlantic')
        .expect(200);
    });

    test('POST /submit succeeds and returns JSON', () => {
        const params = {
            'strName': 'artlantic',
            'strInstructions': 'Shake all ingredients with ice, strain into an ice-filled glass and garnish with an orange wedge.',
            'strIngredient1': 'spiced rum',
            'strIngredientAmount1': '30ml',
            'strIngredient2': 'amaretto',
            'strIngredientAmount2': '15ml',
            'strIngredient3': 'blue curaçao',
            'strIngredientAmount3': '15ml',
            'strIngredient4': 'lime juice',
            'strIngredientAmount4': '15ml',
            'strIngredient5': 'apple juice',
            'strIngredientAmount5': '90ml'
        };
        return request(app)
        .post('/submit')
        .send(params)
	    .expect('Content-type', /json/);
    });

    test('DELETE /delete/artlantic succeeds and returns JSON', () => {
        return request(app)
        .delete('/delete/artlantic')
        .expect('Content-type', /json/);
    });

    test('POST /submit succeeds and returns message', () => {
        const params = {
            'strName': 'artlantic',
            'strInstructions': 'Shake all ingredients with ice, strain into an ice-filled glass and garnish with an orange wedge.',
            'strIngredient1': 'spiced rum',
            'strIngredientAmount1': '30ml',
            'strIngredient2': 'amaretto',
            'strIngredientAmount2': '15ml',
            'strIngredient3': 'blue curaçao',
            'strIngredientAmount3': '15ml',
            'strIngredient4': 'lime juice',
            'strIngredientAmount4': '15ml',
            'strIngredient5': 'apple juice',
            'strIngredientAmount5': '90ml'
        };
        return request(app)
        .post('/submit')
        .send(params)
	    .expect('{"message":"Recipe uploaded successfully"}');
    });

    test('DELETE /delete/artlantic succeeds and returns message', () => {
        return request(app)
        .delete('/delete/artlantic')
        .expect('{"message":"Recipe successfully deleted"}');
    });

    test('DELETE /delete/artlantic fails and returns JSON', () => {
        return request(app)
        .delete('/delete/artlantic')
        .expect('Content-type', /json/);
    });

    test('DELETE /delete/artlantic fails and sends correct error message', () => {
        return request(app)
        .delete('/delete/artlantic')
        .expect('{"error":"Recipe ARTLANTIC not found"}');
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
	    .expect('{"error":"Extra params passed (35)"}');
    });

    test('POST /submit fails with incomplete ingredient-amount pairs', () => {
        const params = {
            'strName': 'artlantic',
            'strInstructions': 'Shake all ingredients with ice, strain into an ice-filled glass and garnish with an orange wedge.',
            'strIngredient1': 'spiced rum',
            'strIngredientAmount1': '30ml',
            'strIngredient2': 'amaretto',
            'strIngredientAmount2': '15ml',
            'strIngredient3': 'blue curaçao',
            'strIngredientAmount3': '',
            'strIngredient4': 'lime juice',
            'strIngredientAmount4': '15ml',
            'strIngredient5': 'apple juice',
            'strIngredientAmount5': '90ml'
        };
        return request(app)
        .post('/submit')
        .send(params)
	    .expect(422);
    });

    test('POST /submit with incomplete ingredient-amount pairs returns correct error message', () => {
        const params = {
            'strName': 'artlantic',
            'strInstructions': 'Shake all ingredients with ice, strain into an ice-filled glass and garnish with an orange wedge.',
            'strIngredient1': 'spiced rum',
            'strIngredientAmount1': '30ml',
            'strIngredient2': 'amaretto',
            'strIngredientAmount2': '15ml',
            'strIngredient3': 'blue curaçao',
            'strIngredientAmount3': '',
            'strIngredient4': 'lime juice',
            'strIngredientAmount4': '15ml',
            'strIngredient5': 'apple juice',
            'strIngredientAmount5': '90ml'
        };
        return request(app)
        .post('/submit')
        .send(params)
	    .expect('{"error":"Ingredient-amount pair no. 3 incomplete"}');
    });

    test('POST /submit succeeds with valid inputs', () => {
        const params = {
            'strName': 'artlantic',
            'strInstructions': 'Shake all ingredients with ice, strain into an ice-filled glass and garnish with an orange wedge.',
            'strIngredient1': 'spiced rum',
            'strIngredientAmount1': '30ml',
            'strIngredient2': 'amaretto',
            'strIngredientAmount2': '15ml',
            'strIngredient3': 'blue curaçao',
            'strIngredientAmount3': '15ml',
            'strIngredient4': 'lime juice',
            'strIngredientAmount4': '15ml',
            'strIngredient5': 'apple juice',
            'strIngredientAmount5': '90ml'
        };
        return request(app)
        .post('/submit')
        .send(params)
	    .expect(200);
    });

    test('POST /submit fails with repeated inputs', () => {
        const params = {
            'strName': 'artlantic',
            'strInstructions': 'Shake all ingredients with ice, strain into an ice-filled glass and garnish with an orange wedge.',
            'strIngredient1': 'spiced rum',
            'strIngredientAmount1': '30ml',
            'strIngredient2': 'amaretto',
            'strIngredientAmount2': '15ml',
            'strIngredient3': 'blue curaçao',
            'strIngredientAmount3': '15ml',
            'strIngredient4': 'lime juice',
            'strIngredientAmount4': '15ml',
            'strIngredient5': 'apple juice',
            'strIngredientAmount5': '90ml'
        };
        return request(app)
        .post('/submit')
        .send(params)
	    .expect('{"error":"Name ARTLANTIC is not unique"}');
    });

    test('GET /ingredients returns JSON', () => {
        return request(app)
	    .get('/ingredients')
	    .expect('Content-type', /json/);
    });
});