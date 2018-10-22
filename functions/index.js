// const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Keeps track of the length of the 'likes' child list in a separate property.
exports.listcount4 = functions.database
  .ref("/stats/{statid}")
  .onWrite(change => {
    const listRef = change.after.ref.parent;

    console.log(change);
    let increment;
    if (change.after.exists() && !change.before.exists()) {
      sharedRef.push(change.after.data());
    } else if (!change.after.exists() && change.before.exists()) {
      increment = -1;
    } else {
      return null;
    }

    // Return the promise from countRef.transaction() so our function
    // waits for this async event to complete before it exits.
    return db
      .transaction(async (current) => {
        let list = await current.get(listRef).once();
        let count = list.data().count + increment;
        
        return current.update(listRef, { count: count });
      })
      .then(() => {
        return console.log("Counter updated.");
      })
      .catch(e => {
        return console.log("ERROR: Counter not updated.");
      });
  });
//
// // If the number of likes gets deleted, recount the number of likes
// exports.recountlikes = functions.database.ref('/posts/{postid}/likes_count').onDelete((snap) => {
//   const counterRef = snap.ref;
//   const collectionRef = counterRef.parent.child('likes');
//
//   // Return the promise from counterRef.set() so our function
//   // waits for this async event to complete before it exits.
//   return collectionRef.once('value')
//       .then((messagesData) => counterRef.set(messagesData.numChildren()));
// });
