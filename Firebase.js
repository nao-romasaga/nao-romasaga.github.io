var config = {
    apiKey: "AIzaSyCKpg76hjQg4YNSW3hGEw5uCJOBbQNUsnQ",
    //authDomain: "nao-romasaga-rs.firebaseapp.com",
    databaseURL: "https://nao-romasaga-rs.firebaseio.com",
    //projectId: "nao-romasaga-rs",
    storageBucket: "nao-romasaga-rs.appspot.com",
    //messagingSenderId: "707644829042"
};

firebase.initializeApp(config);
firebase.auth().signInAnonymously().catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, errorMessage);
    // ...
});
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        console.log(user, isAnonymous, uid);
        // ...
    } else {
        console.log("signed out");
        // User is signed out.
        // ...
    }
    // ...
});


function showimage(path, id, size) {
    firebase.storage().ref().child(path).getDownloadURL().then(function (url) {
        //console.log(url);
        $("#" + id).css("background", "url(" + url + ") no-repeat");
        if (size !== undefined) {
            $("#" + id).css("background-size", size);
        }
    }).catch(function (error) {

    });
}

function setImgTag(path, id) {
    firebase.storage().ref().child(path).getDownloadURL().then(function (url) {
        $("#" + id).attr("src", url);
        return url;
    }).catch(function (error) {

    });
}
function setImgClassTag(path, id) {
    firebase.storage().ref().child(path).getDownloadURL().then(function (url) {
        $("." + id).attr("src", url);
        return url;
    }).catch(function (error) {

    });
}
