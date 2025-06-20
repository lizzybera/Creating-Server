import fs from 'fs'
import path from 'path'
import os from "os"
import http, { METHODS } from "http"
import { json } from 'stream/consumers';

console.log("");


// // read a file
// fs.readFile('./random.txt', "utf8", (err:any, data : string) => {
//     if (err) {
//         console.log(err);
//         return;
//     }

//     console.log("data: ", data);
// })

// // write in a file
// try {
//     fs.writeFileSync('./write', "Hello Backend engr, This is node")
// } catch (error) {
//     console.log(error);
// }


// const pathoffile = path.join(__dirname, 'public', "./write.txt")
// console.log("pathoffile: ", pathoffile);


// // console.log(os.cpus());



// creating a server
const port: number = 5690
const port2: number = 5000

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => {
    if (req.url === "/hello") {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("welcome to Node.js")
    } else {
        res.writeHead(404)
        res.end("Data Not found")
    }
})

interface user {
    id: number;
    name: string
}

let users: user[] = [{ id: 1, name: "liz" }, { id: 2, name: "Daniel" }]

const server2 = http.createServer((req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => {
    if (req.url === "/users") {
        res.end(JSON.stringify(users))
        return
    }

    // create a user
    if (req.method === 'POST' && req.url === '/create') {
        let body = ''

        req.on('data', chunk => {
            body += chunk
        })

        req.on('end', () => {
            try {
                const data = JSON.parse(body)
                const newUser: user = {
                    id: users.length + 1,
                    name: data.name
                }

                users.push(newUser)

                res.writeHead(201, { 'Content-Type': 'application/json' })

                res.end(JSON.stringify(users))
            } catch (err) {
                res.writeHead(404, { 'Content-Type': 'application/json' })

                res.end(JSON.stringify({ error: "Not Found" }))
            }
        })
    }

    // login
    if (req.method === "POST", req.url === "/login") {
        let body = ''
        try {
            req.on('data', chunk => {
                body += chunk
            })

            req.on("end", () => {
                const data = JSON.parse(body)

                let check = users.map((el) => {
                    return el
                }).filter((el) => {
                    return el.name === data.name
                })
                if (check.length === 0) {
                    res.writeHead(404, { 'Content-Type': 'application/json' })

                    res.end(JSON.stringify({ error: "Not Found" }))
                }else{
                    res.writeHead(201, { 'Content-Type': 'application/json' })

                    res.end(`Welcome ${data.name}`)
                }
            })
        } catch (error) {
            res.writeHead(404, { 'Content-Type': 'application/json' })

            res.end(JSON.stringify({ error: "Not Found" }))
        }
    }
})

// listen to the server on port
server.listen(port, () => {
    console.log(`Server is listening ${port}`);
})

server2.listen(port2, () => {
    console.log(`Server is listening on ${port2}`);
})

