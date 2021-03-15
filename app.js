const request = require('request')
const uuidv4 = require("uuid/v4")
const sign = require('jsonwebtoken').sign

require('date-utils');
var newDate = new Date();
var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
var pastTime = time;

console.log("print %s", time);



// while(true){
//   if(pastTime-time>=5){
//     console.log("somethin Wrong");
//   }
// }

const access_key = "NRHitfNgzvZ0W92VeVo0IQgwLxy2IxnU9KEVO8l0"
const secret_key = "UoG2V6iafVo2wpexTotWWj4wxajuRgcIj9ajbwNh"
const server_url = "https://api.upbit.com"

const payload = {
    access_key: access_key,
    nonce: uuidv4(),
}

const token = sign(payload, secret_key)

const options = {
    method: "GET",
    url: server_url + "/v1/accounts",
    headers: {Authorization: `Bearer ${token}`},
}

request(options, (error, response, body) => {
    if (error) throw new Error(error)
    console.log(body)
})
var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
console.log("print %s", time);
