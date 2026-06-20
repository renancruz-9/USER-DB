import 'dotenv/config'

import swaggerAutogem from "swagger-autogen"

const doc = {
    info: {
        title: "Minha API",
        description: "uma simples API para o gerenciamento de usuarios",
    }, 
    host: "localhost:" + process.env.SERVER_PORT,
    scremes: ['http']
}

const outputfile = './swagger-output.json'
const routes = ['./src/server.js']
swaggerAutogem()(outputfile, routes , doc)
