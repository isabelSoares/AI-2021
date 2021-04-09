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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});

get_document('users', '3oj0mqDbQTzFawTi26UB').then((data) => {
    if (data == undefined) logger.info("User not found");
    else console.log(load_user(data));
});

get_document('houses', 'jYvO33oDVt5Yvjzr85zw').then((data) => {
    if (data == undefined) logger.info("House not found");
    else console.log(load_house(data));
});

get_document('floors', 'MqV7cGu4w8HtIM8uAGGx').then((data) => {
    if (data == undefined) logger.info("Floor not found");
    else console.log(load_floor(data));
});

get_document('divisions', '6HInKUX9PSvTNtUkodL9').then((data) => {
    if (data == undefined) logger.info("Division not found");
    else console.log(load_division(data));
});

get_document('devices', '3NBwsKco8OaoI35fApiF').then((data) => {
    if (data == undefined) logger.info("Device not found");
    else console.log(load_device(data));
});

get_document('deviceTypes', '5NCLAgikh9J0nMGbd4nv').then((data) => {
    if (data == undefined) logger.info("Device type not found");
    else console.log(load_device_type(data));
});

get_document('properties', 'XvHCO36UODyT6e7lxhDQ').then((data) => {
    if (data == undefined) logger.info("Property not found");
    else console.log(load_property(data));
});

get_document('properties', 'Psw565S3N2c51YxW6Yoq').then((data) => {
    if (data == undefined) logger.info("Property not found");
    else console.log(load_property(data));
});

get_document('propertyValues', 'FTQV1ayQgCpZPxFojRBm').then((data) => {
    if (data == undefined) logger.info("Property value not found");
    else console.log(load_propertyValue(data));
});

get_document('schedules', '7LFCa8e6Kjf8dPfBP3W4').then((data) => {
    if (data == undefined) logger.info("Schedule not found");
    else console.log(load_schedule(data));
});

get_document('preferences', '4oL7ztZJp2mw6qht6TQn').then((data) => {
    if (data == undefined) logger.info("Preference not found");
    else console.log(load_preference(data));
});

get_document('valuesHistory', 'AwkPtdpr0N2sYCUtmcQp').then((data) => {
    if (data == undefined) logger.info("Value history not found");
    else console.log(load_valueHistory(data));
});