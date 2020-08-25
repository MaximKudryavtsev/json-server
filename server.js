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
server.use("/users", (req, res) => {
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
})

server.use("/login", (req, res) => {
    if (req.method === 'POST') {
        const data = req.body;
        const user = db.get('users')
            .find({ email: data.email, password: data.password })
            .value()
        if (user) {
            res.jsonp({
                success: true
            });
        } else {
            res.sendStatus(404).jsonp({
                success: false,
                message: "User not found"
            })
        }
    }
})

server.use(router)
server.listen(3002, () => {
    console.log('JSON Server is running')
})