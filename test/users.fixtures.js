

function makeUsersArray() {
    return [
        {
            id: 1,
            client_name: 'portal',
            user_password: 'test1'
        },
        {
            id: 2,
            client_name: 'petch',
            user_password: 'test2'
        },
        {
            id: 3,
            client_name: 'byrd',
            user_password: 'test3'
        }
    ]
}

module.exports = {
    makeUsersArray
}