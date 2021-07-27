const HabitsService = {
    getAllHabits(knex) {
        return knex.select('*').from('habits')
    },

    findById(knex, id) {
        return knex.from('habits').select('*').where({id}).first()
    },

    insertHabit(knex, newHabit) {
        return knex
            .insert(newHabit)
            .into('habits')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    
    deleteHabit(knex, id) {
        return knex('habits')
            .where({ id })
            .delete()
    },


}

module.exports = HabitsService