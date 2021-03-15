const request = require('request')
const uuidv4 = require("uuid/v4")
const sign = require('jsonwebtoken').sign


//현재시간
require('date-utils');
var newDate = new Date();
var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
var pastTime = time;
//현재시간 print
console.log("print %s", time);


// 텔레그램
const TelegramBot = require('node-telegram-bot-api');
const telegramToken = '1679997923:AAGf5v_AlAwIumZsXFdW1U8i6F_219VCk4I';
const bot = new TelegramBot(telegramToken, {polling: true});


//업비트 key 3가
const access_key = "NRHitfNgzvZ0W92VeVo0IQgwLxy2IxnU9KEVO8l0"
const secret_key = "UoG2V6iafVo2wpexTotWWj4wxajuRgcIj9ajbwNh"
const server_url = "https://api.upbit.com"

//업비트 payload , token 연결
const payload = {
    access_key: access_key,
    nonce: uuidv4(),
}
const token = sign(payload, secret_key)

//자산 request option
const options = {
    method: "GET",
    url: server_url + "/v1/accounts",
    headers: {Authorization: `Bearer ${token}`},
}

var lists = ['currency','balance','locked','avg_buy_price_modified','unit_currency'];

//자산 request
request(options, (error, response, body) => {
    if (error) throw new Error(error)

    bot.onText(/\!자(.+)/, (msg) => {
      // 'msg' is the received Message from Telegram
      // 'match' is the result of executing the regexp above on the text content
      // of the message
      const chatId = msg.chat.id;
      // const balanced = "something";
      const resp = "부자되세요!" + body; // the captured "whatever"

      // send back the matched "whatever" to the chat
      bot.sendMessage(chatId, resp);
    });
})




//비트코인 분봉
// const fetch = require('node-fetch');
//업비트 분봉 url
const btcMinurl = 'https://api.upbit.com/v1/candles/minutes/1?market=KRW-BTC&count=1';

var list = ['market',
    'candle_date_time_utc',
    'candle_date_time_kst',
    'opening_price',
    'high_price',
    'low_price',
    'trade_price',
    'timestamp',
    'candle_acc_trade_price',
    'candle_acc_trade_volume',
    'unit'
]




let btcPriceData = "never touched";

async function btcPrice(btcPriceData) {
  console.log("Start Point")

  const fetch = require('node-fetch');
  const BTCoptions = {method: 'GET', qs: {market: 'KRW-BTC', count: '1'}};

  fetch(btcMinurl, BTCoptions, bot)
  .then(res => res.json())
  .then(data => {
            // console.log(data); //Outputs the JSON. For some reason it gives null
            bot.onText(/\!시(.+)/, (msg) => {
            let btcPriceData = data;
            console.log(btcPriceData);
              // console.log("여기는 들어와졌니?");
              const chatId = msg.chat.id;
              const something = btcPriceData
              const resp = "부자되세요!" + something; // the captured "whatever"

              // send back the matched "whatever" to the chat
              bot.sendMessage(chatId, resp);
            });

        })
  .catch(err => console.error('error:' + err));

}
btcPrice();









//비동기 예제
// async function f() {
//
//   let promise = new Promise((resolve, reject) => {
//     setTimeout(() => resolve("완료!"), 1000)
//   });
//
//   let result = await promise; // 프라미스가 이행될 때까지 기다림 (*)
//
//   alert(result); // "완료!"
// }
