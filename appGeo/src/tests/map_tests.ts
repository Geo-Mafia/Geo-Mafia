import { QUnit } from "qunit"; //import is from "qunit", where is it located?
import { bubble } from "src/app/map/map.component";
//import player

//assumes bubble variables are not private
QUnit.test("Bubble Initialization", function(assert) {
    let testbub = new bubble("testbub", 0, 10, 5, 15);

    assert.equal(testbub.ID, "testbub", "bubble_init should set id as testbub");
    assert.equal(testbub.x_lB, 0, "x_lb should be 0");
    assert.equal(testbub.x_uB, 10, "x_ub should be 10");
    assert.equal(testbub.y_lB, 5, "y_lb should be 5");
    assert.equal(testbub.y_uB, 15, "y_up should be 15");
    assert.equal(testbub.arrlen, 0, "player list should be empty");
    assert.equal(testbub.getPlayers(), null, "player list should be empty");
});

QUnit.test("Bubble Updates", function(assert) {
    let testbub = new bubble("testbub", 0, 15, 0, 15);
    assert.equal(testbub.arrlen, 0, "player list should be empty");
    assert.equal(testbub.getPlayers(), null, "player list should be empty");

    let testPlayer = new Player();
    //function that sets player location outside of bubble
    assert.false(testbub.inBubble(testPlayer), "player should not be in bubble");
    //update player to be in boundaries
    assert.true(testbub.inBubble(testPlayer), "player should be in bubble");

    assert.true(testbub.addPlayer(testPlayer), "player should be added to bubble");
    assert.equal(testbub.arrlen, 1, "player list should have one element");
    //check that player is in list

    assert.true(testbub.removePlayer(testPlayer), "player should be removed from bubble");
    assert.equal(testbub.arrlen, 0, "player list should be empty");
    assert.equal(testbub.getPlayers(), null, "player list should be empty");

    /* Should addPlayer check inBubble(Player)? Or should inBubble call addPlayer and removePlayer?
        >> inBubble, addPlayer, and removePlayer should not call each other but be called in game loop */
    
});