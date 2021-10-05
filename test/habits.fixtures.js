function makeHabitsArray() {
    return [
        {
            id: 1,
            habit_name: 'Do the dishes',
            days_completed: 3,
            client_id: 2
        },
        {
            id: 2,
            habit_name: 'Complete a Mythic',
            days_completed: 1,
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
            days_completed: 3,
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
}

module.exports = {
    makeHabitsArray
}