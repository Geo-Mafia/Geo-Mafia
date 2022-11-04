import {Player} from './player_class_declaration.js';
import {Killer} from './player_class_declaration.js';

const DEAD = 0
const ALIVE = 1
const SUCCESS = 10
const FAILURE = -10
const DAILYMAXKILLCOUNT = 2

export class Location{
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

QUnit.test("a player gets killed", assert => {
    assert.equal(player1.getKilled(), SUCCESS);
    assert.equal(player1.alive, DEAD);
});

QUnit.test("takes a snapshot of player locations", assert => {
    assert.equal(player1.takeSnapshot(), SUCCESS);
});

QUnit.test("player opens a snapshot", assert => {
    assert.equal(player1.open_snapshot(), SUCCESS);
});

var playerMap = new Map();
playerMap.set('player1', Location1);
playerMap.set('player2', Location1);
playerMap.set('player3', Location2);

// Need to user the player_class_declaration
QUnit.test("player checks the info of other people in the same bubble", 
assert => {
    assert.equal(player1.see_people_in_bubble(playerMap), ['player2']);
});

QUnit.test("player opens a chat message", assert => {
    assert.equal(player1.open_chat(), SUCCESS);
});

QUnit.test("player sends out a chat message", assert => {
    assert.equal(player1.send_chat(message), SUCCESS);
});

QUnit.test("player receives a chat message", assert => {
    assert.equal(player1.receive_chat(message), SUCCESS);
});

QUnit.test("player votes for another player", assert => {
    assert.equal(player1.voteForExecution(player2), SUCCESS);
    assert.equal(player2.votes, 1);
});

QUnit.test("killer kills a player", assert => {
    assert.equal(killer1.kill_player(player1, playerMap.get_player_hash()), SUCCESS);
});

QUnit.test("the total number of kills done by killer1 after 1 kill", assert => {
    assert.equal(killer1.get_total_kill_count(), 1);
});

QUnit.test("the total number of kills remaining for killer1 after 1 kill has decremented", 
assert => {
    assert.equal(killer1.remaining_daily_kill_count(), (DAILYMAXKILLCOUNT-1));
});
