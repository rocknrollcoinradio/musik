var express = require('express');
var app     = express();

app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});

const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
//const token = process.env.TELEGRAM_BOT_TOKEN;
const token = '864175027:AAHj3xy-ZX54knuu8WemxFaZl0vAWt0VuB8';
const bot = new TelegramBot(token, {polling: true});
const idAdmin = 945447562;
bot.on('message', (msg) => {
    const chatId = msg.chat.id;// извлекаем id чата
    const first_name = msg.chat.first_name;// извлекаем имя пользователя

    if (msg.text) {

        const text = msg.text.toLowerCase();

        if (~text.indexOf("привет")) {
            bot.sendMessage(chatId, 'Приветик, ' + first_name + '!');
        } else if (~text.indexOf("start")) {
        } else if (~text.indexOf("закрыть")) {
            bot.sendMessage(chatId, 'Клавиатура закрыта', {
                reply_markup: {
                    remove_keyboard: true
                }
            });
        } else if (~text.indexOf("клав")) {
            openKlava(chatId);
        } else if (~text.indexOf("здраст")) {
            bot.sendMessage(chatId, 'Здравствуй, здравствуй, ' + first_name + '!');
        } else if (~text.indexOf("здравст")) {
            bot.sendMessage(chatId, 'Здравствуй, здравствуй, ' + first_name + '!');
        } else if (~text.indexOf("дур")) {
            bot.sendMessage(chatId, '' + first_name + ', не ругайся, а то обижусь!');
        } else if (~text.indexOf("туп")) {
            bot.sendMessage(chatId, '' + first_name + ', не ругайся, а то обижусь!');
        } else if (~text.indexOf("класи")) {
            openClassik(chatId, first_name);
        } else if (~text.indexOf("класси")) {
            openClassik(chatId, first_name);
        } else if (~text.indexOf("про автора")) {
            bot.sendMessage(chatId, 'Про автора бота', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Автор',
                                url: 'https://polyakovdmitriy.ru'
                            }
                        ],
                        [
                            {
                                text: 'Класика',
                                callback_data: 'classik'
                            }
                        ]
                    ]
                }
            })
        } else {
            bot.sendMessage(chatId, '' + first_name + ', я тебя не понимать!');
        }
    }
    bot.forwardMessage(chatId, idAdmin, msg.message_id);

});

bot.onText(/\/start/, (msg, match) => {

    const chatId = msg.chat.id;// извлекаем id чата
    bot.sendMessage(chatId, 'Приветик, ' + msg.chat.first_name + '!');
    openKlava(chatId);

});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    if (query.data === 'classik') {
        openClassik(chatId, query.message.chat.first_name);
    }
});

bot.on('contact', (msg) => {

    const chatId = msg.chat.id;// извлекаем id чата
    bot.sendMessage(chatId, 'Спасибо! Ваш заказ принят, мы с Вами свяжемся!');

});

function openClassik(chatId, first_name) {
    fs.readdir('./klasik/', function(err,files) {
        const rf = files[Math.floor(Math.random()*files.length)];
        bot.sendMessage(chatId, '' + first_name + ', лови классическую музыку!');
        bot.sendAudio(chatId, './klasik/' + rf).then(()=>{
            bot.sendMessage(chatId, 'И слушай!');
        });
    })
}

function openKlava(chatId) {
    bot.sendMessage(chatId, 'Клавиатура открыта', {
        reply_markup: {
            keyboard: [
                [{text: 'Классика'},{text: 'Закрыть'}],
                [{text: 'Заказать разработку бота',request_contact: true}],
                [{text: 'Про автора'}]
            ],
            one_time_keyboard: true
        }
    })
}
