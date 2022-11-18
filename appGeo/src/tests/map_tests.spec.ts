import {Bubble} from '../app/map/map.component'; 
import {Player} from '../app/player/player.component';

const DEAD = 0
const ALIVE = 1

QUnit.module("Bubble_test");

//assumes bubble variables are not private
QUnit.test("Bubble Initialization Tests", function(assert) {

    let testbub = new Bubble();
    testbub.init_bubble("testbubble", 0, 10, 5, 15);

    assert.equal(testbub.id, "testbubble", "id should be testbubble");
    assert.equal(testbub.xLb, 0, "xLb should be 0");
    assert.equal(testbub.xUb, 10, "xUb should be 10");
    assert.equal(testbub.yLb, 5, "yLb should be 5");
    assert.equal(testbub.yUb, 15, "yUb should be 15");
    assert.equal(testbub.List.size, 0, "player list should be empty");
    //it is sufficient to assert that the player list has no elements
});

QUnit.test("Bubble Location Tests", function(assert) {
    let testbub = new Bubble();
    testbub.init_bubble("testbubble", 0, 15, 5, 10);

    //must be named longitude and latitude respectively for the tests to pass
    let loc = {longitude:20, latitude:20};
    let testPlayer = new Player()
    testPlayer.init(12, "player1", loc, ALIVE);

    assert.false(testbub.inBubble(testPlayer), "player should not be in bubble");
    testPlayer.location = {longitude:10, latitude:15};
    assert.false(testbub.inBubble(testPlayer), "player should not be in bubble");
    testPlayer.location = {longitude:16, latitude:9};
    assert.false(testbub.inBubble(testPlayer), "player should not be in bubble");
    testPlayer.location = {longitude:-1, y:4};
    assert.false(testbub.inBubble(testPlayer), "player should not be in bubble");
    
    testPlayer.location = {longitude:9, latitude:9};
    assert.true(testbub.inBubble(testPlayer), "player should be in bubble");
    testPlayer.location = {longitude:0, latitude:5};
    assert.true(testbub.inBubble(testPlayer), "player should be in bubble");
    testPlayer.location = {longitude:15, latitude:10};
    assert.true(testbub.inBubble(testPlayer), "player should be in bubble");
});

QUnit.test("Bubble-Player Tests", function(assert) {
    let testbub = new Bubble();
    testbub.init_bubble("testbubble", 0, 15, 5, 10);

    assert.equal(testbub.List.size, 0, "player list should be empty");
    assert.equal(testbub.returnPlayers.size, 0, "player list should be empty");

    //switched to map.has instead of userID equal because of issues calling getUserID
    let loc = {longitude:20, latitude:20};
    let testPlayer = new Player()
    testPlayer.init(12, "player1", loc, ALIVE);
    assert.false(testbub.List.has(12), "player1 should not be in list yet");
    assert.true(testbub.addPlayer(testPlayer), "player1 should be added to bubble");
    assert.equal(testbub.List.size, 1, "player list should have one element");
    assert.equal(testbub.returnPlayers.size, 1, "player list should have one element");
    assert.true(testbub.List.has(12), "player added should be identified by id 12");
    assert.true(testbub.returnPlayers.has(12), "player added should be identified by id 12");

    let loc2 = {longitude:10, latitude:10};
    let testPlayer2 = new Player()
    testPlayer2.init(13, "player2", loc2, ALIVE);
    assert.false(testbub.List.has(13), "player2 should not be in list yet");
    assert.true(testbub.addPlayer(testPlayer2), "player2 should be added to bubble");
    assert.equal(testbub.List.size, 2, "player list should have two elements");
    assert.equal(testbub.returnPlayers.size, 2, "player list should have two elements");
    assert.true(testbub.List.has(13), "player added should be identified by id 13");
    assert.true(testbub.returnPlayers.has(13), "player added should be identified by id 13");
    assert.true(testbub.List.has(12), "player1 should still be in list");
    assert.true(testbub.returnPlayers.has(12), "player1 should still be in list");    

    assert.true(testbub.removePlayer(testPlayer), "player1 should be removed from bubble");
    assert.equal(testbub.List.size, 1, "player list should have one element");
    assert.equal(testbub.returnPlayers.size, 1, "player list should have one element");
    assert.false(testbub.List.has(12), "player1 should not be in list anymore");
    assert.true(testbub.List.has(13), "player2 should still be in list");
    assert.false(testbub.returnPlayers.has(12), "player1 should not be in list anymore");
    assert.true(testbub.returnPlayers.has(13), "player2 should still be in list");

    assert.true(testbub.removePlayer(testPlayer2), "player2 should be removed from bubble");
    assert.false(testbub.List.has(13), "player2 should not be in list anymore");
    assert.false(testbub.returnPlayers.has(13), "player2 should not be in list anymore");
    assert.equal(testbub.List.size, 0, "player list should be empty");
    assert.equal(testbub.returnPlayers.size, 0, "player list should be empty");

    assert.false(testbub.removePlayer(testPlayer), "player list should already be empty");
});

/* Should addPlayer check inBubble(Player)? Or should inBubble call addPlayer and removePlayer?
    >> inBubble, addPlayer, and removePlayer should not call each other but be called in game loop */
