// import {Chat} from '../app/chat/chat_class_declaration.js';
// import {Player} from '../app/player/player_class_declaration.js';
// import {Killer} from '../app/player/player_class_declaration.js';

import {Chat} from '../app/chat/chat_class_declaration';
import {Player} from '../app/player/player_class_declaration';
import {Killer} from '../app/player/player_class_declaration';


const DEAD = 0
const ALIVE = 1
const SUCCESS = 10
const FAILURE = -10
const DAILYMAXKILLCOUNT = 2

class Location{
    location // An int

    constructor(location){
        this.location = location
    }
}

const Location1 = new Location(1);
const Location2 = new Location(2);

const player1 = new Player(1, 'player1', Location1, ALIVE);
const player2 = new Player(2, 'player2', Location1, ALIVE); 
const killer1 = new Killer(3, 'killer1', Location2, ALIVE); 

const chat1 = new Chat(1);
chat1.insertPlayer(player1)
chat1.insertPlayer(player2)
chat1.insertPlayer(killer1)

QUnit.test("a player gets killed", assert => {
    assert.equal(player1.getKilled(), SUCCESS);
    assert.equal(player1.alive, DEAD);
});

// QUnit.test("takes a snapshot of player locations", assert => {
//     assert.equal(player1.takeSnapshot(), SUCCESS);
// });

// QUnit.test("player opens a snapshot", assert => {
//     assert.equal(player1.openSnapshot(), SUCCESS);
// });

var all_players = new Array(player1, player2, killer1);

// Need to user the player_class_declaration
QUnit.test("player checks the info of other people in the same bubble", 
assert => {
    var new_arr = new Array(player1, player2)
    assert.equal(player1.seePeopleInBubble(all_players), new_arr);
});

// QUnit.test("player opens a chat message", assert => {
//     assert.equal(player1.openChat(), SUCCESS);
// });

QUnit.test("player sends out a chat message", assert => {
    assert.equal(player2.sendChatMessage(1, "Message that we are sending"), SUCCESS);
});

QUnit.test("player votes for another player", assert => {
    assert.equal(player1.voteForExecution(2), SUCCESS);
    assert.equal(player2.voteForExecution(3), SUCCESS);
    assert.equal(killer1.votes, 1);
});

// QUnit.test("killer kills a player", assert => {
//     //Check that the killPlayer() function succeeds
//     assert.equal(killer1.killPlayer(1, playerMap.get_player_hash()), SUCCESS);
//     //Check the number of Kills that Killer 1 commited
//     assert.equal(killer1.getTotalKillCount(), 1);
//     assert.equal(player1.getAliveStatus(), DEAD);
//     //Check the Remaining Amount of Kills left
//     assert.equal(killer1.getRemainingDailyKillCount(), (DAILYMAXKILLCOUNT - 1));
// });
