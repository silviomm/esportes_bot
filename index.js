var TelegramBot = require('node-telegram-bot-api');
var token = '353603955:AAF6CoYSL3_Z7KkXDHH_euvrYzPE5ylySrg';
var bot = new TelegramBot(token, {
    polling: true
});


var cbf = {
    nome: '',
    lastNews: '',
    users: {}
};

var array = [];
const rssparser = require('rss-parser');

var GE_URL = 'http://globoesporte.globo.com/servico/semantica/editorias/plantao/futebol/times/';

var times = ['botafogo', 'flamengo', 'vasco', 'fluminense'];

function printaArray(array) {
    for (var i = 0; i < array.length; i++) {
        console.log(array[i].nome + ' ' + array[i].lastNews + ' ' + array[i].users);
    }
}


function inicializa() {
    let aux = 0;
    for (var j = 0; j < times.length; j++) {
        var link = GE_URL + times[j] + '/feed.rss';
        rssparser.parseURL(link, function(err, parsed) {
            cbf.nome = times[aux];
            cbf.lastNews = parsed.feed.entries[aux];
            var clone = Object.assign({}, cbf);
            array.push(clone);
            aux++;
        });
    }
    console.log('INICIALIZADO');
}
inicializa();

console.log('rodando...');



function verifica(time, chatId) {
    for (var i = 0; i < array.length; i++) {
        console.log('i: ' + i);
        console.log(array[i].nome);
        if (time == array[i].nome) {
            console.log(time + ' ' + array[i].nome);
            if (array[i].users[chatId] == 1) {
                console.log('JA TO AQUI');
                break;
            } else {
                array[i].users[chatId] = 1;
            }
        }
    }
}

bot.on('message', (msg) => {
    console.log(msg.text);
    var chatId = msg.chat.id;
    var text = msg.text;
    verifica(text, chatId);
    var link = GE_URL + text + '/feed.rss';
    var string;
    rssparser.parseURL(link, function(err, parsed) {
        printaArray(array);
        parsed.feed.entries.forEach(function(entry, i) {
            if (i == 0)
                string = (entry.title + ':' + entry.link);
        });
        console.log("PARSEADO: " + string);
        bot.sendMessage(chatId, string);
    });

});
