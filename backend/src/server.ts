import express from 'express';
import * as admin from 'firebase-admin';
import { get_all_references, get_document, change_document } from './firebase/firebase_connect';
import { create_root_category } from './log/logger';
let logger = create_root_category('SERVER');

import moment from 'moment';

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

import * as utils from './utils';

// Run Intelligence Module
import IntelligenceModule from './intelligence';
import intelligence from './intelligence';
setInterval(() => IntelligenceModule.process_entry(), 2000);

const app = express();
const port = 8000;

app.use(express.json());

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

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

app.post('/house/:house_id/user/', (req, res) => {

    let house_id = req.params['house_id'];
    let user_email = req.body['user_email'];
    utils.add_house_to_user(house_id, user_email).then((data) => {
        if (data == undefined) res.send("ERROR: House not added to user");
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

app.get('/devices/:user_id', async (req, res) => {

    let user_id = req.params['user_id'];
    let devices = await utils.get_devices(user_id);
    res.send(JSON.stringify(devices));
});

app.get('/device_type/:deviceType_id', (req, res) => {

    let deviceType_id = req.params['deviceType_id'];
    get_document('deviceTypes', deviceType_id).then((data) => {    
        if (data == undefined) res.send("ERROR: DeviceType not found");
        else res.send(JSON.stringify(load_device_type(data)));
    });
});

app.get('/device_type/', async (req, res) => {

    let deviceTypesRefs = await get_all_references("deviceTypes");
    let deviceTypes = deviceTypesRefs.docs.map((deviceTypeDocument) => {
        let deviceTypeData = deviceTypeDocument.data();
        return {'id': deviceTypeDocument.id,'object': load_device_type(deviceTypeData)};
    });

    res.send(JSON.stringify(deviceTypes));
});

app.get('/property/:property_id', (req, res) => {

    let property_id = req.params['property_id'];
    get_document('properties', property_id).then((data) => {
        if (data == undefined) logger.info("ERROR: Property not found");
        else res.send(JSON.stringify(load_property(data)));
    });
});

app.get('/property_value/:property_value_id', (req, res) => {

    let property_value_id = req.params['property_value_id'];
    get_document('propertyValues', property_value_id).then((data) => {
        if (data == undefined) logger.info("ERROR: Property value not found");
        else res.send(JSON.stringify(load_propertyValue(data)));
    });
});

app.get('/schedule/:schedule_id', (req, res) => {

    let schedule_id = req.params['schedule_id'];
    get_document('schedules', schedule_id).then((data) => {
        if (data == undefined) logger.info("ERROR: Schedule not found");
        else res.send(JSON.stringify(load_schedule(data)));
    });
});

app.get('/preference/:preference_id', (req, res) => {

    let preference_id = req.params['preference_id'];
    get_document('preferences', preference_id).then((data) => {
        if (data == undefined) logger.info("ERROR: Preference not found");
        else res.send(JSON.stringify(load_preference(data)));
    });
});

app.get('/value_history/:value_history_id', (req, res) => {

    let value_history_id = req.params['value_history_id'];
    get_document('valuesHistory', value_history_id).then((data) => {
        if (data == undefined) res.send("ERROR: Value History not found");
        else res.send(JSON.stringify(load_valueHistory(data)));
    });
});

// ============================ POST NEW CLASSES ============================

app.post('/house/', (req, res) => {

    utils.add_new_house(req.body['name'], req.body['user_id']).then(data => {
        if (data == undefined) res.send("ERROR: House not created");
        else res.send(JSON.stringify({'id': data.id, 'object': load_house(data.data)}));
    })
});

app.post('/floor/', (req, res) => {

    utils.add_new_floor(req.body['name'], req.body['house_id']).then(data => {
        if (data == undefined) res.send("ERROR: Floor not created");
        else res.send(JSON.stringify({'id': data.id, 'object': load_floor(data.data)}));
    })
});

app.post('/division/', (req, res) => {

    utils.add_new_division(req.body['name'], req.body['floor_id']).then(data => {
        if (data == undefined) res.send("ERROR: Division not created");
        else res.send(JSON.stringify({'id': data.id, 'object': load_division(data.data)}));
    })
});

app.post('/device/', (req, res) => {

    let name : string = req.body['name'];
    let division_id : string = req.body['division_id'];
    let deviceType_id : string = req.body['deviceType_id'];
    let favorite : boolean = req.body['favorite'];
    let propertyValues : { 'property_id': string, 'value': number }[] = req.body['propertyValues'];

    utils.add_new_device(name, division_id, deviceType_id, favorite, propertyValues).then(data => {
        if (data == undefined) res.send("ERROR: Device not created");
        else res.send(JSON.stringify({'id': data.id, 'object': load_device(data.data)}));
    })
});

app.post('/user/', (req, res) => {

    let name : string = req.body['name'];
    let user_id : string = req.body['id'];

    utils.add_new_user(name, user_id).then(data => {
        if (data == undefined) res.send("ERROR: Device not created");
        else res.send(JSON.stringify({'id': data.id, 'object': load_user(data.data)}));
    })
});

// ============================ FAVORITES ============================

app.get('/favorites/:user_id', async (req, res) => {
    
    let favorites = await utils.get_favorite_devices(req.params['user_id']);
    res.send(JSON.stringify(favorites));
});

app.post('/favorites/:device_id', (req, res) => {
    
    let device_id = req.params['device_id'];
    change_document('devices', device_id, { 'favorite': true }).then(() => {
        res.send(JSON.stringify({ msg: 'success' }));
    });
});

app.delete('/favorites/:device_id', (req, res) => {
    
    let device_id = req.params['device_id'];
    change_document('devices', device_id, { 'favorite': false }).then(() => {
        res.send(JSON.stringify({ msg: 'success' }));
    });
});

// ============================ DEAL WITH PROPERTIES ============================

app.post('/property_value/', async (req, res) => {
    let new_id = await utils.change_property_value(req.body['propertyValue_id'], req.body['value']);
    
    if (new_id == undefined) res.send("ERROR: Property Value could not be stored");
    else {
        intelligence.register_value_change(req.body['user_id'], req.body['propertyValue_id'], req.body['value']);
        res.send({'new_id' : new_id});
    }
});

// ============================ DEAL WITH PREFERENCES ============================

app.post('/preference/', async (req, res) => {
    let data = req.body;

    utils.create_preference(data).then((data) => {
        if (data == undefined) logger.info("ERROR: Preference not created");
        else res.send(JSON.stringify({'id': data.id, 'object': load_preference(data.data)}));
    });
});

app.post('/preference/:preference_id', async (req, res) => {
    let preference_id = req.params['preference_id'];
    let data = req.body;
    utils.update_preference(preference_id, data).then((data) => {
        if (data == undefined) logger.info("ERROR: Preference not updated");
        else res.send(JSON.stringify(load_preference(data)));
    });
});

app.post('/preference/:preference_id/accept', async (req, res) => {
    let preference_id = req.params['preference_id'];
    await change_document('preferences', preference_id, { 'pendent': false });
    res.send({ msg: 'success' });
});

app.post('/preference/:preference_id/reject', async (req, res) => {
    let preference_id = req.params['preference_id'];
    await utils.reject_preference(preference_id);
    res.send({ msg: 'success' });
});

app.post('/preference/:preference_id/deactivate', async (req, res) => {
    let preference_id = req.params['preference_id'];

    let delayTo = moment().add(1, 'days').toDate();
    let data = { 'deactivated': admin.firestore.Timestamp.fromDate(delayTo) }
    await change_document('preferences', preference_id, data);
    res.send({ msg: 'success' });
});

app.post('/preference/:preference_id/apply', async (req, res) => {
    let preference_id = req.params['preference_id'];
    
    await utils.apply_preference(preference_id);
    res.send({ msg: 'success' });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});