//npm run dev
//https://thomlom.dev/create-a-discord-bot-under-15-minutes/

const Discord = require("discord.js")
//const save = require('save-file');
const ytdl = require('ytdl-core');
const fs = require('fs');
const client = new Discord.Client() 
var dispatcher = false;
const broadcast = client.voice.createBroadcast();
var volume = 1;
console.log("brodcast start")
const pasw = Math.floor(Math.random() * 8999999 + 1000000);
console.log(pasw);
var tttarray = new Array();

class ttt{
    /**
    * @param {Number} rows
    * @param {Number} collums
    * @param {Discord.GuildMember} guildmember1
    * @param {Discord.GuildMember} guildmember2
    * @param {String} LastError
    * @param {Boolean} playertomove
    * @param {Number} numberoofthegame
    */  
    constructor(collums, rows, guildmember1, guildmember2, numberoofthegame = 0){
        this.rows = rows;
        this.collums = collums;
        this.numberoofthegame = numberoofthegame;

        /**
        * @type {Discord.GuildMember}
        */
        this.guildmember1 = guildmember1;
        
        /**
        * @type {Discord.GuildMember}
        */
        this.guildmember2 = guildmember2;
        
        /**
        * @type {Number}
        */
       this.rows = rows;
       
        /**
        * @type {Number}
        */
        this.collums = collums;

        this.playertomove = 0;
        
        this.map = new Array(this.collums);

        for(var i = 0; i < this.collums; i++){
            this.map[i] = new Array(this.rows);
            for(var j = 0; j < this.rows; j++){
                this.map[i][j] = "-";
            }
        }
    }

    /**
    * @param {Number} x
    * @param {Number} y
    * @param {Discord.GuildMember} player
    */  

    playmove(x, y, player){

        if(x >= this.collums || y >= this.rows) return 0;
        if(x < 0 || y < 0) return 0;
        if(this.map[x][y] != "-") return 0;

        if(player == this.guildmember1 && !this.playertomove){
            this.map[x][y] = "X";
        }else if(player == this.guildmember2 && this.playertomove){
            this.map[x][y] = "O";
        }else{
            this.LastError = player.displayName + " is not a player in this game.";
            console.error(this.LastError);
            return 0;
        }

        this.playertomove = !this.playertomove;
        return 1;
    }

    load(){
        var thestring = "\n";
        for(var j = this.rows - 1; j >= 0; j--){
            for(var i = 0; i < this.collums; i++){
                thestring += this.map[i][j] + "/";
            }
            thestring = thestring.slice(0, -1);
            thestring += "\n";
        }
        return thestring;
    }

    /**
    * @param {Boolean} player
    */ 
    checkforwin(player){
        if(player){
            var char = "O";
        }else{
            var char = "X";
        }

        //horizontal
        if(this.map[0][0] == char && this.map[1][0] == char && this.map[2][0] == char) return 1;
        if(this.map[0][1] == char && this.map[1][1] == char && this.map[2][1] == char) return 1;
        if(this.map[0][2] == char && this.map[1][2] == char && this.map[2][2] == char) return 1;

        
        //vertical
        if(this.map[0][0] == char && this.map[0][1] == char && this.map[0][2] == char) return 1;
        if(this.map[1][0] == char && this.map[1][1] == char && this.map[1][2] == char) return 1;
        if(this.map[2][0] == char && this.map[2][1] == char && this.map[2][2] == char) return 1;

        //the other ones
        if(this.map[0][0] == char && this.map[1][1] == char && this.map[2][2] == char) return 1;
        if(this.map[0][2] == char && this.map[1][1] == char && this.map[2][0] == char) return 1;

        //else
        return 0;
    }

    checkfordraw(){
        for(var j = this.rows - 1; j >= 0; j--){
            for(var i = 0; i < this.collums; i++){
                if(this.map[i][j] == "-"){
                    return 0;
                }
            }
        }
        return 1;
    }
}

function gf(){
    var msg = "\n";
    for(i = 0; i < 10; i++){
        msg = msg + "GRAND FINALE!!!!!\n";
    }
    return msg;
}


client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
    fs.readFile('ttt/games.txt', function(err, data) {
        if (err){console.error(err); return 0};
        var gamesplayed = parseInt(data.toString());
        for(var i = 0; i < gamesplayed; i++){
            var guildmember1, guildmember2;
            try{
                var betterdata = fs.readFileSync('ttt/game' + i + '.txt',).toString().split("\n");
            }catch{
                break;
            }
            const guilds = client.guilds.cache.array();
            for(var j = 0; j < guilds.length; j++){
                if(guilds[j].id == betterdata[0]){
                    const members = guilds[j].members.cache.array();
                    for(var k = 0; k < members.length; k++){
                        if(members[k].id == betterdata[1]){
                            guildmember1 = members[k];
                        }
                        if(members[k].id == betterdata[2]){
                            guildmember2 = members[k];
                        }
                    }
                    console.log(guilds[j].name);
                }
            }
            tttarray.push(new ttt(3, 3, guildmember1, guildmember2, i));
            for(var j = 3; j < betterdata.length; j++){
                var xy = betterdata[j].split(" ");
                if(j % 2 == 0){
                    tttarray[tttarray.length - 1].playmove(xy[0], xy[1], guildmember1);
                }else{
                    tttarray[tttarray.length - 1].playmove(xy[0], xy[1], guildmember2);
                }
            }
        }
        console.log("loaded ttt games")
    });
})

client.on("message", msg => {
    if (msg.content.toLowerCase() === ".help") {
        msg.reply("\n.help - Shows list of commands. \n\nVoice commands: \n.join - Bot joins the voice channel you are currently in. \n.leave - Bot leves the voice chat. \n.play {Link to a song} - Plays the song. \n.stop - Stops plaing the song. \n.pause - Pauses the song. \n.resume - Resumes the song. \n.volume {Volume level} - Changes the volume of the song. \n\nSkammakrókur commands: \n.sk {User name} - Puts person in skammakrókur. \n.!sk {User name} - Takes person from skammakrókur. \n\nOther commands: \n.permission {User name} {Permission or ALL} - Tales users permisions || note: Her is list for permisions https://discordapp.com/developers/docs/topics/permissions");
    }
});


client.on("message", msg => {
    if (msg.content.toLowerCase() === ".pause") {
        if(dispatcher != false){
            dispatcher.pause();
        }
    }
});
client.on("message", msg => {
    if (msg.content.toLowerCase() === ".resume") {
        if(dispatcher != false){
            dispatcher.resume();
        }
    }
});
client.on("message", msg => {
    if (msg.content.substring(0, 7).toLowerCase() === ".volume") {
        // console.log(msg.content.substring(8, 15) );
        if(msg.content.substring(8, 15) === pasw.toString()){
            volume1 = msg.content.substring(15) / 100;
            console.log(2)
            if(volume1 <= 100){
                if(dispatcher != false){
                    volume = volume1;
                    dispatcher.setVolume(volume);
                }

                msg.reply("Volume set to " + (volume1 * 100).toString() + '%');
            }else{
                msg.reply("The value is to big!");
            }
        }else{
            volume1 = msg.content.substring(7) / 100;
            console.log(1)
            if(volume1 <= 2){
                if(dispatcher != false){
                    volume = volume1;
                    dispatcher.setVolume(volume);
                }

                msg.reply("Volume set to " + (volume1 * 100).toString() + '%');
            }else{
                msg.reply("The value is to big!");
            }
        }
    }
});
client.on("message", msg => {
    if (msg.content.toLowerCase() === ".stop") {
        for (const connection of client.voice.connections.values()) {
            connection.play("");
        }
    }
});
client.on("message", msg => {
    if (msg.content.toLowerCase() === ".join") {

        // console.log(msg.member);

        if(msg.member.voice.channel){
            console.log("joining...");
            msg.member.voice.channel.join()
                .then(connection => {
                    msg.reply("succsesfully joined!");
                    console.log("bot joind the voice chanel");
                });

        }else{
            msg.reply("You must to be in a voice chanel to use this comand!")
        }
    }
})
client.on("message", msg => {
    if (msg.content.toLowerCase() === ".leave") {

        // console.log(msg.guild.voice);

        if(msg.guild.voice){
            console.log("leaving...");
            msg.guild.voice.channel.leave()
            console.log("bot left the voice chanel");
        }else{
            msg.reply("Bot must to be in a voice chanel to use this comand!")
        }
    }
})
client.on("message", msg => {
    if (msg.content.substring(0, 5).toLowerCase() === ".play") {
        // console.log(client.voice.connections.values());
        console.log(msg.content.substring(5));
        const song = msg.content.substring(5);
        if(song == ""){
            dispatcher = broadcast.play("https://www.marxists.org/history/ussr/sounds/mp3/soviet-anthem.mp3");
        }else{
            dispatcher = broadcast.play(ytdl(song, { filter: 'audioonly' }));
        }
        dispatcher.setVolume(volume);
        console.log("plaing " + song);
        for (const connection of client.voice.connections.values()) {
            connection.play(broadcast);
        }
        msg.reply("Plaing " + song)
    }
})

function sk(username, msg){
    var theguild = msg.guild;
    var users = theguild.members.cache.array();
    var userfound = false;
    const roles = theguild.roles.cache.array();
    var rolefound = false;

    //finding role
    for(var i = 0; i < roles.length; i++){
        if(roles[i].name == 'engum líkar við mig'){
            var role = roles[i];
            rolefound = true;
            break;
        }
    }
    if(!rolefound){
        msg.reply("No skammakrókur found.");
        return 0;
    }

    //checking if member has the role
    var senderroles = msg.member.roles.cache.array()
    for(var i = 0; i < senderroles.length; i++){
        if(senderroles[i] == role){
            msg.reply("You are in skammakrókur.");
            return 0;
        }
    }

    //finding user
    for(var i = 0; i < users.length; i++){
        if(users[i].displayName == username || users[i].user.username == username) {
            userfound = true;
            if(users[i].user.bot){//checking fi user is bot
                msg.reply("This user is a bot.");
                break;
            }else if(users[i].permissions.has("ADMINISTRATOR")){//checking if user is admin
                msg.reply("This user is admin.");
                break;
            }
            users[i].roles.add(role);///adding role
            msg.reply(username + " was putted in skammakrókur.");
            break;
        }
    }
    if(!userfound) msg.reply("No " + username + " found.");
}
function ssk(username, msg){
    var theguild = msg.guild;
    var users = theguild.members.cache.array();
    var userfound = false;
    const roles = theguild.roles.cache.array();
    var rolefound = false;

    //finding role
    for(var i = 0; i < roles.length; i++){
        if(roles[i].name == 'engum líkar við mig'){
            var role = roles[i];
            rolefound = true;
            break;
        }
    }
    if(!rolefound){
        msg.reply("No skammakrókur found.");
        return 0;
    }

    //checking if member has the role
    var senderroles = msg.member.roles.cache.array()
    for(var i = 0; i < senderroles.length; i++){
        if(senderroles[i] == role){
            msg.reply("You are in skammakrókur.");
            return 0;
        }
    }

    //finding user
    for(var i = 0; i < users.length; i++){
        if(users[i].displayName == username || users[i].user.username == username) {

            //checking uf user has the role
            var userrolefound = false;
            var usersroles = users[i].roles.cache.array()
            for(var j = 0; j < usersroles.length; j++){
                if(usersroles[j] == role){
                    userrolefound = true;
                    break;
                }
            }
            if(!userrolefound){
                msg.reply(username + " is not in skammakrókur.");
                return 0;
            }
            
            userfound = true;
            users[i].roles.remove(role); //removing role
            msg.reply(username + " was taken from in skammakrókur.");
            break;
        }
    }
    if(!userfound) msg.reply("No " + username + " found.");
}
client.on("message", msg => {//sk commands
    if (msg.content.substring(0, 3).toLowerCase() === ".sk") {
        sk(msg.content.substring(4), msg);
    }else if(msg.content.substring(0, 13).toLowerCase() === ".skammakrokur"){
        sk(msg.content.substring(14), msg);
    }else if(msg.content.substring(0, 4).toLowerCase() === ".!sk") {
        ssk(msg.content.substring(5), msg);
    }else if(msg.content.substring(0, 14).toLowerCase() === ".!skammakrokur"){
        ssk(msg.content.substring(15), msg);
    }
});

client.on("message", msg => {
    if (msg.content.substring(0, 11).toLowerCase() === ".permission") {
        var theguild = msg.guild;
        var users = theguild.members.cache.array();
        permission = msg.content.split(' ');
        permission = permission[permission.length - 1];
        const username = msg.content.substring(12, msg.content.length - permission.length - 1);
        for(var i = 0; i < users.length; i++){
            if(users[i].displayName == username || users[i].user.username == username) {
                const permissions = users[i].permissions.toArray()
                
                if(permission == "ALL"){
                    var outputmsg = username + " permissions are:\n";
                    for(var j = 0; j < permissions.length; j++){
                        outputmsg += permissions[j] + ",\n";
                    }
                    msg.reply(outputmsg);
                    return 0;
                }else{
                    try{
                        var thebool = users[i].permissions.any(permission)
                    } catch (e) {
                        msg.reply(permission + " is not a valid permision")
                        return 0
                    }
                    if(thebool){
                        msg.reply(username + " has " + permission + " permision.")
                    }else{
                        msg.reply(username + " does not have " + permission + " permision.")
                    }
                    return 0
                }
            }
        }
        msg.reply("No " + username + " found.");
    }
});

function tttchalenge(msg, username){
    var theguild = msg.guild;
    var users = theguild.members.cache.array();
    for(var i = 0; i < users.length; i++){
        if(users[i].displayName == username || users[i].user.username == username) {
            for(var j = 0; j < tttarray.length; j++){
                if((tttarray[j].guildmember1 == users[i] && tttarray[j].guildmember2 == msg.member) || (tttarray[j].guildmember2 == users[i] && tttarray[j].guildmember1 == msg.member)){
                    msg.reply('The game alredy exists!');
                    return 0;
                }
            }
            var gamesplayed;
            fs.readFile('ttt/games.txt', function(err, data) {
                if (err){console.error(err); return 0};
                gamesplayed = parseInt(data.toString());

                fs.writeFile("ttt/games.txt", (gamesplayed + 1).toString(), function (err) {if (err){console.error(err); return 0}; console.log('Saved!');});
                fs.writeFile("ttt/game" + gamesplayed.toString() + ".txt", theguild.id + "\n" + msg.member.id + "\n" + users[i] + "\n3 3",  function (err) {if (err){console.error(err); return 0};});
                tttarray.push(new ttt(3, 3, msg.member, users[i], gamesplayed));
                msg.reply(tttarray[tttarray.length - 1].load());
            });

            return 1;
        }
    }
    msg.reply("No " + username + " found.");
    return 0;
}
function tttplay(msg, xy) {
    xy = xy.split(' ');
    const username = msg.content.substring(10 + xy[0].length + xy[0].length + 2);
    var theguild = msg.guild;
    var users = theguild.members.cache.array();
    var notyourmove = false;
    var userfound = false;
    for(var i = 0; i < users.length; i++){
        if(users[i].displayName == username || users[i].user.username == username) {
            userfound = true;
            for(var j = 0; j < tttarray.length; j++){
                if(tttarray[j].guildmember1 == msg.member && tttarray[j].guildmember2 == users[i]){
                    if(tttarray[j].playertomove == 0){
                        if(tttarray[j].playmove(parseInt(xy[0] - 1), parseInt(xy[1] - 1), msg.member)){
                            fs.appendFile("ttt/game" + tttarray[j].numberoofthegame.toString() + ".txt", "\n" + (xy[0] - 1).toString() + " " + (xy[1] - 1).toString(),  function (err) {if (err){console.error(err); return 0};});
                        }

                        msg.channel.send(Discord.APIMessage.transformOptions(tttarray[j].load(), {}, { reply: users[i]}));

                        //check for Win and Draw
                        if(tttarray[j].checkforwin(0)){
                            msg.reply("you won!!!");
                            fs.unlink("ttt/game" + tttarray[j].numberoofthegame.toString() + ".txt", function (err){if (err){console.error(err); return 0}; console.log('File deleted!');});
                            tttarray.splice(j, 1);
                        }else if(tttarray[j].checkfordraw()){
                            msg.reply("It's a draw");
                            fs.unlink("ttt/game" + tttarray[j].numberoofthegame.toString() + ".txt", function (err){if (err){console.error(err); return 0}; console.log('File deleted!');});
                            tttarray.splice(j, 1);
                        }
                        return 1;
                    }else{
                        notyourmove = true;
                    }
                }
                if(tttarray[j].guildmember2 == msg.member && tttarray[j].guildmember1 == users[i]){
                    if(tttarray[j].playertomove == 1){
                        if(tttarray[j].playmove(parseInt(xy[0]) - 1, parseInt(xy[1]) - 1, msg.member)){
                            fs.appendFile("ttt/game" + tttarray[j].numberoofthegame.toString() + ".txt", "\n" + (xy[0] - 1).toString() + " " + (xy[1] - 1).toString(),  function (err) {if (err){console.error(err); return 0};});
                        }

                        msg.channel.send(Discord.APIMessage.transformOptions(tttarray[j].load(), {}, { reply: users[i]}));

                        if(tttarray[j].checkforwin(1)){
                            msg.reply("you won!!!");
                            fs.unlink("ttt/game" + tttarray[j].numberoofthegame.toString() + ".txt", function (err){if (err){console.error(err); return 0}; console.log('File deleted!');});
                            tttarray.splice(j, 1);
                        }else if(tttarray[j].checkfordraw()){
                            msg.reply("It's a draw");
                            fs.unlink("ttt/game" + tttarray[j].numberoofthegame.toString() + ".txt", function (err){if (err){console.error(err); return 0}; console.log('File deleted!');});
                            tttarray.splice(j, 1);
                        }
                        return 1;
                    }else{
                        notyourmove = true;
                    }
                }
            }
        }
    }
    if(notyourmove){
        msg.reply("There is no game where you need to move")
    }else if(!userfound){
        msg.reply("No " + username + " found.");
    }else{
        msg.reply("No game with " + username + " found")
    }
    return 0;
}
function tttdelite(msg, username){
    console.log(username)
    var theguild = msg.guild;
    var users = theguild.members.cache.array();
    for(var i = 0; i < users.length; i++){
        if(users[i].displayName == username || users[i].user.username == username) {
            console.log("username")
            for(var j = 0; j < tttarray.length; j++){
                if((tttarray[j].guildmember1 == users[i] && tttarray[j].guildmember2 == msg.member) || (tttarray[j].guildmember2 == users[i] && tttarray[j].guildmember1 == msg.member)){
                    msg.reply("Game delited!");
                    fs.unlink("ttt/game" + tttarray[j].numberoofthegame.toString() + ".txt", function (err){if (err){console.error(err); return 0}; console.log('File deleted!');});
                    tttarray.splice(j, 1);
                    return 1;
                }
            }
            msg.reply("No game found!")
            return 0;
        }
    }
    msg.reply("No " + username + " found.");
    return 0;
}
function tttshow(msg, username){
    console.log(username)
    var theguild = msg.guild;
    var users = theguild.members.cache.array();
    for(var i = 0; i < users.length; i++){
        if(users[i].displayName == username || users[i].user.username == username) {
            console.log("username")
            for(var j = 0; j < tttarray.length; j++){
                if((tttarray[j].guildmember1 == users[i] && tttarray[j].guildmember2 == msg.member) || (tttarray[j].guildmember2 == users[i] && tttarray[j].guildmember1 == msg.member)){
                    msg.reply(tttarray[j].load());
                    return 1;
                }
            }
            msg.reply("No game found!")
            return 0;
        }
    }
    msg.reply("No " + username + " found.");
    return 0;
}
client.on("message", msg => {//tic-tac-toe
    if (msg.content.substring(0, 4).toLowerCase() === ".ttt") {
        command = msg.content.split(' ')[1];
        if(command == "chalenge"){
            tttchalenge(msg, msg.content.substring(14));
        }else if(command == "play"){
            tttplay(msg, msg.content.substring(10));
        }else if(command == "show"){
            tttshow(msg, msg.content.substring(10));
        }else if(command == "delite"){
            tttshow(msg, msg.content.substring(12));
        }
    }
});

client.on("message", msg => {
    if (true) return 0;
    if (msg.content.substring(0, 9).toLowerCase() === ".getvideo") {
        // console.log(client.voice.connections.values());
        const video = msg.content.substring(9);
        const thevideo = ytdl(video);
        //save(thevideo, 'example.mp3')
        msg.reply(thevideo);
    }
})


client.on("message", msg => {
  if (msg.content.toLowerCase() === "ping") {
    msg.reply("Pong!")
  }
})
client.on("message", msg => {
    if (msg.content.toLowerCase() === "bruh") {
        msg.channel.send("bruh!")
    }
})
client.on("message", msg => {
    if (msg.content.toLowerCase() === "nooo") {
        msg.channel.send("Æjiii, Júúúaa. Æjiia, Dagur!")
    }
})
client.on("guildMemberAdd", member => {
    member.send(
      `Velkomin á serverinn ${member.user.tag}!`
    )
})
client.on("message", msg => {
    if (msg.content.toLowerCase() === "best song") {
        msg.reply("Besti saungur er:\nСоюз нерушимый республик свободных\nСплотила навеки Великая Русь.\nДа здравствует созданный волей народов\nЕдиный, могучий Советский Союз!\n\nСлавься, Отечество наше свободное,\nСлавься, Отечество наше свободное,\nДружбы народов надёжный оплот!\nПартия Ленина — сила народная\nНас к торжеству коммунизма ведёт!\n\nСквозь грозы сияло нам солнце свободы,\nИ Ленин великий нам путь озарил:\nНа правое дело он поднял народы,\nНа труд и на подвиги нас вдохновил!\n\nСлавься, Отечество наше свободное\nДружбы народов надёжный оплот!\nПартия Ленина — сила народная\nНас к торжеству коммунизма ведёт!\n\nВ победе бессмертных идей коммунизма\nМы видим грядущее нашей страны,\nИ Красному знамени славной Отчизны\nМы будем всегда беззаветно верны!\n\nСлавься, Отечество наше свободное,\nДружбы народов надёжный оплот!\nПартия Ленина — сила народная\nНас к торжеству коммунизма ведёт!\n");
        // msg.channel.send("!add https://www.youtube.com/watch?v=U06jlgpMtQs");
        // msg.channel.send("!play");
    }
})
client.on("message", msg => {
    if (msg.content.toLowerCase() === "grand finale" || msg.content.toLowerCase() === "gf") {
        msg.reply(gf());
    }
});

client.login("Token")
