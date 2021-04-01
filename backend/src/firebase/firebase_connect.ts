import * as admin from 'firebase-admin';

// Load Firebase Database Keys
var serviceAccount = require("../../keys/firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Load Users
export async function get_document(collection : string, document : string) : Promise<FirebaseFirestore.DocumentData | undefined> {
    let snapshot = await db.doc(collection + '/' + document).get();
    return snapshot.data();
}
