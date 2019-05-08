var configGreen = {
    apiKey: "AIzaSyCKpg76hjQg4YNSW3hGEw5uCJOBbQNUsnQ",
    databaseURL: "https://nao-romasaga-rs.firebaseio.com",
    authDomain: "nao-romasaga-rs.firebaseapp.com",
    storageBucket: "nao-romasaga-rs.appspot.com",
};
var configBlue = {
    apiKey: "AIzaSyBliZfwz-xZnVtIZmeAQv0uo2IgmL5eUKM",
    databaseURL: "https://nao-romasaga-rs-blue.firebaseio.com",
    authDomain: "nao-romasaga-rs-blue.firebaseapp.com",
    storageBucket: "nao-romasaga-rs-blue.appspot.com",
};    
firebase.initializeApp(configGreen);

var REF;
var UID;
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        database = firebase.database();
        UID = user.uid;
        REF = database.ref('user_data/' + UID);
        $(".RequireLoginMenu").removeClass("d-none");
    } else {
    }
});
function readFile(target, callback) {
    return firebase.database().ref(`game_data`).once("value").then(function (snapshot) {
        return callback(snapshot.val()[target]);
    });
}
function readAnalyzeFile(target, callback) {
    return firebase.database().ref(`analyze_data/${target}`).once("value").then(function (snapshot) {
        return callback(snapshot.val());
    });
}
function readCharData(charId, callback) {
    return firebase.database().ref(`user_data/${UID}/CHAR/${charId}`).once("value").then(function (snapshot) {
        return callback(snapshot.val());
    });
}
function readPartyData(callback) {
    return firebase.database().ref(`user_data/${UID}/PARTY`).once("value").then(function (snapshot) {
        return callback(snapshot.val());
    });
}
function readStyleCheckData(callback) {
    return firebase.database().ref(`user_data/${UID}/STYLECHECK`).once("value").then(function (snapshot) {
        return callback(snapshot.val());
    });
}
function updateData(key, data) {
    if (REF !== undefined) {
        REF = database.ref(`user_data/${UID}/${key}`);
        REF.update(data);
    }
}


function getImgUrl(target) {
    //let url = "http://localhost/img/" + target;
    let url = "https://nao-romasaga.github.io/img/" + target;
    return 'background:url(' + url + ') no-repeat;'
}
