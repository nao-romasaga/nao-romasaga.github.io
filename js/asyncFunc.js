async function asyncReadUserDataWithId(target, id, callback, goOffline) {
    if (goOffline) {
        console.log("GO ONLINE");
        firebase.database(appUsers).goOnline();
    }
    return firebase.database(appUsers).ref(`user_data/${UID}/${target}/${id}`).once("value").then(function (snapshot) {
        if (goOffline) {
            console.log("GO OFFLINE");
            firebase.database(appUsers).goOffline();
        }
        return callback(snapshot.val());
    });
}