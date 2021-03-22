var admin = require("firebase-admin");

var serviceAccount = require("../keys/firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

db.collection('users').get().then((snapshot) => {
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
});

const docRef = db.collection('users').doc()
docRef.set({
    name: "Teste2 - Name"
});