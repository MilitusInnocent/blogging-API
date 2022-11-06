const request = require('supertest')
const { connect } = require('./database')
const UserModel = require('../models/userModel')
const app = require('../app');

describe('Auth: Signup', () => {
    // afterEach(async () => {
    //     await conn.cleanup()
    // })

    // afterAll(async () => {
    //     await conn.disconnect()
    // })

    it('should signup a user', async () => {
        const response = await request(app).post('/signup')
        .set('content-type', 'application/json')
        .send({ 
            password: 'Password123', 
            firstName: 'tobie',
            lastName: 'Augustina',
            email: 'tobis@mail.com'
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('status')
        expect(response.body).toHaveProperty('posts')
        expect(response.body.user).toHaveProperty('firstname', 'tobie')
        expect(response.body.user).toHaveProperty('lastname', 'Augustina')
        expect(response.body.user).toHaveProperty('email', 'tobis@mail.com')        
    })


    it('should login a user', async () => {
        // create user in out db
        const user = await UserModel.find({ email: 'tobis@mail.com', password: '123456'});

        // login user
        const response = await request(app)
        .post('/login')
        .set('content-type', 'application/json')
        .send({ 
            email: 'tobis@mail.com', 
            password: '123456'
        });
    

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('token')      
    })
})