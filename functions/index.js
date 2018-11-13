const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// // Keeps track of the length of the 'likes' child list in a separate property.
// exports.statcount = functions.firestore
//   .document("/lists/{listId}/list_items/{itemId}") // TODO WARNING INFINITE LOOP!
//   .onUpdate((change, context) => {
//     if (!change.after.exists) {
//       return null;
//     }
//     if (change.after.data().log.length <= change.before.data().log.length) {
//       return null;
//     }
//     // get data
//     let lastLog = change.after.data().log.pop();
//     let statCount = change.after.data().log;
//
//     // get count
//     let guestAmount = lastLog.count;
//
//     // if checkedIn then + count else - count OR make call on created is maybe better
//     if (lastLog.checkedIn) {
//       statCount += guestAmount;
//     } else {
//       statCount -= guestAmount;
//     }
//     return change.after.ref.update({ statCount: newCount });
//   });

// httpsCallable function to recount the current list due to upload via spreadsheet
// if called, check main-item length and add the listconfig 'add' amount of each shared/add user
// exports.recountItems = functions.https.onCall((data, context) => {
//   return db.runTransaction(transaction => {
//     return transaction.get(listRef).then(list => {
//       let newcount = list.data().count + increment;
//       return transaction.update(listRef, { count: newcount });
//     });
//   });
//
// });

// Keeps track of the length of the current list count in the list config.
exports.listcount = functions.firestore
  .document("/lists/{listId}/list_items/{itemId}")
  .onUpdate((change, context) => {
    if (!change.after.exists) {
      return null;
    }
    let before = Object.keys(change.before.data()).length;
    let after = Object.keys(change.after.data()).length;
    console.log(before, " ", after);

    let increment;
    if (after > before) {
      increment = 1;
    } else if (after < before) {
      increment = -1;
    } else {
      return null;
    }
    // const ref = "/lists/" + context.params.listId;

    const listRef = change.after.ref.parent.parent;

    return db.runTransaction(transaction => {
      return transaction.get(listRef).then(list => {
        let newcount = list.data().count + increment;
        return transaction.update(listRef, { count: newcount });
      });
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
