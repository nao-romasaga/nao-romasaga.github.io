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
var greenConfig9 = {
    "YXBpS2V5": "QUl6YVN5Q3JabjI1ZUR4Y05SaTREZmFYVGQ3WC01N2VfUTVGcEtN",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWdyZWVuOS5maXJlYmFzZWFwcC5jb20=",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtZ3JlZW45LmZpcmViYXNlaW8uY29t"
};
var greenConfig10 = {
    "YXBpS2V5": "QUl6YVN5QUN6RFg3UUpoYlczVzlLWlhoLXVjNVBWWV9NM3BPbmRr",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWdyZWVuMTAuZmlyZWJhc2VhcHAuY29t",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtZ3JlZW4xMC5maXJlYmFzZWlvLmNvbQ=="
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
};
var configTest = {
    "YXBpS2V5": "QUl6YVN5Qk53UHhjczZPZGFOZTF4a2VTN1M3OFkyd3VzY3BKRk53",
    "YXV0aERvbWFpbg==": "dGVzdC0xNGFhYi5maXJlYmFzZWFwcC5jb20=",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly90ZXN0LTE0YWFiLmZpcmViYXNlaW8uY29t",
    "cHJvamVjdElk": "dGVzdC0xNGFhYg==",
};
var configGreen2 = {
    "YXBpS2V5": "QUl6YVN5QzJwaUFmNml6WXI1U0R1YTFwdjFyVjYxaFVDZi11N0Rz",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWdyZWVuMi5maXJlYmFzZWFwcC5jb20=",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtZ3JlZW4yLmZpcmViYXNlaW8uY29t",
};

var configBlue9 = {
    "YXBpS2V5": "QUl6YVN5QnlPY1NJTnJRSWJkY3BkVnhkZHpvcW5KRUhKdWR4U28w",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWU5LmZpcmViYXNlYXBwLmNvbQ==",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTkuZmlyZWJhc2Vpby5jb20=",
};
var configBlue10 = {
    "YXBpS2V5": "QUl6YVN5QVVzTFl2bTR2dmFDVG1VMXRKN1JucWRuV3pTX1d2Nm1J",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUxMC5maXJlYmFzZWFwcC5jb20=",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTEwLmZpcmViYXNlaW8uY29t",
};
var configBlue11 = {
    "YXBpS2V5": "QUl6YVN5QS1NQW9zSHpQVlBXZUh3WGhWbmdySFdRVUdIVmk2S1Rr",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUxMS5maXJlYmFzZWFwcC5jb20=",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTExLmZpcmViYXNlaW8uY29t",
};
var configBlue12 = {
    "YXBpS2V5": "QUl6YVN5Q08xaUZKbWZaSmdHWS1vd2YzdGlPYW8zekRpSXYzN0lF",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUxMi5maXJlYmFzZWFwcC5jb20=",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTEyLmZpcmViYXNlaW8uY29t",
};
var configBlue13 = {
    "YXBpS2V5": "QUl6YVN5QXpZU25vNTlCelpXSkJwQ3VpVjdfQk9ycnVESjYzRTBZ",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUxMy5maXJlYmFzZWFwcC5jb20=",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTEzLmZpcmViYXNlaW8uY29t",
};
var configBlue14 = {
    "YXBpS2V5": "QUl6YVN5Q1FZX2hFaV93WXhvb3R0cGdHbWJoSGVBY2pHZnlVd0Vv",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUxNC5maXJlYmFzZWFwcC5jb20=",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTE0LmZpcmViYXNlaW8uY29t",
};
var configBlue15 = {
    "YXBpS2V5": "QUl6YVN5QVNfOGNCYjVOQlotWXdOcW5FbFlUZ0Z5VGlGOU5FSl80",
    "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUxNS5maXJlYmFzZWFwcC5jb20=",
    "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTE1LmZpcmViYXNlaW8uY29t",
};
var configBlue16 = {
    "YXBpS2V5": "QUl6YVN5QWFCWHQ3ak93VmJjdkltSjFVbHJBMVJtQ2tfWk4zakVz"
    , "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUxNi5maXJlYmFzZWFwcC5jb20="
    , "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTE2LmZpcmViYXNlaW8uY29t"
};
var configBlue17 = {
    "YXBpS2V5": "QUl6YVN5Q2VCQllpRzlfMmY2MlQzYzBBREJuMVlaQWdRUG9CTXMw"
    , "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUxNy5maXJlYmFzZWFwcC5jb20="
    , "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTE3LmZpcmViYXNlaW8uY29t"
};
var configBlue18 = {
    "YXBpS2V5": "QUl6YVN5QXZLeDVZY2ZCM2huXzJ6Ymxqbms5djJ2SDZuVGUzNV9n"
    , "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUxOC5maXJlYmFzZWFwcC5jb20="
    , "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTE4LmZpcmViYXNlaW8uY29t"
};
var configBlue19 = {
    "YXBpS2V5": "QUl6YVN5QUJydFN1eklOZ3FFMFFMdTc1dnhOLV82T2otMFVaTEVr"
    , "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUxOS5maXJlYmFzZWFwcC5jb20="
    , "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTE5LmZpcmViYXNlaW8uY29t"
};
var configBlue20 = {
    "YXBpS2V5": "QUl6YVN5QkhDQVFiZkduTnFCMkNNREE0ZENRNjhyWVRodWNyZm4w"
    , "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUyMC5maXJlYmFzZWFwcC5jb20="
    , "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTIwLmZpcmViYXNlaW8uY29t"
};
var configBlue21 = {
    "YXBpS2V5": "QUl6YVN5Q0NEc3lvbDZyZDMtLVY0eUxQQ3FnX2swM1NaQXFMeGlv"
    , "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUyMS5maXJlYmFzZWFwcC5jb20="
    , "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTIxLmZpcmViYXNlaW8uY29t"
};
var configBlue22 = {
    "YXBpS2V5": "QUl6YVN5Q1hYZENjRHhQSHQyWU0tSVpsOUhmaHJwVDBCc25zM1g0"
    , "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUyMi5maXJlYmFzZWFwcC5jb20="
    , "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTIyLmZpcmViYXNlaW8uY29t"
};
var configBlue23 = {
    "YXBpS2V5": "QUl6YVN5RG14bjExallyNE9FeEdqOUdKbGduSTg0T1V2VDNmcm84"
    , "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUyMy5maXJlYmFzZWFwcC5jb20="
    , "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTIzLmZpcmViYXNlaW8uY29t"
};
var configBlue24 = {
    "YXBpS2V5": "QUl6YVN5QUo3SHdzejM1M2hST1ZBNTl3YmdNLXl3TjZ0SENpa3Nn"
    , "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUyNC5maXJlYmFzZWFwcC5jb20="
    , "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTI0LmZpcmViYXNlaW8uY29t"
};
var configBlue25 = {
    "YXBpS2V5": "QUl6YVN5RHg2NzRjbU5iNHVQcU5zRDgtRlpPRFpPbHBYM0huLUVN"
    , "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUyNS5maXJlYmFzZWFwcC5jb20="
    , "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTI1LmZpcmViYXNlaW8uY29t"
};
var configBlue26 = {
    "YXBpS2V5": "QUl6YVN5RElSYjZwLVJBSnEzRzNiczlfOVphNGJCbmctVlZtSG9N"
    , "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUyNi5maXJlYmFzZWFwcC5jb20="
    , "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTI2LmZpcmViYXNlaW8uY29t"
};
var configBlue27 = {
    "YXBpS2V5": "QUl6YVN5REpYbl9wMjlDcDV1WUR6WTJWRDd2MWhIMEdUdW1EM1NJ"
    , "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUyNy5maXJlYmFzZWFwcC5jb20="
    , "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTI3LmZpcmViYXNlaW8uY29t"
};
var configBlue28 = {
    "YXBpS2V5": "QUl6YVN5Q01CSnZfTmhLaS0zbTZuLW4yRTFZYW1rNGJKSkZiWHk0"
    , "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUyOC5maXJlYmFzZWFwcC5jb20="
    , "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTI4LmZpcmViYXNlaW8uY29t"
};
var configBlue29 = {
    "YXBpS2V5": "QUl6YVN5QXNPLUlzaFgzdEJrUUpPc21fUVVyMnQtUHdjU1lmVExj"
    , "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUyOS5maXJlYmFzZWFwcC5jb20="
    , "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTI5LmZpcmViYXNlaW8uY29t"
};
var configBlue30 = {
    "YXBpS2V5": "QUl6YVN5QktNMTlkcGJxVkNrR1B3bDJvdVlLVm9FejhHVGI4MkZv"
    , "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUzMC5maXJlYmFzZWFwcC5jb20="
    , "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTMwLmZpcmViYXNlaW8uY29t"
};
var configBlue31 = {
    "YXBpS2V5": "QUl6YVN5QVVtRkYzcC1nSnBDX0FYTGprTGp2ckdqOE9Pc3RWOS1Z"
    , "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUzMS5maXJlYmFzZWFwcC5jb20="
    , "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTMxLmZpcmViYXNlaW8uY29t"
};
var configBlue32 = {
    "YXBpS2V5": "QUl6YVN5REVvcXdrY2x4YWlKTFJmckxWaWtUV19MeXliTi02ZVBN"
    , "YXV0aERvbWFpbg==": "bmFvLXJvbWFzYWdhLXJzLWJsdWUzMi5maXJlYmFzZWFwcC5jb20="
    , "ZGF0YWJhc2VVUkw=": "aHR0cHM6Ly9uYW8tcm9tYXNhZ2EtcnMtYmx1ZTMyLmZpcmViYXNlaW8uY29t"
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

var ConnectConfigNoLogin = [
    //configBlue, configBlue2, configBlue3, configBlue4, configBlue5, configBlue6, configBlue7, configBlue8, configBlue9,
    //configBlue10, configBlue11, configBlue12, configBlue13, configBlue14, configBlue15, configBlue16, configBlue17, configBlue18, configBlue19,
    configBlue20, configBlue21, configBlue22, configBlue23, configBlue24, configBlue25, configBlue26, configBlue27, configBlue28, configBlue29,
            //configBlue30, configBlue31
];
var ConnectConfigCommon = [configGreen, configGreen2, configGreen3, configGreen4, configGreen5, configGreen6, configGreen7, configGreen8, greenConfig9, greenConfig10];
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
            , "UY9dWWRqUHOpdKT5fapBq81GqOm2", "Ce5LZo1RLpVCwSBRjrFeKph1UnR2", "3wpP7HkA18M8v0mPsCwvcGHE0zO2", "J2EIRan4ttXCJY20D0sNuUeJIk43"
            , "LKb3TOVJiOPrFAqYkrkfsZQBRxv2", "46n1ud1bFzblhaUatSi1fgmHxQ22", "OnJ6lmuwq3YhT65Z1MVHixVzb9m1", "wUyqDnc6coUh1Cf3Jl7kTK3fAre2"
            , "f7hHDaDQb1QJt3XnGdiB0q5RuHY2", "wM49Fkw1zKOHXfrfuAbDinYyxP32", "Wj2dHeJHoBduqQSe9484zzOSxVA3", "avkbqKOUwTgeDSqp3gnshwzdkpF3"
            , "cp9NiHTzwIMDz9cVFfqN3B8gDIk2"
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
if (localStorage !== undefined && ["ncTVtjyH4qWQQLnMzpmdux39AoD3", "zTfHJIfqKtVHdcjQFWqt8WEfl2A3"].indexOf(localStorage.uid) > -1) {
    PARTY_LIMIT = 100;
    OURSTYLE_LIMIT = 100;
    //conf = decodeConfig(ConnectConfigNoLogin[randomNoLogin]);
    //conf = decodeConfig(ConnectConfigP[randomP]); 
    conf = decodeConfig(configTest);

    app = firebase.initializeApp(conf);
    x = conf["authDomain"].replace(".firebaseapp.com", "").split("-");
    CONNECT_DB = x[x.length - 1];
    console.log("Connect to " + randomP, conf["authDomain"].replace(".firebaseapp.com", ""));
} else if (OFUSE_FLG) {
    PARTY_LIMIT = 10;
    OURSTYLE_LIMIT = 40;
    console.log("Connect to Premium " + randomP);
    app = firebase.initializeApp(decodeConfig(ConnectConfigP[randomP]));
} else {
    if (localStorage.uid === undefined) {
        CONNECT_DB = "DB" + randomNoLogin;
        app = firebase.initializeApp(decodeConfig(ConnectConfigNoLogin[randomNoLogin]));
        console.log("Connect to NoLogin " + randomNoLogin);
    } else {
        CONNECT_DB = "DB" + randomCommon;
        app = firebase.initializeApp(decodeConfig(ConnectConfigCommon[randomCommon]));
        console.log("Connect to Login " + randomCommon);
    }
}

const database = firebase.database();
//const presenceRef = database.ref('/.info/connected');
//const listRef = database.ref('/presence/');
//const userRef = listRef.push();
//
//presenceRef.on('value', function (snap) {
//    if (snap.val()) {
//        userRef.onDisconnect().remove();
//        userRef.set(true);
//    }
//});
//listRef.on('value', function (snap) {
//    $("#CONNECT_GAME").text(snap.numChildren());
//    $("#CONNECT").text(snap.numChildren());
//    if ($("#CONNECT_USER").text() !== "") {
//        let num = Number($("#CONNECT_USER").text());
//        $("#CONNECT").text(Number(snap.numChildren()) + num);
//    }
//    console.log('# of online games = ' + snap.numChildren());
//});
const databaseUser = firebase.database(appUsers);
//const presenceRefUser = databaseUser.ref('/.info/connected');
//const listRefUser = databaseUser.ref('/presence/');
//const userRefUser = listRefUser.push();
//
//presenceRefUser.on('value', function (snap) {
//    if (snap.val() === true) {
//        //console.log("connected");
//    } else {
//        //console.log("not connected");
//    }
//    if (snap.val()) {
//        //console.log("remove")
//        userRefUser.onDisconnect().remove();
//        userRefUser.set(true);
//    }
//});
//listRefUser.on('value', function (snap) {
//    $("#CONNECT_USER").text(snap.numChildren());
//    $("#CONNECT").text(snap.numChildren());
//    if ($("#CONNECT_GAME").text() !== "") {
//        let num = Number($("#CONNECT_GAME").text());
//        $("#CONNECT").text(Number(snap.numChildren()) + num);
//    }
//    console.log('# of online users = ' + snap.numChildren());
//});

var USER;
var NO_LOGIN = true;
if (canStorage) {
    NO_LOGIN = (localStorage.uid === undefined || localStorage.uid === null);
}

firebase.auth(appUsers).onAuthStateChanged(function (user) {
    if (!user) {
        _noLoginInitial();
        firebase.database(appUsers).goOffline();
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
function useLocalStrage(target, callback) {
    return firebase.database().ref(`game_data/UPDATE`).once("value").then(function (update) {
        if (canStorage) {
            var storage = JSON.parse(localStorage.getItem('game_data'));
            myUpdate = (storage !== null) ? storage['UPDATE'] : null;
            myStorage = storage;
        }

        //　初回アクセスなど
        console.log(myUpdate, update.val());
        if (myUpdate != update.val()) {
            console.log("データ更新あり", update.val());
            return firebase.database().ref(`game_data`).once("value").then(function (snapshot) {
                if (canStorage) {
                    localStorage.setItem('game_data', JSON.stringify(snapshot.val()));
                }
                myStorage = snapshot.val();
                return callback(myStorage[target]);
            });
        } else {
            console.log("データ更新なし", myUpdate);
            return callback(myStorage[target]);
        }
    });
}

function readFile(target, callback) {
    //return useLocalStrage(target, callback);
    return firebase.database().ref(`game_data/${target}`).once("value").then(function (snapshot) {
        return callback(snapshot.val());
    });
}
async function readFileWithId(target, id, callback) {
    if (myStorage === null) {
        return useLocalStrage(target, function (result) {
            return callback(result[id]);
        });
    } else {
        return callback(myStorage[target][id]);
    }
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
function readOurCharWithCache(callback) {
    var myUpdate = null;
    var myStorage = null;
    var updateKey = "analyze_data/OUR_CHAR/LIST";
    var listKey = "analyze_data/OUR_CHAR/UPDATE";
    return firebase.database().ref(`analyze_data/OUR_CHAR/UPDATE`).once("value").then(function (update) {
        if (canStorage) {
            var storage1 = localStorage.getItem(updateKey);
            myUpdate = (storage1 !== null) ? storage1 : null;
            var storage2 = JSON.parse(localStorage.getItem(listKey));
            myStorage = storage2;
        }

        //　初回アクセスなど
        if (myUpdate != update.val()) {
            localStorage.setItem(updateKey, update.val());
            console.log("データ更新あり", update.val());
            return firebase.database().ref(`analyze_data/OUR_CHAR/LIST`).once("value").then(function (snapshot) {
                if (canStorage) {
                    localStorage.setItem(listKey, JSON.stringify(snapshot.val()));
                }
                return callback(snapshot.val());
            });
        } else {
            console.log("データ更新なし", myUpdate);
            return callback(myStorage);
        }
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
    return `background:url(./img/${target}) no-repeat;`;
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
    if (localStorage.uid === "J2EIRan4ttXCJY20D0sNuUeJIk43") {
        word = "7/1[葱更新] フッターアニメーションをタチアナに更新<br>" + word;
    }

    let info = `<div class="card" id="infoCard"><div class="card-header bg-warning" style="color:black">${title}</div><div class="card-body">${word}</div></div>`;
    // Firebase側で暫定的に削除してるのでそっちも修正すること
    if (OFUSE_FLG) {
        //$(".title-text").after(info);
    }
});
