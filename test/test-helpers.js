function makeUsersArray() {
    return [
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
}
function makeHabitsArray() {
     [
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
}



function makeDataFixtures() {
    const testUsers = makeUsersArray()
    const testHabits = makeHabitsArray()
    return { testUsers, testHabits }
}

function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
        `TRUNCATE
          clients,
          habits
        `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE clients_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE habits_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('clients_id_seq', 0)`),
          trx.raw(`SELECT setval('habits_id_seq', 0)`),
        ])
      )
    )
  }

function seedTables(db, clients, habits) {
    return db.transaction(async trx => {
        await trx.into('clients').insert(clients)
        await trx.into('habits').insert(habits)
        await Promise.all([
            trx.raw(
                `SELECT setval('habits_id_seq', ?)`,
                [clients[clients.length - 1].id],
            ),
            trx.raw(
                `SELECT setval('habits_id_seq', ?)`,
                [habits[habits.length - 1].id],
            ),
        ])
    })
}


module.exports = {
    makeUsersArray,
    makeHabitsArray,
    makeDataFixtures,
    cleanTables,
    seedTables
}