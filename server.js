const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send(`
        <form action="/" method="post">
            <input type="text" name="text" />
            <button type="submit">Submit</button>
        </form>
    `);
});

app.post('/', (req, res) => {
    fs.writeFile('formData.txt', req.body.text, (err) => {
        if (err) throw err;
        myEmitter.emit('dataSaved');
        res.send('Data saved successfully');
    });
});

myEmitter.on('dataSaved', () => {
    fs.readFile('formData.txt', 'utf8', (err, data) => {
        if (err) throw err;
        console.log(data);
    });
});

app.listen(3000, () => console.log('Server is running on port 3000'));