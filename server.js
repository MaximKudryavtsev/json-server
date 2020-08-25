const jsonServer = require('json-server')
const low = require('lowdb')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

server.use(middlewares)

server.use(jsonServer.bodyParser)
server.use("/users", (req, res, next) => {
    if (req.method === 'POST') {
        const data = req.body;
        db.get("users").push({
            name: data.name,
            username: data.username,
            email: data.email,
            password: data.password
        }).write();
        res.jsonp({
            success: true
        });
    }
    // Continue to JSON Server router
    next()
})

server.use(router)
server.listen(3002, () => {
    console.log('JSON Server is running')
})