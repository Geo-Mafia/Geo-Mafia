import { QUnit } from "qunit"; //import is from "qunit", where is it located?
import { bubble } from "src/app/map/map.component"; //imports from map.component.ts
// import { Player } from  --when player is merged

QUnit.module("Bubble Tests");

//assumes bubble variables are not private
QUnit.test("Bubble Initialization Tests", function(assert) {
    let testbub = new bubble("testbub", 0, 10, 5, 15);

    assert.equal(testbub.ID, "testbub", "bubble_init should set id as testbub");
    assert.equal(testbub.x_lB, 0, "x_lb should be 0");
    assert.equal(testbub.x_uB, 10, "x_ub should be 10");
    assert.equal(testbub.y_lB, 5, "y_lb should be 5");
    assert.equal(testbub.y_uB, 15, "y_up should be 15");
    assert.equal(testbub.arrlen, 0, "player list should be empty");
    assert.equal(testbub.returnPlayers(), null, "player list should be empty");
});

QUnit.test("Bubble Update Tests", function(assert) {
    /* NOTE: player functions will be added when player is merged,
        however, player functions will not be tested in this file */
    let testbub = new bubble("testbub", 0, 15, 0, 15);
    assert.equal(testbub.arrlen, 0, "player list should be empty");
    assert.equal(testbub.returnPlayers(), null, "player list should be empty");

    let testPlayer = new Player(); //player constructor, set username as "Test"
    //function that sets player location outside of bubble
    assert.false(testbub.inBubble(testPlayer), "player should not be in bubble");
    //update player to be in boundaries
    assert.true(testbub.inBubble(testPlayer), "player should be in bubble");

    assert.true(testbub.addPlayer(testPlayer), "player should be added to bubble");
    assert.equal(testbub.arrlen, 1, "player list should have one element");
    assert.equal(testbub.players[0].username, "Test", "player added should be identified by username Test");
   //assert.equal(testbub.returnPlayers().[0].username, "Test", "player added should be identified by username Test");

    assert.true(testbub.removePlayer(testPlayer), "player should be removed from bubble");
    assert.equal(testbub.arrlen, 0, "player list should be empty");
    assert.equal(testbub.returnPlayers(), null, "player list should be empty");

    /* Should addPlayer check inBubble(Player)? Or should inBubble call addPlayer and removePlayer?
        >> inBubble, addPlayer, and removePlayer should not call each other but be called in game loop */
    
});