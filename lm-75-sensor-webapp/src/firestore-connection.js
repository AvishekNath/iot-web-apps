import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { createRandomData, addDataPoint, getCurrentTimeUTC} from './utils/data-helpers';

const connectToFireStore = (projectId = 0, keyFilePath = '') => {
    // const firestore = new Firestore({
    //     projectId: projectId || 'avid-keel-233206',
    //     keyFilename: keyFilePath || './api-key.json'
    // });
    // //console.log(firestore);
    // const document = firestore.doc('users/IOT');
    // console.log(document);
    // // document.get().then(doc => {
    // //     // Document read successfully.
    // //     console.log(doc);
    // // });
 
    // // document.set({
    // //     country: 'SA',
    // //     name: 'Ashok',
    // //     project: 'IOT'
    // //   }).then((doc) => {
    // //       console.log(doc);
    // //     // Document created successfully.
    // //   });

    // document.get()
    // .then((docSnapshot) => {
    //     if (docSnapshot.exists) {
    //         document.onSnapshot((doc) => {
    //            console.log(doc);
    //         });
    //     } else {
    //         console.log(document);
    //     }
    // });

};

const addToDatabase = (database, data, callback) => {
    database.add(data)
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
};

const getDocument = (docRef) => {
    // Get a document
    docRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
};

const subscribeForRealTimeUpdatesOnDocument = (dbName) => {
    dbName.doc("IOT")
    .onSnapshot(function(doc) {
        console.log("Current data: ", doc.data());
    });
};

const subscribeForRealTimeUpdatesOnDatabase = (dbName, callback) => {
    // dbName
    // .onSnapshot(function(querySnapshot) {
    //     querySnapshot.forEach(function(doc) {
    //         console.log("snapshot added ", doc)
    //     });
    // });

    dbName.get().then(res => {  
        console.log('Size:', res.size);
    });
    var now = new Date().getTime();

    dbName
    .onSnapshot(function(querySnapshot){
        querySnapshot.docChanges().forEach(function(change){

            //console.log('Firestore Data :->', change.doc.data());
        if (
            change.type === "added"  &&
            ( change.doc._document.version.timestamp.seconds === 0 || 
                now < (change.doc._document.version.timestamp.seconds * 1000)) 
        ) {
            //console.log("added", change.doc.data());
            callback && callback(change.doc.data());
        }
        if (change.type === "modified") {
            console.log("modified", "Modified city: ", change.doc.data());
        }
    }); 
});
};

const makeid = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
};

const generateRandomTemperature = (db) => {

    setInterval(()=>{
        addToDatabase(db.collection("thing_point_0000000024c500f6"), {            
            temperature: Math.floor(Math.random() * 51),
            timestamp: getCurrentTimeUTC(Date.now())
        });
    }, 10000);

};
  

const connectUsingFirebase = (collectionName = '') => {
    // Initialize Cloud Firestore through Firebase
        let config = {
            apiKey: "AIzaSyBe1BUlEB2UToiRzm7jkuYdh85C7YlCZDs",
            authDomain: "avid-keel-233206.firebaseapp.com",
            projectId: "avid-keel-233206",
            storageBucket: "",
            messagingSenderId: ""
        };

    !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();

    //console.log(firebase.name);
    var db = firebase.firestore();
    //var docRef = db.collection("users").doc("IOT");   
    
    // Add a new document with a generated ids  
    //generateRandomTemperature(db);
    
    // addToDatabase(db.collection("users"), {
    //     country : makeid(),
    //     name: makeid(),
    //     project: makeid()
    // });

    //generateRandomTemperature(db);

    //subscribeForRealTimeUpdatesOnDatabase(db.collection("users"));

    return db;
    //
    //subscribeForRealTimeUpdatesOnDocument(db.collection("users"));
    //Get Document Data
    //getDocument(docRef);
    
};
 
export {connectToFireStore, connectUsingFirebase, generateRandomTemperature, subscribeForRealTimeUpdatesOnDatabase};
