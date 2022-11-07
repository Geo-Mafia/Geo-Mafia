import {bubble} from 'src/app/map/map.component.js'; //imports from map.component.js
import{Player} from 'src/app/map/player.component.js';
import{QUnit} from 'qunit'

const Bubble_test = require('../map.component.js');

QUnit.module("Bubble_test");

//assumes bubble variables are not private
QUnit.test("Bubble Initialization Tests", function(assert) {
    let testbub = new bubble("testbub", 0, 10, 5, 15);

    assert.equal(testbub.ID, "testbub", "bubble_init should set id as testbub");
    assert.equal(testbub.x_lb, 0, "x_lb should be 0");
    assert.equal(testbub.x_ub, 10, "x_ub should be 10");
    assert.equal(testbub.y_lb, 5, "y_lb should be 5");
    assert.equal(testbub.y_ub, 15, "y_up should be 15");
    assert.equal(testbub.List.size(), 0, "player list should be empty");
    assert.equal(testbub.returnPlayers(), null, "player list should be empty");
});

QUnit.test("Bubble Location Tests", function(assert) {
    /* NOTE: player functions will be added when player is merged,
        however, player functions will not be tested in this file */
    let testbub = new bubble("testbub", 0, 15, 0, 15);
    let loc = [20, 20];
    let testPlayer = new Player(12, Test, loc, true);

    assert.false(testbub.inBubble(testPlayer), "player should not be in bubble");
    testPlayer.location = [10, 20];
    assert.false(testbub.inBubble(testPlayer), "player should not be in bubble");
    testPlayer.location = [20, 10];
    assert.false(testbub.inBubble(testPlayer), "player should not be in bubble");
    testPlayer.location = [-1, -1];
    assert.false(testbub.inBubble(testPlayer), "player should not be in bubble");
    
    testPlayer.location = [10,10];
    assert.true(testbub.inBubble(testPlayer), "player should be in bubble");
    testPlayer.location = [0,0];
    assert.true(testbub.inBubble(testPlayer), "player should be in bubble");
    testPlayer.location = [15,15];
    assert.true(testbub.inBubble(testPlayer), "player should be in bubble");
});

QUnit.test("Bubble-Player Tests", function(assert) {
    let testbub = new bubble("testbub", 0, 15, 0, 15);
    assert.equal(testbub.List.size(), 0, "player list should be empty");
    assert.equal(testbub.returnPlayers(), null, "player list should be empty");

    let loc = [20, 20];
    let testPlayer = new Player(12, Test, loc, true);
    
    assert.true(testbub.addPlayer(testPlayer), "player should be added to bubble");
    assert.equal(testbub.List.size(), 1, "player list should have one element");
    assert.equal(testbub.List[0].userID, 12, "player added should be identified by id 12");
    assert.equal(testbub.returnPlayers()[0].userID, 12, "player added should be identified by id 12");

    assert.true(testbub.removePlayer(testPlayer), "player should be removed from bubble");
    assert.equal(testbub.List.size(), 0, "player list should be empty");
    assert.equal(testbub.returnPlayers(), null, "player list should be empty");
});

/* Should addPlayer check inBubble(Player)? Or should inBubble call addPlayer and removePlayer?
        >> inBubble, addPlayer, and removePlayer should not call each other but be called in game loop */