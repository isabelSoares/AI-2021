import express from 'express'
import { get_document } from './firebase/firebase_connect'
import { create_root_category } from './log/logger'
let logger = create_root_category('SERVER');

// Classes
import { load_user } from './classes/User'
import { load_house } from './classes/House'
import { load_floor } from './classes/Floor'
import { load_division } from './classes/Division'
import { load_device } from './classes/Device'
import { load_device_type } from './classes/DeviceType'
import { load_property } from './classes/Property'
import { load_propertyValue } from './classes/PropertyValue'
import { load_schedule } from './classes/Schedule'
import { load_preference } from './classes/Preference'
import { load_valueHistory } from './classes/ValueHistory'

const app = express();
const port = 8000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/user/:user_id', (req, res) => {

    let user_id = req.params['user_id'];
    get_document('users', user_id).then((data) => {    
        if (data == undefined) res.send("ERROR: User not found");
        else res.send(JSON.stringify(load_user(data)));
    });
});


app.get('/house/:house_id', (req, res) => {

    let house_id = req.params['house_id'];
    get_document('houses', house_id).then((data) => {    
        if (data == undefined) res.send("ERROR: House not found");
        else res.send(JSON.stringify(load_house(data)));
    });
});

app.get('/floor/:floor_id', (req, res) => {

    let floor_id = req.params['floor_id'];
    get_document('floors', floor_id).then((data) => {    
        if (data == undefined) res.send("ERROR: Floor not found");
        else res.send(JSON.stringify(load_floor(data)));
    });
});

app.get('/division/:division_id', (req, res) => {

    let division_id = req.params['division_id'];
    get_document('divisions', division_id).then((data) => {    
        if (data == undefined) res.send("ERROR: Division not found");
        else res.send(JSON.stringify(load_division(data)));
    });
});

app.get('/device/:device_id', (req, res) => {

    let device_id = req.params['device_id'];
    get_document('devices', device_id).then((data) => {    
        if (data == undefined) res.send("ERROR: Devices not found");
        else res.send(JSON.stringify(load_device(data)));
    });
});

app.get('/deviceType/:deviceType_id', (req, res) => {

    let deviceType_id = req.params['deviceType_id'];
    get_document('deviceTypes', deviceType_id).then((data) => {    
        if (data == undefined) res.send("ERROR: DeviceType not found");
        else res.send(JSON.stringify(load_device_type(data)));
    });
});

app.get('/property/:property_id', (req, res) => {

    let property_id = req.params['property_id'];
    get_document('properties', property_id).then((data) => {
        if (data == undefined) logger.info("ERROR: Property not found");
        else console.log(load_property(data));
    });
});

app.get('/property_value/:property_value_id', (req, res) => {

    let property_value_id = req.params['property_value_id'];
    get_document('propertyValues', property_value_id).then((data) => {
        if (data == undefined) logger.info("ERROR: Property value not found");
        else console.log(load_propertyValue(data));
    });
});

app.get('/schedule/:schedule_id', (req, res) => {

    let schedule_id = req.params['schedule_id'];
    get_document('schedules', schedule_id).then((data) => {
        if (data == undefined) logger.info("ERROR: Schedule not found");
        else console.log(load_schedule(data));
    });
});

app.get('/preference/:preference_id', (req, res) => {

    let preference_id = req.params['preference_id'];
    get_document('preferences', preference_id).then((data) => {
        if (data == undefined) logger.info("ERROR: Preference not found");
        else console.log(load_preference(data));
    });
});

app.get('/value_history/:value_history_id', (req, res) => {

    let value_history_id = req.params['value_history_id'];
    get_document('valuesHistory', value_history_id).then((data) => {
        if (data == undefined) res.send("ERROR: Value History not found");
        else console.log(load_valueHistory(data));
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});