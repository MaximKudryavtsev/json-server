const jsonServer = require('json-server')
const low = require('lowdb')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

server.post("/users", (req, res) => {
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

})

server.use(middlewares)
server.use(router)
server.listen(3002, () => {
    console.log('JSON Server is running')
})