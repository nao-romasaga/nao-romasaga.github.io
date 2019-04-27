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

var REF;
var UID;
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        database = firebase.database();
        UID = user.uid;
        REF = database.ref('user_data/' + UID);
        console.log(REF);
    } else {
    }
});

function readFile(target, callback) {
    return firebase.database().ref(`game_data/${target}`).once("value").then(function (snapshot) {
        return callback(snapshot.val());
    });
}

function readCharData(charId, callback) {
    return firebase.database().ref(`user_data/${UID}/${charId}`).once("value").then(function (snapshot) {
        return callback(snapshot.val());
    });
}
function updateCharData(data) {
    if (REF !== undefined) {
        REF.update(data);
    }
}

function getImgUrl(target) {
    let url = "https://nao-romasaga.github.io/img/" + target;
    return 'background:url(' + url + ') no-repeat;'
}


