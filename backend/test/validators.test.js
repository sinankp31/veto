import assert from 'node:assert/strict';
import {once} from 'node:events';
import test from 'node:test';
import express from 'express';
import {registerValidator} from '../src/validators/auth.validator.js';
import {addToCartValidator} from '../src/validators/cart.validator.js';
import {createProductValidator} from '../src/validators/product.validator.js';

const postThroughValidator = async (validators, body, selectResponse) => {
    const app = express();
    app.use(express.json());
    app.post('/validate', ...validators, (req, res) => {
        res.json(selectResponse(req));
    });

    const server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');

    try {
        const response = await fetch(`http://127.0.0.1:${server.address().port}/validate`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });

        return {
            status: response.status,
            body: await response.json()
        };
    } finally {
        await new Promise((resolve, reject) => {
            server.close(error => error ? reject(error) : resolve());
        });
    }
};

test('product validation accepts titles containing numbers and punctuation', async () => {
    const result = await postThroughValidator(createProductValidator, {
        title: 'T-Shirt 2',
        description: 'A comfortable cotton shirt for everyday use.',
        price: {amount: 25, currency: 'USD'},
        sizes: [{size: 'M', stock: 3}]
    }, req => ({title: req.body.title}));

    assert.equal(result.status, 200);
    assert.equal(result.body.title, 'T-Shirt 2');
});

test('cart validation converts quantity strings to numbers', async () => {
    const result = await postThroughValidator(addToCartValidator, {
        productId: '507f1f77bcf86cd799439011',
        quantity: '3',
        size: 'M'
    }, req => ({quantity: req.body.quantity, type: typeof req.body.quantity}));

    assert.equal(result.status, 200);
    assert.deepEqual(result.body, {quantity: 3, type: 'number'});
});

test('password validation preserves leading and trailing whitespace', async () => {
    const password = ' secret ';
    const result = await postThroughValidator(registerValidator, {
        name: 'Taylor User',
        email: 'taylor@example.com',
        password
    }, req => ({password: req.body.password}));

    assert.equal(result.status, 200);
    assert.equal(result.body.password, password);
});