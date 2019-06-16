var UID;

var configGreen = {
    "YXBpS2V5": "QUl6YVN5Q0twZzc2aGpRZzRZTlNXM2hHRXc1dUNKT0JiUU5Vc25R",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLmZpcmViYXNlYXBwLmNvbQ==",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMuZmlyZWJhc2Vpby5jb20=",
};
var configBlue = {
    "YXBpS2V5": "QUl6YVN5QmxpWmZ3ei14Wm5WdElabWVBUXYwdW8ySWdtTDVlVUtN",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUuZmlyZWJhc2VhcHAuY29t",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZS5maXJlYmFzZWlvLmNvbQ==",
};
var configBlue2 = {
    "YXBpS2V5": "QUl6YVN5Qjc2TldRNWlIYV9xMVJzaC1OVEtyTUI3Vld1UG5aUWNn",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUyLmZpcmViYXNlYXBwLmNvbQ==",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTIuZmlyZWJhc2Vpby5jb20=",
    "c3RvcmFnZUJ1Y2tldA==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUyLmFwcHNwb3QuY29t",
};
var configGreen2 = {
    "YXBpS2V5": "QUl6YVN5QzJwaUFmNml6WXI1U0R1YTFwdjFyVjYxaFVDZi11N0Rz",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWdyZWVuMi5maXJlYmFzZWFwcC5jb20=",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtZ3JlZW4yLmZpcmViYXNlaW8uY29t",
};
var configGreen3 = {
    "YXBpS2V5": "QUl6YVN5Qjd1a1hrWGZOMzNZV0pnMnk4UkNpcC1rNVNrdHdtT2lv",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWdyZWVuMy5maXJlYmFzZWFwcC5jb20=",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtZ3JlZW4zLmZpcmViYXNlaW8uY29t",
    "c3RvcmFnZUJ1Y2tldA==": "bmFvLXJvbWFzYWdhLXJzLWdyZWVuMy5hcHBzcG90LmNvbQ==",
};
var configBlue3 = {
    "YXBpS2V5": "QUl6YVN5RGNQTTAxTXlvNVRtUUFkX0lURVZGTTdyR3VwSGpzWUJJ",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUzLmZpcmViYXNlYXBwLmNvbQ==",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTMuZmlyZWJhc2Vpby5jb20=",
};
var configBlue4 = {
    "YXBpS2V5": "QUl6YVN5RHhNa0I1RVRMaDhXZVZqSDU2NjdGQzVpN3RTenFwVW80",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWU0LmZpcmViYXNlYXBwLmNvbQ==",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTQuZmlyZWJhc2Vpby5jb20=",
};
var configGreen4 = {
    "YXBpS2V5": "QUl6YVN5Q1I5SWVEM1NDd1R0bjZjcXNtOV9UaFZpOVpfb3hNd1Nn",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWdyZWVuNC5maXJlYmFzZWFwcC5jb20=",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtZ3JlZW40LmZpcmViYXNlaW8uY29t",
};
var configGreen5 = {
    "YXBpS2V5": "QUl6YVN5QzZPcnZJOXV2TFp0WXEzMXhuVERhR0RGSVdhRERaMXgw",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWdyZWVuNS5maXJlYmFzZWFwcC5jb20=",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtZ3JlZW41LmZpcmViYXNlaW8uY29t",
};
var configBlue5 = {
    "YXBpS2V5": "QUl6YVN5QklkcWV2QTh0MFBiaEs1VUdISWVLcHU1VXRVeG9nYXpn",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWU1LmZpcmViYXNlYXBwLmNvbQ==",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTUuZmlyZWJhc2Vpby5jb20=",
};
var configBlue6 = {
    "YXBpS2V5": "QUl6YVN5Q2NhLUVndTlaTVYzM0RUNWlseTc0TXlYZnpnSW0xcDhR",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWU2LmZpcmViYXNlYXBwLmNvbQ==",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTYuZmlyZWJhc2Vpby5jb20=",
};
var configGreen6 = {
    "YXBpS2V5": "QUl6YVN5QmJmLWFXUXVLclo2TWFQTnFUbWE2akhtSV9TMGhqanpV",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWdyZWVuNi5maXJlYmFzZWFwcC5jb20=",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtZ3JlZW42LmZpcmViYXNlaW8uY29t",
};
var configBlue7 = {
    "YXBpS2V5": "QUl6YVN5QVdLOHZZZzd1OVloWU5ycm1FMTlGejJkVEFDYWtTWnNJ",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWU3LmZpcmViYXNlYXBwLmNvbQ==",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTcuZmlyZWJhc2Vpby5jb20=",
};
var configGreen7 = {
    "YXBpS2V5": "QUl6YVN5Qkp5d0txOWlTNGk2cXFTaGY4bzZnbUNacWxXMjF4X0xN",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWdyZWVuNy5maXJlYmFzZWFwcC5jb20=",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtZ3JlZW43LmZpcmViYXNlaW8uY29t",
};
var configBlue8 = {
    "YXBpS2V5": "QUl6YVN5QUZpTkRkUE5GczA3Sktxa05QcDdhY045aUZJcGFkTnhj",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWU4LmZpcmViYXNlYXBwLmNvbQ==",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTguZmlyZWJhc2Vpby5jb20=",
};
var configGreen8 = {
    "YXBpS2V5": "QUl6YVN5QVR6NHVreVRLZ3JNY19wbW5sQ0NaWlVYRC1BcUN3ZTlV",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWdyZWVuOC5maXJlYmFzZWFwcC5jb20=",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtZ3JlZW44LmZpcmViYXNlaW8uY29t",
};

var configUsers = {
    "YXBpS2V5": "QUl6YVN5RHZCNmVUNWh5VnJnWVF3dVBNUm9tdmVKbXdJM002T09R",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLXVzZXJzLmZpcmViYXNlYXBwLmNvbQ==",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtdXNlcnMuZmlyZWJhc2Vpby5jb20=",
    "bWVzc2FnaW5nU2VuZGVySWQ=": "ODI4NjkzNDcyNzI="
};

var configDev = {
    "YXBpS2V5": "QUl6YVN5RFF1X21pay1zdVI2TDRPelBNN2dicWM5UGltdDFOWjY4",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWRldi5maXJlYmFzZWFwcC5jb20=",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtZGV2LmZpcmViYXNlaW8uY29t",
};
var configDev2 = {
    "YXBpS2V5": "QUl6YVN5RDdGQ3dySGluQUYtSTNIcGpyX3FsWVpkT01nQkRnS2g0",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWRldjIuZmlyZWJhc2VhcHAuY29t",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtZGV2Mi5maXJlYmFzZWlvLmNvbQ==",
}
var configTest = {
    "YXBpS2V5": "QUl6YVN5Qk53UHhjczZPZGFOZTF4a2VTN1M3OFkyd3VzY3BKRk53",
    "YXV0aERvbWFpbg==": "dGVzdC0xNGFhYi5maXJlYmFzZWFwcC5jb20=",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly90ZXN0LTE0YWFiLmZpcmViYXNlaW8uY29t",
    "cHJvamVjdElk": "dGVzdC0xNGFhYg==",
};

var Base64 = {
    encode: function (str) {
        return btoa(unescape(encodeURIComponent(str)));
    },
    decode: function (str) {
        return decodeURIComponent(escape(atob(str)));
    }
};

var ConnectConfig = [configGreen, configBlue, configBlue2, configGreen2, configBlue3, configGreen3, configBlue4, configGreen4, configGreen5, configBlue5];
var random = Math.floor(Math.random() * ConnectConfig.length);

var ConnectConfigP = [configDev, configDev2];
var randomP = Math.floor(Math.random() * ConnectConfigP.length);

var ConnectConfigNoLogin = [configBlue2, configBlue3, configBlue4, configBlue5, configBlue6, configBlue7, configBlue8 ];
var ConnectConfigCommon = [configBlue, configGreen, configGreen2, configGreen3, configGreen4, configGreen5, configGreen6, configGreen7, configGreen8];
var randomNoLogin = Math.floor(Math.random() * ConnectConfigNoLogin.length);
var randomCommon = Math.floor(Math.random() * ConnectConfigCommon.length);


var OFUSE_USER = [
    "ncTVtjyH4qWQQLnMzpmdux39AoD3",
    "zTfHJIfqKtVHdcjQFWqt8WEfl2A3", // test
    "2JjRFQqABehWvPxz28iqWALfFO62", "eyrvbonzhZQl0k3yM6GwwsZOfiC2", "TiQm3fWRZJaNgz0nGDgflt0Xw2e2", "V55yz4hrYcOWAYU0x4OcL2Pfos02"
            , "zsQVOMj6sVeXomWYIRUFjUmSt8q1", "z7ltF3uUDMPqRn2yjXLMQMRLJ0L2", "LQs9kIak7NQA3ahYTUyNG7rHyGo1", "Xos8L81JDFSCfvVXfy5skiyUIzI2"
            , "Zh5tXsUwGwRjS4nl5xs2p91JNwI3", "dttvyUkYI9QPRxsM60kKus7dgmm2", "gtal58C4knb4B7nND7pg3NTJQ3a2", "iTaqCAb0byW51MafVwCfFDNvw1g2"
            , "l8IvLn5u8MZzAx6NVb3UXLz34mO2", "W0e1Tbv4z0T9M6XjNpbCyl16jNp1", "TigpbNlT75UuhmOQES5AlJYQSQg1", "V5YgB5Kg3beUf7GhBzgXiFKM9s32"
            , "dSqDjjpplUaK4mKqrpAjLhXs97d2", "7fnFW02fhXRiQBupFAtugwAPb822", "iH3esRQD55RH0kDqy0sQMA0P3fy2", "ETy3u8ef6kPsYqOJZLxBeAcg7m42"
            , "qugcteBDGNTJA6lr9FXj1UObZAx2", "72DhaGiuFANfrXKq5FmJmcSvV6q1", "IxP7OXTJLUSh9oHpb90NfnNxaIf1", "sFzrChjCIuUjY1UEOCEuKQC3Z7j2"
            , "6gt2DGNcfcMLRX22YKkSpJNZ4so1", "tDmESwnnmzegyoeilr4II14V1Tj2", "ha1b9zWXybhtrnOH0xS2h4q1bAr1", "BCdG25acazaUzVVB3KySTOYseKD3"
            , "5zpFempXf6WNFKwSC3uwZvQssND2", "vpkffnasbmdZziT1fgGbKXO9BZf2", "ZG9lqrKgB4gOF004JeukSLpi7XX2", "alHhWgSnt4RPvzoz3g7zr6VrVmt1"
            , "W0fdFOfGOhbBNQMC1Uqe1qAz4lo2", "SX4MWknpYvhCv3BYLELUyvm11J23", "ZluE9GNihzdnLaJXvwv2nAKBxGZ2", "biOkW44rj6Q1ZuNcrVuBh0oXHID3"
            , "RpieryJcaTNK0pzhTKoIyqP7eQ02", "9rkTKlwQRbYif4MOSt5xtWl6u143", "Hw2xfKv7pqYJB8lYo5a5oqHaDx52", "2YDgZiWokjVm6GMRQNB5LHbDRw43"
            , "FamhkT9WxnYwzR2wDDpmkvGxQSt1", "g22fyRTx0VgIGQwrB37sUyOiZvs1", "hsjjJimUHVQ8pTPd1xMBuFYo2sD2", "ybNUYXjA9pQwSuOYxdNtG88Xuqw2"
            , "4IpcGaUPOSd0RCr6jn1wkDJ01Fi2", "8Sdp7MJb9IV9IyNB4yMWGGH7Gzh2", "sjjmp9cxjAaHERR1HV0uk31XUJw2", "bycSiG491Ee2CCpvS1ADsHaGnUC3"
            , "PmJwymVJRmbnaai9MWXPe9nkC9E3", "BaORGBMRRKP3UROQyjwyO90fhPg2", "EEinX83HYeVEzs4n7z700nICB5n1", "UtpnVrAsayTiSxtAdm9mOcjysKs1"
];
var OFUSE_FLG = false;
var PARTY_LIMIT = 5; // 暫定的な周回チェック登録上限
var OURSTYLE_LIMIT = 20; // みんなのスタイル所持数限界
console.log("FIRE");

var app;

//const appUsers = firebase.initializeApp(decodeConfig(configTest), "Users");
const appUsers = firebase.initializeApp(decodeConfig(configUsers), "Users");

//ローカルストレージ
var canStorage = false;
try {
    localStorage.test = 'hoge';
    canStorage = true;
    OFUSE_FLG = (OFUSE_USER.indexOf(localStorage.uid) > -1);
//    console.log(localStorage.uid);
//    console.log('✅LocalStorage使えるよ');
//localStorage.uid = JSON.stringify({a: 'test'});
//JSON.parse(localStorage.test);
} catch (e) {
//    console.log('❌LocalStorage使えない');
    console.error(e);
}
var CONNECT_DB = "";
if (localStorage !== undefined && localStorage.uid === "ncTVtjyH4qWQQLnMzpmdux39AoD3") {
    PARTY_LIMIT = 100;
    OURSTYLE_LIMIT = 100;
    //conf = decodeConfig(ConnectConfigNoLogin[randomNoLogin]);
    //app = firebase.initializeApp(decodeConfig(ConnectConfigP[randomP]));
    conf = decodeConfig(ConnectConfigP[randomP]);
    //conf = decodeConfig(configTest);
    app = firebase.initializeApp(conf);
    x = conf["authDomain"].replace(".firebaseapp.com", "").split("-");
    CONNECT_DB = x[x.length-1];
    console.log("Connect to " + randomP, conf["authDomain"].replace(".firebaseapp.com", ""));
} else if (OFUSE_FLG) {
    PARTY_LIMIT = 10;
    OURSTYLE_LIMIT = 40;
    console.log("Connect to Premium " + randomP);
    app = firebase.initializeApp(decodeConfig(ConnectConfigP[randomP]));
} else {
    if (localStorage.uid === undefined) {
        CONNECT_DB = "DB"+randomNoLogin;
        app = firebase.initializeApp(decodeConfig(ConnectConfigNoLogin[randomNoLogin]));
        console.log("Connect to NoLogin " + randomNoLogin);
    } else {
        CONNECT_DB = "DB"+randomCommon;
        app = firebase.initializeApp(decodeConfig(ConnectConfigCommon[randomCommon]));
        console.log("Connect to Login " + randomCommon);
    }
}

const database = firebase.database();
const presenceRef = database.ref('/.info/connected');
const listRef = database.ref('/presence/');
const userRef = listRef.push();

presenceRef.on('value', function (snap) {
    if (snap.val()) {
        userRef.onDisconnect().remove();
        userRef.set(true);
    }
});
listRef.on('value', function (snap) {
    $("#CONNECT_GAME").text(snap.numChildren());
    $("#CONNECT").text(snap.numChildren());
    if ($("#CONNECT_USER").text() !== "") {
        let num = Number($("#CONNECT_USER").text());
        $("#CONNECT").text(Number(snap.numChildren()) + num);
    }
    console.log('# of online games = ' + snap.numChildren());
});
const databaseUser = firebase.database(appUsers);
const presenceRefUser = databaseUser.ref('/.info/connected');
const listRefUser = databaseUser.ref('/presence/');
const userRefUser = listRefUser.push();

presenceRefUser.on('value', function (snap) {
    if (snap.val() === true) {
        //console.log("connected");
    } else {
        //console.log("not connected");
    }
    if (snap.val()) {
        //console.log("remove")
        userRefUser.onDisconnect().remove();
        userRefUser.set(true);
    }
});
listRefUser.on('value', function (snap) {
    $("#CONNECT_USER").text(snap.numChildren());
    $("#CONNECT").text(snap.numChildren());
    if ($("#CONNECT_GAME").text() !== "") {
        let num = Number($("#CONNECT_GAME").text());
        $("#CONNECT").text(Number(snap.numChildren()) + num);
    }
    console.log('# of online users = ' + snap.numChildren());
});

var USER;
firebase.auth(appUsers).onAuthStateChanged((user) => {
    if (!user) {
        _noLoginInitial();
        firebase.database(appUsers).goOffline();
    } else {
        USER = user;
        UID = user.uid;
        if (canStorage) {
            localStorage.uid = UID;
        }
        OFUSE_FLG = (OFUSE_USER.indexOf(UID) > -1);
        updateData("", {"NAME": encodeURI(user.displayName)
            , "LAST_ACCESS": getNowYMDHM()
            , "timestamp": firebase.database.ServerValue.TIMESTAMP});
        $(".RequireLoginMenu").removeClass("d-none");
        _initial();
    }
});
function _noLoginInitial() {}
function _initial() {}

function getNowYMDHM() {
    var dt = new Date();
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth() + 1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);
    var hh = ("00" + dt.getHours()).slice(-2);
    var mi = ("00" + dt.getMinutes()).slice(-2);
    var result = `${y}/${m}/${d} ${hh}:${mi}`;
    return result;
}

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

function readAnalyzeFile(target, callback) {
    return firebase.database().ref(`analyze_data/${target}`).once("value").then(function (snapshot) {
        return callback(snapshot.val());
    });
}


function readStyleCheckData(id, callback, goOffline) {
    if (goOffline) {
        console.log("GO ONLINE");
        firebase.database(appUsers).goOnline();
    }
    return firebase.database(appUsers).ref(`user_data/${id}/STYLECHECK`).once("value").then(function (snapshot) {
        if (goOffline) {
            console.log("GO OFFLINE");
            firebase.database(appUsers).goOffline();
        }
        return callback(snapshot.val());
    });
}

function readUserData(key, callback, goOffline) {
    if (goOffline) {
        console.log("GO ONLINE");
        firebase.database(appUsers).goOnline();
    }
    return firebase.database(appUsers).ref(`user_data/${UID}/${key}`).once("value").then(function (snapshot) {
        if (goOffline) {
            console.log("GO OFFLINE");
            firebase.database(appUsers).goOffline();
        }
        return callback(snapshot.val());
    });
}
async function readUserDataWithId(target, id, callback, goOffline) {
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


function updateData(key, data, goOffline) {
    if (goOffline) {
        console.log("GO ONLINE");
        firebase.database(appUsers).goOnline();
    }
    let REF = firebase.database(appUsers).ref(`user_data/${UID}/${key}`);
    REF.update(data, function (error) {
        if (error) {
            console.log(error);
        } else {
            console.log("no error");
        }
        if (goOffline) {
            console.log("GO OFFLINE");
            firebase.database(appUsers).goOffline();
        }
    });
}

function getImgUrl(target) {
    //let url = "http://localhost/img/" + target;
    let url = "https://nao-romasaga.github.io/img/" + target;
    return 'background:url(' + url + ') no-repeat;'
}
function decodeConfig(config) {
    let target = {};
    for (let k in config) {
        target[Base64.decode(k)] = Base64.decode(config[k]);
    }
    return target;
}

function encodeConfig(config) {
    let target = {};
    for (let k in config) {
        target[Base64.encode(k)] = Base64.encode(config[k]);
    }
    return target;
}

$(document).ready(function () {
    let title = "<i class='fas fa-medal'></i>プレミアム枠お知らせ";
    let word = ""
            + "6/16 [更新] <a href='./ourstyle.html'>みんなの所持スタイル</a> ランキング表示を20位までから<b>40位まで</b>に拡張しました<br>"
            + "6/9 [更新] <a href='./party.html'>ステータス上限チェック</a> 登録キャラを5体から10体に拡張しました"
    let info = `<div class="card" id="infoCard"><div class="card-header bg-warning" style="color:black">${title}</div><div class="card-body">${word}</div></div>`;
    // Firebase側で暫定的に削除してるのでそっちも修正すること
    if (OFUSE_FLG) {
        $(".title-text").after(info);
    }
});

//console.log(encodeConfig(configBlue7));
