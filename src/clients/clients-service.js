const ClientsService = {
    getAllClients(knex) {
        return knex.select('*').from('clients')
    },

    getById(knex, id) {
        return knex.from('clients').select('*').where({id}).first()
    },

    insertClient(knex, newClient) {
        return knex
            .insert(newClient)
            .into('clients')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }
}

module.exports = ClientsService