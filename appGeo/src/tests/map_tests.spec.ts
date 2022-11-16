import {Bubble} from '../app/map/map.component'; //imports from map.component.js
import {Player} from '../app/player/player_class_declaration';

// const Bubble_test = require('../map.component.js');

QUnit.module("Bubble_test");

//assumes bubble variables are not private
QUnit.test("Bubble Initialization Tests", function(assert) {

    let testbub = new Bubble();
    testbub.init_bubble("testbubble", 0, 10, 5, 15);

    assert.equal(testbub.id, "testbubble", "id should be testbubble");
    assert.equal(testbub.xLb, 0, "xLb should be 0");
    assert.equal(testbub.xUb, 10, "xUb should be 10");
    assert.equal(testbub.yLb, 5, "yLb should be 5");
    assert.equal(testbub.yLb, 15, "yUb should be 15");
    assert.equal(testbub.List.length, 0, "player list should be empty");
    assert.equal(testbub.returnPlayers, null, "player list should be empty");
});

QUnit.test("Bubble Location Tests", function(assert) {
    let testbub = new Bubble();
    testbub.init_bubble("testbubble", 0, 15, 5, 10);

    let loc = {x:20, y:20};
    let testPlayer = new Player(12, "player1", loc, true);

    assert.false(testbub.inBubble(testPlayer), "player should not be in bubble");
    testPlayer.location = {x:10, y:15};
    assert.false(testbub.inBubble(testPlayer), "player should not be in bubble");
    testPlayer.location = {x:16, y:9};
    assert.false(testbub.inBubble(testPlayer), "player should not be in bubble");
    testPlayer.location = {x:-1, y:4};
    assert.false(testbub.inBubble(testPlayer), "player should not be in bubble");
    
    testPlayer.location = {x:9, y:9};
    assert.true(testbub.inBubble(testPlayer), "player should be in bubble");
    testPlayer.location = {x:0, y:5};
    assert.true(testbub.inBubble(testPlayer), "player should be in bubble");
    testPlayer.location = {x:15, y:10};
    assert.true(testbub.inBubble(testPlayer), "player should be in bubble");
});

QUnit.test("Bubble-Player Tests", function(assert) {
    let testbub = new Bubble();
    testbub.init_bubble("testbubble", 0, 15, 5, 10);

    assert.equal(testbub.List.length, 0, "player list should be empty");
    assert.equal(testbub.returnPlayers, null, "player list should be empty");

    let loc = {x:20, y:20};
    let testPlayer = new Player(12, "player1", loc, true);
    assert.true(testbub.addPlayer(testPlayer), "player1 should be added to bubble");
    assert.equal(testbub.List.length, 1, "player list should have one element");
    assert.equal(testbub.List[0].userID, 12, "player added should be identified by id 12");
    assert.equal(testbub.returnPlayers[0].userID, 12, "player added should be identified by id 12");

    let testPlayer2 = new Player(13, "player2", loc, true);
    assert.true(testbub.addPlayer(testPlayer2), "player2 should be added to bubble");
    assert.equal(testbub.List.length, 2, "player list should have two elements");
    assert.equal(testbub.List[1].userID, 13, "player added should be identified by id 13");
    assert.equal(testbub.returnPlayers[1].userID, 13, "player added should be identified by id 13");    

    assert.true(testbub.removePlayer(testPlayer), "player1 should be removed from bubble");
    assert.equal(testbub.List.length, 1, "player list should have one element");
    assert.equal(testbub.List[0].userID, 13, "player in list should be identified by id 13");
    assert.equal(testbub.returnPlayers[0].userID, 13, "player in list should be identified by id 13");

    assert.true(testbub.removePlayer(testPlayer2), "player2 should be removed from bubble");
    assert.equal(testbub.List.length, 0, "player list should be empty");
    assert.equal(testbub.returnPlayers, null, "player list should be empty");

    assert.false(testbub.removePlayer(testPlayer), "player list should already be empty");
});

/* Should addPlayer check inBubble(Player)? Or should inBubble call addPlayer and removePlayer?
    >> inBubble, addPlayer, and removePlayer should not call each other but be called in game loop */
