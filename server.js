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

server.get("/users", (req, res) => {
    const data = db.get("users").value();
    res.jsonp(data);
})

server.get("/posts", (req, res) => {
    const data = db.get("posts").value();
    res.jsonp(data);
})

server.get("/comments", (req, res) => {
    const data = db.get("comments").value();
    res.jsonp(data);
})

server.get("/albums", (req, res) => {
    const data = db.get("albums").value();
    res.jsonp(data);
})

server.get("/photos", (req, res) => {
    const data = db.get("photos").value();
    res.jsonp(data);
})

server.get("/todos", (req, res) => {
    const data = db.get("todos").value();
    res.jsonp(data);
})


server.get("/posts/:id", (req, res) => {
    const data = db.get("posts").find({id: Number(req.params.id)}).value();
    res.jsonp(data);
})

server.get("/posts/:id/comments", (req, res) => {
    const data = db.get("comments").find({postId: Number(req.params.id)}).value();
    res.jsonp(data);
})

server.get("/users/:id", (req, res) => {
    const data = db.get("users").find({id: Number(req.params.id)}).value();
    res.jsonp(data);
})

server.get("/albums/:id/photos", (req, res) => {
    const data = db.get("photos").find({albumId: Number(req.params.id)}).value();
    res.jsonp(data);
})

server.get("/users/:id/albums", (req, res) => {
    const data = db.get("albums").find({userId: Number(req.params.id)}).value();
    res.jsonp(data);
})

server.get("/users/:id/todos", (req, res) => {
    const data = db.get("todos").find({userId: Number(req.params.id)}).value();
    res.jsonp(data);
})

server.get("/users/:id/posts", (req, res) => {
    const data = db.get("posts").find({userId: Number(req.params.id)}).value();
    res.jsonp(data);
})

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
            res.status(404).jsonp({
                success: false,
                message: "User not found"
            })
        }
    }
})

server.use("/posts", (req, res) => {
    if (req.method === 'POST') {
        const data = req.body;
        const posts = db.get("posts").value()
        db.get('posts')
            .push({ ...data, id: Number(posts[posts.length - 1].id) + 1 })
            .write()
        res.jsonp({
            success: true
        });
    }
})

server.use("/comments", (req, res) => {
    if (req.method === 'POST') {
        const data = req.body;
        db.get(`posts/${data.postId}/comments`)
            .push({ ...data })
            .write()
        res.jsonp({
            success: true
        });
    }
})

server.use(router)
server.listen(3002, () => {
    console.log('JSON Server is running')
})