const path = require('path')
const express = require('express')
const xss = require('xss')
const logger = require('../logger')
const ClientsService = require('./clients-service')
const bodyParser = express.json()
const clientsRouter = express.Router()

const serializeClient = client => ({
    id: client.id,
    client_name: xss(client.client_name),
    user_password: xss(client.user_password)
})

clientsRouter
    .route('/clients')
    .get((req, res, next) => {
        ClientsService.getAllClients(req.app.get('db'))
        .then(clients => {
            res.json(clients.map(serializeClient))
        })
        .catch(next)
    })
    .post(bodyParser, async (req, res, next) => {
        for (const field of ['client_name', 'user_password'])
        if(!req.body[field]) {
            logger.error(`${field} is required`)
            return res.status(400).send({
                error: { message: `'${field} is required`}
            })
        }
        const { client_name, user_password } = req.body

        const newClient = { client_name, user_password }

        ClientsService.insertClient(
            req.app.get('db'),
            newClient
        )
            .then(client => {
                logger.info(`Client with id ${client.id} created`)
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${client.id}`))
                    .json(serializeClient(client))
            })
            .catch(next)
    })

clientsRouter
    .route('/clients/:client_id')
    .all((req, res, next) => {
        const { client_id } = req.params
        ClientsService.getById(req.app.get('db'), client_id)
        .then(client => {
            if(!client) {
                logger.error(`Client with id ${client_id} not found.`)
                return res.status(404).json({
                    error: { message: `Client Not Found`}
                })
            }
            res.client = client
            next()
        })
        .catch(next)
    })
    .get((req,res) => {
        res.json(serializeClient(res.client))
    })

module.exports = clientsRouter