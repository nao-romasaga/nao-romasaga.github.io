var UID;

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
};
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

var ConnectConfigP = [
    //configDev, 
    configDev2
];
var randomP = Math.floor(Math.random() * ConnectConfigP.length);

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
            , "UY9dWWRqUHOpdKT5fapBq81GqOm2", "Ce5LZo1RLpVCwSBRjrFeKph1UnR2", "3wpP7HkA18M8v0mPsCwvcGHE0zO2", "J2EIRan4ttXCJY20D0sNuUeJIk43"
            , "LKb3TOVJiOPrFAqYkrkfsZQBRxv2", "46n1ud1bFzblhaUatSi1fgmHxQ22", "OnJ6lmuwq3YhT65Z1MVHixVzb9m1", "wUyqDnc6coUh1Cf3Jl7kTK3fAre2"
            , "f7hHDaDQb1QJt3XnGdiB0q5RuHY2", "wM49Fkw1zKOHXfrfuAbDinYyxP32", "Wj2dHeJHoBduqQSe9484zzOSxVA3", "avkbqKOUwTgeDSqp3gnshwzdkpF3"
            , "cp9NiHTzwIMDz9cVFfqN3B8gDIk2", "WxqrVNFyb7Pgka781HF7hhP9Kog1", "Ho2PizN4dVUJoi2uguMheCIvcR33", "RE68Xftv85bzcsys9Q10dmyu7CB3"
];
var OFUSE_FLG = false;
var PARTY_LIMIT = 10; // 暫定的な周回チェック登録上限
var OURSTYLE_LIMIT = 20; // みんなのスタイル所持数限界
console.log("FIRE");

//const appUsers = firebase.initializeApp(decodeConfig(configTest), "Users");
const appUsers = firebase.initializeApp(decodeConfig(configUsers));

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
if (localStorage !== undefined && ["ncTVtjyH4qWQQLnMzpmdux39AoD3", "zTfHJIfqKtVHdcjQFWqt8WEfl2A3"].indexOf(localStorage.uid) > -1) {
    PARTY_LIMIT = 100;
    OURSTYLE_LIMIT = 100;
    //conf = decodeConfig(ConnectConfigNoLogin[randomNoLogin]);
    //conf = decodeConfig(ConnectConfigP[randomP]); 
    conf = decodeConfig(configTest);

    x = conf["authDomain"].replace(".firebaseapp.com", "").split("-");
    CONNECT_DB = x[x.length - 1];
} else if (OFUSE_FLG) {
    PARTY_LIMIT = 15;
    OURSTYLE_LIMIT = 40;
} else {
    if (localStorage.uid === undefined) {
        console.log("Connect to NoLogin ");
    } else {
        console.log("Connect to Login " + localStorage.uid);
    }
}

const databaseUser = firebase.database(appUsers);

var USER;
var NO_LOGIN = true;
if (canStorage) {
    NO_LOGIN = (localStorage.uid === undefined || localStorage.uid === null);
}

firebase.auth(appUsers).onAuthStateChanged(function (user) {
    if (!user) {
        _noLoginInitial();
        //firebase.database(appUsers).goOffline();
    } else {
        NO_LOGIN = false;
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
        $(".LoginHideMenu").addClass("d-none");
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

var myUpdate = null;
var myStorage = null;



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
function readUserDataWithId(target, id, callback, goOffline) {
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


function deleteCharData(charId) {
    let REF = firebase.database(appUsers).ref(`user_data/${UID}/CHAR/${charId}`).remove();
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

function addData(key, data) {
    let REF = firebase.database(appUsers).ref(key);
    REF.push(data, function (error) {
        if (error) {
            console.log(error);
        } else {
            console.log("no error");
        }
    });
}

function getImgUrl(target) {
    return `background:url(http://romasagatool.com/img/${target}) no-repeat;`;
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
            + "7/15 [更新] <a href='./ourstyle.html'>みんなの所持スタイル</a> ランキング表示を20位までから<b>40位まで</b>に拡張しました<br>"
            + "6/9 [更新] <a href='./party.html'>ステータス上限チェック</a> 登録キャラを5体から10体に拡張しました"

    let info = `<div class="card" id="infoCard"><div class="card-header bg-warning" style="color:black">${title}</div><div class="card-body">${word}</div></div>`;
    // Firebase側で暫定的に削除してるのでそっちも修正すること
    if (OFUSE_FLG) {
        //$(".title-text").after(info);
    }
});
