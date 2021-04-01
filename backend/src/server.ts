import express from 'express'
import { get_document } from './firebase/firebase_connect'
import { create_root_category } from './log/logger'
let logger = create_root_category('SERVER');

// Classes
import { load_user } from './classes/User'

const app = express();
const port = 8000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});

get_document('users', '3oj0mqDbQTzFawTi26UBs').then((data) => {

    if (data == undefined) logger.info("User not found");
    else console.log(load_user(data));

});