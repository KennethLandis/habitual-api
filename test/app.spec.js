const app = require('../src/app')
const knex = require('knex')
const { contentSecurityPolicy } = require('helmet')
const supertest = require('supertest')
const { expect } = require('chai')
const helpers = require('./test-helpers')

describe('Endpoints', function() {
    let db
    const testUsers = [
        {
            "client_name": "portal",
            "user_password": "test1"
        },
        {
            "client_name": "petch",
            "user_password": "test2",
        },
        {
            "client_name": "byrd",
            "user_password": "test3"
        } 
        ]
    const testHabits = [
        {
            habit_name: 'Do the dishes',
            days_completed: 3,
            client_id: 2
        },
        {
            habit_name: 'Complete a Mythic',
            days_completed: 0,
            client_id: 1
        },
        {
            habit_name: 'Maple Tour',
            days_completed: 54,
            client_id: 3
        },
        {
            habit_name: 'Commerci',
            days_completed: 2,
            client_id: 3
        },
        {
            habit_name: 'Check my email',
            days_completed: 1,
            client_id: 2
        },
        {
            habit_name: 'Work on my css',
            days_completed: 3,
            client_id: 2
        },
        {
            habit_name: 'Complete datastructures practice',
            days_completed: 2,
            client_id: 2
        },
        {
            habit_name: 'Farm for a new mount',
            days_completed: 1,
            client_id: 2
        }
        ]
    const expectedUsers = [
        {
            "id": 1,
            "client_name": "portal",
            "user_password": "test1"
        },
        {
            "id": 2,
            "client_name": "petch",
            "user_password": "test2",
        },
        {
            "id": 3,
            "client_name": "byrd",
            "user_password": "test3"
        }
    ]
    const expectedHabits = [
        {
            id: 1,
            habit_name: 'Do the dishes',
            days_completed: 3,
            client_id: 2
        },
        {
            id: 2,
            habit_name: 'Complete a Mythic',
            days_completed: 0,
            client_id: 1
        },
        {
            id: 3,
            habit_name: 'Maple Tour',
            days_completed: 54,
            client_id: 3
        },
        {
            id: 4,
            habit_name: 'Commerci',
            days_completed: 2,
            client_id: 3
        },
        {
            id: 5,
            habit_name: 'Check my email',
            days_completed: 1,
            client_id: 2
        },
        {
            id: 6,
            habit_name: 'Work on my css',
            days_completed: 3,
            client_id: 2
        },
        {
            id: 7,
            habit_name: 'Complete datastructures practice',
            days_completed: 2,
            client_id: 2
        },
        {
            id: 8,
            habit_name: 'Farm for a new mount',
            days_completed: 1,
            client_id: 2
        }
    ]
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after(() => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`GET /clients and /habits`, () => {
        context(`Gets clients from Database`, () => {
            beforeEach(() => {
                helpers.seedTables(db, testUsers, testHabits)})


            it('responds with 200 and all of the users', () => {
                    return supertest(app)
                        .get('/clients')
                        .expect(200, expectedUsers)
            })
        })


            it('responds with 200 and all of the habits', () => {
                return supertest(app)
                    .get('/habits')
                    .expect(200, expectedHabits)
            })

            it('responds with 200 and targeted client', () => {
                const clientId = 2
                return supertest(app)
                    .get(`/clients/${clientId}`)
                    .expect(200, expectedUsers[(clientId - 1)])
            })

            it(`responds with 200 and target habit`, () => {
                const habitId = 3
                return supertest(app)
                    .get(`/habits/${habitId}`)
                    .expect(200, expectedHabits[(habitId - 1)])
            })

            it(`creates a new user, responding with 201 and the new comment`, () => {
            const testUser = {
                client_name: 'testing',
                user_password: 'test1'
            }
            return supertest(app)
                .post('/clients')
                .send(testUser)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('client_name')
                    expect(res.body.client_name).to.eql(testUser.client_name)
                    expect(res.body.user_password).to.eql(testUser.user_password)
                })
                .expect(res =>
                    db
                        .from('clients')
                        .select('*')
                        .where({ client_name: res.body.client_name})
                        .first()
                        .then(row => {
                            expect(row.client_name).to.eql(testUser.client_name)
                            expect(row.user_password).to.eql(testUser.password)
                        })
                    )
                })
        })

            it(`creates a new habit, responding with 201 and the new comment`, () => {
            const testHabit = {
                habit_name: 'test habit',
                days_completed: 1,
                client_id: 1
            }
            return supertest(app)
                .post('/habits')
                .send(testHabit)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('habit_name')
                    expect(res.body.habit_name).to.eql(testHabit.habit_name)
                    expect(res.body.days_completed).to.eql(testHabit.days_completed)
                })
                .expect(res =>
                    db
                        .from('habits')
                        .select('*')
                        .where({ habit_name: res.body.habit_name})
                        .first()
                        .then(row => {
                            expect(row.habit_name).to.eql(testHabit.habit_name)
                            expect(row.days_completed).to.eql(testHabit.days_completed)
                        })
                    )
                })
})