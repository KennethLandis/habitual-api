const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')
const { makeHabitsArray } = require('./habits.fixtures') 
const supertest = require('supertest')
const { default: contentSecurityPolicy } = require('helmet/dist/middlewares/content-security-policy')
const { expect } = require('chai')

describe('Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE clients, habits RESTART IDENTITY CASCADE'))

    afterEach('cleanup', () => db.raw('TRUNCATE clients, habits RESTART IDENTITY CASCADE'))

    describe('GET /clients', () => {
        context('Given no clients', () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/clients')
                    .expect(200, [])
            })
        })

        context(`Given there are users in the database`, () => {
            const testUsers = makeUsersArray();
            const testHabits = makeHabitsArray();

            beforeEach('insert data', () => {
                return db
                    .into('clients')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('habits')
                            .insert(testHabits)
                    })
            })

            it('responds with 200 and all of the users', () => {
                return supertest(app)
                    .get('/clients')
                    .expect(200, testUsers)
            })
        })        
    })
    describe(`GET /clients:client_id`, () => {
        context('Given no clients', () => {
            it(`responds with 404`, () => {
                const userId = 6
                return supertest(app)
                    .get(`/clients/${userId}`)
                    .expect(404, { error: { message: `Client Not Found` } })
            })
        })

        context(`Given there are users in the database`, () => {
            const testUsers = makeUsersArray();
            const testHabits = makeHabitsArray();

            beforeEach('insert data', () => {
                return db
                    .into('clients')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('habits')
                            .insert(testHabits)
                    })
            })

            it(`responds with 200 and the specified user`, () => {
                const userId = 2
                const expectedUser = testUsers[userId - 1]
                return supertest(app)
                    .get(`/clients/${userId}`)
                    .expect(200, expectedUser)
            })
        })
    })

    describe(`Post /clients`, () => {
        it(`creates an user, responding with 201 and the new user`, () => {
            const newUser = {
                client_name: 'cale',
                user_password: 'dragonglory'
            }
            return supertest(app)
                .post('/clients')
                .send(newUser)
                .expect(201)
                .expect(res => {
                    expect(res.body.client_name).to.eql(newUser.client_name)
                    expect(res.body.user_password).to.eql(newUser.user_password)
                    expect(res.body).to.have.property('id')
                })
                .then(res =>
                    supertest(app)
                    .get(`/clients/${res.body.id}`)
                    .expect(res.body))
        })
    })

    describe('GET /habits', () => {
        context('Given no habits', () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/habits')
                    .expect(200, [])
            })
        })

        context(`Given there are habits in the database`, () => {
            const testUsers = makeUsersArray();
            const testHabits = makeHabitsArray();

            beforeEach('insert data', () => {
                return db
                    .into('clients')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('habits')
                            .insert(testHabits)
                    })
            })

            it('responds with 200 and all of the users', () => {
                return supertest(app)
                    .get('/habits')
                    .expect(200, testHabits)
            })
        })        
    })

    describe(`GET /habits:habitsId`, () => {
        context('Given no habits', () => {
            it(`responds with 404`, () => {
                const habitId = 6
                return supertest(app)
                    .get(`/habits/${habitId}`)
                    .expect(404, { error: { message: `Habit Not Found` } })
            })
        })

        context(`Given there are habits in the database`, () => {
            const testUsers = makeUsersArray();
            const testHabits = makeHabitsArray();

            beforeEach('insert data', () => {
                return db
                    .into('clients')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('habits')
                            .insert(testHabits)
                    })
            })

            it(`responds with 200 and the specified habit`, () => {
                const habitId = 2
                const expectedHabit = testHabits[habitId - 1]
                return supertest(app)
                    .get(`/habits/${habitId}`)
                    .expect(200, expectedHabit)
            })
        })
    })
    describe(`Post /habits`, () => {
        const testUsers = makeUsersArray();
        beforeEach('insert data', () => {
            return db
                .into('clients')
                .insert(testUsers)
        })
        it(`creates a habit, responding with 201 and the new habit`, () => {
            const newHabit = {
                id: 1,
                habit_name: 'pick dragonglory',
                days_completed: 6,
                client_id: 1
            }
            return supertest(app)
                .post('/habits')
                .send(newHabit)
                .expect(201)
                .expect(res => {
                    expect(res.body.habit_name).to.eql(newHabit.habit_name)
                    expect(res.body.days_completed).to.eql(newHabit.days_completed)
                    expect(res.body).to.have.property('id')
                })
                .then(res =>
                    supertest(app)
                    .get(`/habits/${res.body.id}`)
                    .expect(res.body))
        })
    })
    describe(`PATCH /habits/:habit_id`, () => {
        context(`Given not habits`, () => {
            it(`responds with 404`, () => {
                const habitId = 2
                return supertest(app)
                    .delete(`/habits/${habitId}`)
                    .expect(404, { error: { message: `Habit Not Found`}})
            })
        })
        context(`Given there are habits in the database`, () => {
            const testUsers = makeUsersArray();
            const testHabits = makeHabitsArray();

            beforeEach('insert data', () => {
                return db
                    .into('clients')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('habits')
                            .insert(testHabits)
                    })
            })

            it(`responds with 204 and updates the habit`, () => {
                const idToUpdate = 2
                const updateHabit = {
                    habit_name: 'updated habit name',
                    days_completed: 42,
                    client_id: 1
                }
                const expectedHabit = {
                    ...testHabits[idToUpdate - 1],
                    ...updateHabit
                }
                return supertest(app)
                    .patch(`/habits/${idToUpdate}`)
                    .send(updateHabit)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                        .get(`/habits/${idToUpdate}`)
                        .expect(expectedHabit))
            })
        })
    })
})