import express from "express";
import cors from 'cors';
import fs from 'fs';
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';

// const cors = require('cors');
const port = 3000;
const app = express();

const corsOptions = {
    origin: 'https://nimble-test-sand.vercel.app',
    optionsSuccessStatus: 200,
};

const jsonUrl = './test_data.json';

// Use CORS middleware
app.use(cors(corsOptions));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/', (req, res) => {
    res.send('Welcome to my server!');
    console.log('Hello');
});

app.get('/contacts', (req, res) => {
    console.log('get contacts')
    fs.readFile(jsonUrl, (err, data) => {
        if (err) {
            // logging the error
            console.error(err);

            throw err;
        }
        // res.send(data);
        res.status(200).send(data);
    })
});

app.post('/contact', (req, res) => {
    const jsonUrl = './test_data.json';
    const formData = {
        ...req.body,
        uuid: uuidv6(),
        avatar_url: 'https://cdn.discordapp.com/attachments/390070388798783498/1067106811129380944/Sorumond_mage_raccoon_read_the_book_01a7962a-7258-4cf3-8ba4-23f7d7ccccce.png?ex=66b2ece9&is=66b19b69&hm=7d4d90190eea4e31ffdde78039165e5de5468a145e80772f16337f180301d403&',
        tags: []
    }

    fs.readFile(jsonUrl, (err, data) => {
        if (err) {
            // logging the error
            console.error(err);

            throw err;
        }

        let jsonData = JSON.parse(data);

        if (jsonData.users) {
            jsonData.users.push(formData);
        } else {
            jsonData.users = [];
            jsonData.users.push(formData);
        }


        fs.writeFile(jsonUrl, JSON.stringify(jsonData), (error) => {
            // throwing the error
            // in case of a writing problem
            if (error) {
                // logging the error
                console.error(error);

                throw error;
            }
            console.log('test.json saved correctly');
            res.status(200).send();
        });
    });
});

app.get('/contact/:id', (req, res) => {
    const jsonUrl = './test_data.json';
    const id = req.params.id;

    fs.readFile(jsonUrl, (err, data) => {
        if (err) {
            // logging the error
            console.error(err);

            throw err;
        }

        let jsonData = JSON.parse(data);
        jsonData.users = jsonData.users.filter((user) => {
            return user.uuid == id;
        });
        res.status(200).send(JSON.stringify(jsonData));
    });
});

app.delete('/contact/:id', (req, res) => {
    const jsonUrl = './test_data.json';
    const id = req.params.id;

    fs.readFile(jsonUrl, (err, data) => {
        if (err) {
            // logging the error
            console.error(err);

            throw err;
        }

        let jsonData = JSON.parse(data);
        jsonData.users = jsonData.users.filter((user) => {
            return user.uuid != id;
        });
        fs.writeFile(jsonUrl, JSON.stringify(jsonData), (error) => {
            // throwing the error
            // in case of a writing problem
            if (error) {
                // logging the error
                console.error(error);

                throw error;
            }

            console.log('test.json saved correctly');
            res.status(200).send();
        });
    });
});

app.put('/contact/:id/tags', (req, res) => {
    const jsonUrl = './test_data.json';
    const id = req.params.id;

    console.log(`put: ${id}`);
    fs.readFile(jsonUrl, (err, data) => {
        if (err) {
            // logging the error
            console.error(err);

            throw err;
        }

        let jsonData = JSON.parse(data);

        jsonData.users = jsonData.users.map((user) => {
            if (user.uuid === id) {
                user.tags = req.body.tags;
            }
            return user;
        });


        fs.writeFile(jsonUrl, JSON.stringify(jsonData), (error) => {
            // throwing the error
            // in case of a writing problem
            if (error) {
                // logging the error
                console.error(error);

                throw error;
            }
            console.log('tag put correctly');
            res.status(200).send();
        });
    });
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});