const path = require('path')
const express = require('express')
const xss = require('xss')
const logger = require('../logger')
const HabitsService = require('./habits-service')
const bodyParser = express.json()
const habitsRouter = express.Router();

const serializeHabit = habit => ({
    id: habit.id,
    name: xss(habit.habit_name),
    days_completed: xss(habit.days_completed),
    client_id: (habit.client_id)
})

habitsRouter
    .route('/habits')
    .get((req, res, next) => {
        HabitsService.getAllHabits(req.app.get('db'))
        .then(habits => {
            res.json(habits.map(serializeHabit))
        })
        .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        for (const field of ['habit_name', 'days_completed', 'client_id'])
        if(!req.body[field]) {
            logger.error(`${field} is required`)
            return res.status(400).send({
                error: { message: `'${field} is required`}
            })
        }
        const { habit_name, days_completed, client_id } = req.body

        const newHabit = { habit_name, days_completed, client_id }

        HabitsService.insertHabit(
            req.app.get('db'),
            newHabit
        )
            .then(habit => {
                logger.info(`Habit with id ${habit.id} created`)
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${habit.id}`))
                    .json(serializeHabit(habit))
            })
            .catch(next)
    })

habitsRouter
    .route('/habits/:habit_id')
    .all((req, res, next) => {
        const { habit_id } = req.params
        HabitsService.findById(req.app.get('db'), habit_id)
            .then(habit => {
                if(!habit) {
                    logger.error(`Habit with id ${habit_id} not found.`)
                    return res.status(404).json({
                        error: { message: `Habit Not Found`}
                    })
                }
                res.habit = habit
                next()
            })
            .catch(next)
    })
    .get((req, res) => {
        res.json(serializeHabit(res.habit))
    })
    .delete((req, res, next) => {
        const { habit_id } = req.params
        HabitsService.deleteNote(
            req.app.get('db'),
            habit_id
        )
            .then(numRowsAffected => {
                logger.info(`Habit with id ${habit_id} deleted.`)
                res.status(204).json({});
            })
            .catch(next)
    })

module.exports = habitsRouter