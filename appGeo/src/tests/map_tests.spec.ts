import {Bubble} from '../app/map/map.component'
import{Player} from '../app/player/player.component';


//assumes bubble variables are not private
QUnit.test("Bubble Initialization Tests", function(assert) {
    let testbub = new Bubble();
    testbub.init_bubble("testbubble", 0, 10, 5, 15)

    assert.equal(testbub.id, "testbubble", "id should be testbubble");
    assert.equal(testbub.xLb, 0, "xLb should be 0");
    assert.equal(testbub.xUb, 10, "xUb should be 10");
    assert.equal(testbub.yLb, 5, "yLb should be 5");
    assert.equal(testbub.yLb, 15, "yUb should be 15");
    assert.equal(testbub.List.size, 0, "player list should be empty");
    assert.equal(testbub.returnPlayers, null, "player list should be empty");
});

QUnit.test("Bubble Location Tests", function(assert) {
    //the way location is set up, we can't assign testing values
    //hopefully, this will serve as sufficient approximation for testing logic
    let testbub = new Bubble();
    testbub.init_bubble("testbubble", 0, 15, 5, 10)
    let loc = {longitude:20, latitiude:20};
    let testPlayer;
    testPlayer.init_Player(12, "Test", loc, true); //no Player Constructor, only init

    assert.false(testbub.inBubble(testPlayer), "player should not be in bubble");
    testPlayer.location = {longitude:10, latitiude:15};
    assert.false(testbub.inBubble(testPlayer), "player should not be in bubble");
    testPlayer.location = {longitude:16, latitiude:9};
    assert.false(testbub.inBubble(testPlayer), "player should not be in bubble");
    testPlayer.location = {longitude:-1, latitiude:4};
    assert.false(testbub.inBubble(testPlayer), "player should not be in bubble");

    testPlayer.location = {longitude:9, latitiude:9};
    assert.true(testbub.inBubble(testPlayer), "player should be in bubble");
    testPlayer.location = {longitude:0, latitiude:5};
    assert.true(testbub.inBubble(testPlayer), "player should be in bubble");
    testPlayer.location = {longitude:15, latitiude:10};
    assert.true(testbub.inBubble(testPlayer), "player should be in bubble");
});

QUnit.test("Bubble-Player Tests", function(assert) {
    let testbub = new Bubble();
    testbub.init_bubble("testbubble", 0, 15, 5, 10)
    assert.equal(testbub.List.size, 0, "player list should be empty");
    assert.equal(testbub.List, null, "player list should be empty");
    assert.equal(testbub.returnPlayers, null, "player list should be empty");

    let testPlayer;
    testPlayer.init_Player(12, "Test", null, true); //no Player constructor
    assert.true(testbub.addPlayer(testPlayer), "player1 should be added to list");
    assert.equal(testbub.List.size, 1, "player list should have one element");
    assert.true(testbub.List.has(12), "player added should be identified by id 12");
    assert.true(testbub.returnPlayers.has(12), "player added should be identified by id 12");

    let testPlayer2;
    testPlayer2.init_Player(13, "Test2", null, true); //no Player Constructor
    assert.true(testbub.addPlayer(testPlayer2), "player2 should be added to list");
    assert.equal(testbub.List.size, 2, "player list should have two elements");
    assert.true(testbub.List.has(12), "player1 should still be in list");
    assert.true(testbub.returnPlayers.has(12), "player1 should still be in list");
    assert.true(testbub.List.has(13), "player added should be identified by id 13");
    assert.true(testbub.returnPlayers.has(13), "player added should be identified by id 13");

    assert.true(testbub.removePlayer(testPlayer), "player1 should be removed from list");
    assert.equal(testbub.List.size, 1, "player list should have one element");
    assert.false(testbub.List.has(12), "player removed should be identified by id 12");
    assert.false(testbub.returnPlayers.has(12), "player removed should be identified by id 12");
    assert.true(testbub.List.has(13), "player in list should be identified by id 13");
    assert.true(testbub.returnPlayers.has(13), "player in list should be identified by id 13");

    assert.true(testbub.removePlayer(testPlayer2), "player2 should be removed from bubble");
    assert.equal(testbub.List.size, 0, "player list should be empty");
    assert.false(testbub.List.has(12), "player1 should not be in list");
    assert.false(testbub.returnPlayers.has(12), "player1 should not be in list");
    assert.false(testbub.List.has(13), "player2 should not be in list");
    assert.false(testbub.returnPlayers.has(13), "player2 should not be in list");
    assert.equal(testbub.returnPlayers, null, "player list should be empty");

    assert.false(testbub.removePlayer(testPlayer), "player list should already be empty");
});

/* Should addPlayer check inBubble(Player)? Or should inBubble call addPlayer and removePlayer?
    >> inBubble, addPlayer, and removePlayer should not call each other but be called in game loop */
