import * as admin from 'firebase-admin';

// Load Firebase Database Keys
var serviceAccount = require("../../keys/firebase.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


export async function get_reference(collection : string, document : string) : Promise<FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>> {
    return await db.doc(collection + '/' + document);
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
