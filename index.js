const request = require('request')
const uuidv4 = require("uuid/v4")
const crypto = require('crypto')
const sign = require('jsonwebtoken').sign
const queryEncode = require("querystring").encode

//매 시간 n분 마다 수행
// var j = schedule.scheduleJob(rule, function(){
//          console.log('1분지났다');
//        });
var PrePrice = 777;
global.PrePrice = PrePrice;
var CurPrice = 5959;
global.CurPrice = CurPrice;


// var j = schedule.scheduleJob(rule, function(){
//   console.log("checkPoint for node-schedule");
// });


//현재시간
require('date-utils');
var newDate = new Date();
var time = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
var pastTime = time;
//현재시간 print
// console.log("print %s", time);


// 텔레그램
const TelegramBot = require('node-telegram-bot-api');
const telegramToken = '1679997923:AAGf5v_AlAwIumZsXFdW1U8i6F_219VCk4I';
const bot = new TelegramBot(telegramToken, {polling: true});


//업비트 key 3가
const access_key = "NRHitfNgzvZ0W92VeVo0IQgwLxy2IxnU9KEVO8l0"
const secret_key = "UoG2V6iafVo2wpexTotWWj4wxajuRgcIj9ajbwNh"
const server_url = "https://api.upbit.com"

const payload = {
    access_key: access_key,
    nonce: uuidv4(),
}
const token = sign(payload, secret_key)



const orderBody = {
    market: 'KRW-BTC',
    side: 'bid',
    volume: '0.01',
    price: '100',
    ord_type: 'limit',
}
// bid : 매수
// ask : 매도

//업비트 payload , token 연결 (주문)
const query = queryEncode(orderBody)

const hash = crypto.createHash('sha512')
const queryHash = hash.update(query, 'utf-8').digest('hex')


//업비트 payload , token 연결
const orderPayload = {
    access_key: access_key,
    nonce: uuidv4(),
    query_hash: queryHash,
    query_hash_alg: 'SHA512',
}
const orderToken = sign(orderPayload, secret_key)

//주문
const orderOptions = {
    method: "POST",
    url: server_url + "/v1/orders",
    headers: {Authorization: `Bearer ${orderToken}`},
    json: orderBody
}

//자산 request option
const options = {
    method: "GET",
    url: server_url + "/v1/accounts",
    headers: {Authorization: `Bearer ${token}`},
}


request(orderOptions, (error, response, orderBody) => {
    if (error) throw new Error(error)
    console.log(orderBody)
})





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



const fetch = require('node-fetch');
const BTCoptions = {method: 'GET', qs: {market: 'KRW-BTC', count: '1'}};

fetch(btcMinurl)
  .then(res => res.json())
  .then(data => {
    PrePrice = data[0].trade_price;
    //여기서부터 현재가격 계속 import 3분마다 체크
    //시간반복
    var schedule = require('node-schedule');
    var rule = new schedule.RecurrenceRule();
    rule.minutes = 1;
    var j = schedule.scheduleJob(rule, function(){
      fetch(btcMinurl)
        .then(res => res.json())
        .then(data => {
          CurPrice = data[0].trade_price;
          CurPrice = Number(CurPrice);
          PrePrice = Number(PrePrice);
          console.log("예전 가격 : " + PrePrice);
          console.log("함수 안 현재가격 : " + CurPrice);
          if(CurPrice>PrePrice){
            var chai = parseInt(CurPrice - PrePrice);
            console.log("처음 실행했을 때 보다 " + chai + "원 만큼 올랐어요.");
            if(CurPrice>=PrePrice*1.01){
              console.log("처음 실행했을 때 보다 1%이상 올랐어요.");
              bot.onText(/\!시(.+)/, (msg) => {
                const chatId = msg.chat.id;
                const resp = "처음 실행했을 때 보다 1%이상 올랐어요.";
                bot.sendMessage(chatId, resp);
              });
            }
            else{
              bot.onText(/\!시(.+)/, (msg) => {
                const chatId = msg.chat.id;
                const resp = "처음 실행했을 때 보다 " + chai+ "원 만큼 올랐어요.";
                bot.sendMessage(chatId, resp);
              });
            }
          }
          else{
            var chai = parseInt(PrePrice - CurPrice);
            chai = Number(chai);
            console.log("처음 실행했을 때 보다 " + chai + "원 만큼 떨어졌어요");
            if(PrePrice>=CurPrice*1.01){
              console.log("처음 실행했을 때 보다 1%이상 떨어졌어요..");
              bot.onText(/\!시(.+)/, (msg) => {
                const chatId = msg.chat.id;
                const resp = "처음 실행했을 때 보다 1%이상 떨어졌어요..";
                bot.sendMessage(chatId, resp);
              });
            }else{
              bot.onText(/\!시(.+)/, (msg) => {
                const chatId = msg.chat.id;
                const resp = "처음 실행했을 때 보다 " + chai + "원 만큼 떨어졌어요";
                bot.sendMessage(chatId, resp);
              });
            }
          }
    })
    });


    return PrePrice;
  })
  //함수 처리
  // var j = schedule.scheduleJob(rule, function(){
  //
  //   btcPrice();
  //
  //          console.log('가격비교');
  //          if(PrePrice < CurPrice){
  //            console.log('1분전보다 가격이 올랐어요');
  //            console.log('이전가격 : ' + PrePrice);
  //            console.log('지금가격 : ' + CurPrice);
  //          }else if(PrePrice == CurPrice){
  //            console.log("아무일도 없었다.");
  //          }
  //          else{
  //            console.log('1분전보다 가격이 내렸어요');
  //            console.log('이전가격 : ' + PrePrice);
  //            console.log('지금가격 : ' + CurPrice);
  //          }
  // });



// async function btcPrice(btcPriceData) {
//   console.log("Start Point")
//
//
//             bot.onText(/\!시(.+)/, (msg) => {
//
//
//               const fetch = require('node-fetch');
//               const BTCoptions = {method: 'GET', qs: {market: 'KRW-BTC', count: '1'}};
//
//               fetch(btcMinurl, BTCoptions, bot)
//               .then(res => res.json())
//               .then(data => {
//                     var btcPriceData = data;
//                     console.log(data[0]);
//
//
//             CurPrice = data[0].trade_price;
//
//             console.log(CurPrice);
//               // console.log("여기는 들어와졌니?"); //들어와.
//               const chatId = msg.chat.id;
//
//               const resp = "비트코인의 가격이 3%나 상승했어요!"; // the captured "whatever"
//               bot.sendMessage(chatId, resp);
//             });
//
//         })
//   .catch(err => console.error('error:' + err));
//
//   return data[0].trade_price;
//
// }


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
