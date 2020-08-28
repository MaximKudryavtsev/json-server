const jsonServer = require('json-server')
const low = require('lowdb')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const FileSync = require('lowdb/adapters/FileSync')
const lodash = require("lodash");

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


server.get("/posts/:id/comments", (req, res) => {
    const data = db.get("comments").value();
    const comments = data.filter((item) => item.postId === Number(req.params.id))
    res.jsonp(comments);
})

server.get("/posts/:id", (req, res) => {
    const data = db.get("posts").find({id: Number(req.params.id)}).value();
    res.jsonp(data);
})

server.get("/users/:id", (req, res) => {
    const data = db.get("users").find({id: Number(req.params.id)}).value();
    res.jsonp(data);
})

server.get("/albums/:id/photos", (req, res) => {
    const data = db.get("photos").value();
    const photos = data.filter((item) => item.albumId === Number(req.params.id))
    res.jsonp(photos);
})

server.get("/users/:id/albums", (req, res) => {
    const data = db.get("albums").value();
    const albums = data.filter((item) => item.userId === Number(req.params.id))
    res.jsonp(albums);
})

server.get("/users/:id/todos", (req, res) => {
    const data = db.get("todos").value();
    const todos = data.filter((item) => item.userId === Number(req.params.id))
    res.jsonp(todos);
})

server.get("/users/:id/posts", (req, res) => {
    const data = db.get("posts").value();
    const posts = data.filter((item) => item.userId === Number(req.params.id));
    res.jsonp(posts);
})

server.use("/posts/:id", (req, res) => {
    if (req.method === 'DELETE') {
        const posts = db.get("posts").value();
        const index = lodash.findIndex(posts, (item) => item.id === Number(req.params.id));
        posts.splice(index, 1);
        db.get("posts")
            .push([...posts])
            .write()
        res.jsonp({
            success: true
        });
    }
})

server.use("/posts/:id", (req, res) => {
    if (req.method === 'PUT') {
        const posts = db.get("posts").value();
        const index = lodash.findIndex(posts, (item) => item.id === Number(req.params.id));
        posts[index] = {id: Number(req.params.id), ...req.body}
        db.get("posts")
            .push([...posts])
            .write()
        res.jsonp({
            success: true
        });
    }
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
                success: true,
                data: {
                    user
                }
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