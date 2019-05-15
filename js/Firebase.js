var configGreen = {
    apiKey: "AIzaSyCKpg76hjQg4YNSW3hGEw5uCJOBbQNUsnQ",
    databaseURL: "https://nao-romasaga-rs.firebaseio.com",
    authDomain: "nao-romasaga-rs.firebaseapp.com",
    storageBucket: "nao-romasaga-rs.appspot.com",
};
var configUsers = {
    apiKey: "AIzaSyDvB6eT5hyVrgYQwuPMRomveJmwI3M6OOQ",
    databaseURL: "https://nao-romasaga-rs-users.firebaseio.com",
    authDomain: "nao-romasaga-rs-users.firebaseapp.com",
    storageBucket: "nao-romasaga-rs-users.appspot.com",
};
const app = firebase.initializeApp(configGreen);
const appUsers = firebase.initializeApp(configUsers, "Users");

var REF;
var UID;
firebase.auth(appUsers).onAuthStateChanged((user) => {
    if (user) {
        UID = user.uid;
        REF = firebase.database(appUsers).ref('user_data/' + UID);
        $(".RequireLoginMenu").removeClass("d-none");
    } else {
        $(".RequireLoginMenu").addClass("d-none");        
        console.log("no login");
    }
        console.log(UID);
});
function readFile(target, callback) {
    return firebase.database().ref(`game_data/${target}`).once("value").then(function (snapshot) {
        return callback(snapshot.val());
    });
}
async function readFileWithId(target, id, callback) {
    return firebase.database().ref(`game_data/${target}/${id}`).once("value").then(function (snapshot) {
        return callback(snapshot.val());
    });
}
async function readAnalyzeWithId(target, id, callback) {
    return firebase.database().ref(`analyze_data/${target}/${id}`).once("value").then(function (snapshot) {
        return callback(snapshot.val());
    });
}
async function readUserDataWithId(target, id, callback) {
    return firebase.database(appUsers).ref(`user_data/${UID}/${target}/${id}`).once("value").then(function (snapshot) {
        return callback(snapshot.val());
    });
}

function readAnalyzeFile(target, callback) {
    return firebase.database().ref(`analyze_data/${target}`).once("value").then(function (snapshot) {
        return callback(snapshot.val());
    });
}

function readCharData(charId, callback) {
    return firebase.database(appUsers).ref(`user_data/${UID}/CHAR/${charId}`).once("value").then(function (snapshot) {
        return callback(snapshot.val());
    });
}
function readMyChar(callback){
    return firebase.database(appUsers).ref(`user_data/${UID}/CHAR`).once("value").then(function (snapshot) {
        return callback(snapshot.val());
    });
}

function readPartyData(callback) {
    console.log(`user_data/${UID}/PARTY`);
    return firebase.database(appUsers).ref(`user_data/${UID}/PARTY`).once("value").then(function (snapshot) {
        return callback(snapshot.val());
    });
}
function readStyleCheckData(callback) {
    return firebase.database(appUsers).ref(`user_data/${UID}/STYLECHECK`).once("value").then(function (snapshot) {
        return callback(snapshot.val());
    });
}
function updateData(key, data) {
    if (REF !== undefined) {
        REF = firebase.database(appUsers).ref(`user_data/${UID}/${key}`);
        REF.update(data);
    }
}


function getImgUrl(target) {
    //let url = "http://localhost/img/" + target;
    let url = "https://nao-romasaga.github.io/img/" + target;
    return 'background:url(' + url + ') no-repeat;'
}
