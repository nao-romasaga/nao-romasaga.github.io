var config = {
    apiKey: "AIzaSyDQu_mik-suR6L4OzPM7gbqc9Pimt1NZ68",
    databaseURL: "https://nao-romasaga-rs-dev.firebaseio.com",
    storageBucket: "nao-romasaga-rs-dev.appspot.com",
};

firebase.initializeApp(config);
firebase.auth().signInAnonymously().catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
});
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        // ...
    } else {
        // User is signed out.
        // ...
    }
    // ...
});

function readFile(target, callback) {
    return firebase.database().ref(target).once("value").then(function (snapshot) {
        return callback(snapshot.val());
    });
}

function getImgUrl(target) {
//    return "https://nao-romasaga.github.io/img/";
    let url = "https://nao-romasaga.github.io/img/" + target;
    return 'background:url(' + url + ') no-repeat;'

}


