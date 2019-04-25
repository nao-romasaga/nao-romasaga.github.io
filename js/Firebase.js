var config = {
    apiKey: "AIzaSyCKpg76hjQg4YNSW3hGEw5uCJOBbQNUsnQ",
    databaseURL: "https://nao-romasaga-rs.firebaseio.com",
    storageBucket: "nao-romasaga-rs.appspot.com",
};
var configTmp = {
    apiKey: "AIzaSyBliZfwz-xZnVtIZmeAQv0uo2IgmL5eUKM",
    databaseURL: "https://nao-romasaga-rs-blue.firebaseio.com",
    storageBucket: "nao-romasaga-rs-blue.appspot.com",
};
    
firebase.initializeApp(configTmp);
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
    let url = "https://nao-romasaga.github.io/img/" + target;
    return 'background:url(' + url + ') no-repeat;'
}


