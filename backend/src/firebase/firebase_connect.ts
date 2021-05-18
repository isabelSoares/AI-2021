import * as admin from 'firebase-admin';
import 'firebase/auth';

// Load Firebase Database Keys
var serviceAccount = require("../../keys/firebase.json");

// ====================== INITIALIZE FIREBASE ======================
var firebaseConfig = {
    apiKey: "AIzaSyCK1LsPeN6-muuM4HZbqM5tuFS_KljMPa4",
    authDomain: "smarthome-7298f.firebaseapp.com",
    projectId: "smarthome-7298f",
    storageBucket: "smarthome-7298f.appspot.com",
    messagingSenderId: "1009618421285",
    appId: "1:1009618421285:web:96e14fb61688964785a1cc",
    measurementId: "G-TN83768QQX",
    credential: admin.credential.cert(serviceAccount)
};
admin.initializeApp(firebaseConfig);

const db = admin.firestore();


export async function get_reference(collection : string, document : string) : Promise<FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>> {
    return await db.doc(collection + '/' + document);
}

export async function get_all_references(collection : string) : Promise<FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>> {
    return await db.collection(collection).get();
}

export async function get_document(collection : string, document : string) : Promise<FirebaseFirestore.DocumentData | undefined> {
    let snapshot = await db.doc(collection + '/' + document).get();
    return snapshot.data();
}
  
export async function change_document(collection : string, document : string, values_to_change : any) : Promise<void> {
    await db.doc(collection + '/' + document).update(values_to_change);
}

export async function create_document(collection : string, data: any) : Promise<FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>> {
    let reference = await db.collection(collection).doc();
    await reference.set(data);
    return reference;
}

export async function create_document_with_id(collection : string, id : string, data: any) : Promise<FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>> {
    let reference = await db.collection(collection).doc(id);
    await reference.set(data);
    return reference;
}

export async function get_user_from_email(user_email : string) : Promise<admin.auth.UserRecord> {
    let user = await admin.auth().getUserByEmail(user_email);
    return user;
}