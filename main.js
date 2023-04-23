const TelegramApi = require('node-telegram-bot-api')
const token = '6096062058:AAHWP6jTh5U8fxrWeiRtdjjDhuLiOKRH5uc'
const bot = new TelegramApi(token, {polling: true})
const {gameOptions, againOptions} = require('./options')

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен её угадать')
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадай', gameOptions)
}

const start = () => {
    bot.setMyCommands ([
        {command: '/start', description: 'Начало'},
        {command: '/info', description: 'Инфо'},
        {command: '/game', description: 'Игра'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/3d2/135/3d213551-8cac-45b4-bdf3-e24a81b50526/1.webp')
            return bot.sendMessage(chatId, 'Текст')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, 'Инфо')
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Бывает')
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Ты отгадал ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Ты не отгадал, была цифра ${chats[chatId]}`, againOptions)
        }
    })
}

start()