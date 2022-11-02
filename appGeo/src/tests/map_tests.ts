//include map(?), which should include player

/* Bubble{
    //variables
    -string id
    -number x_lowerBoundary (x_lb)
    -number x_upperBoundary (x_ub)
    -number y_lb
    -number y_up
    -number arr_len (length of player array)
    -Array<Player>
    //methods
    -bool bubble_init(id, x_lb, x_ub, y_lb, y_ub) //create + init bubble
    -bool addPlayer(Player) //adds player to array and updates arr_len
    -bool removePlayer(Player) //removes player from array and updates arr_len
    -bool inBubble(Player) //checks player location to see if they are within bubble boundaries
    -Array<Players> retPlayers() //returns list of players in bubble
} */

//bubble_init creates a bubble, sets the id + boundaries, and creates an empty player list
//bubble_init(string id, int/float x_lb, int/flt x_ub, y_lb, y_ub)
//assumes bubble variables are not private
QUnit.test("Bubble Initialization", function(assert) {
    assert.true(bubble_init("test", 0, 1, 2, 3), "bubble_init should return true");
    const testbub = bubble_init("testbub", 0, 10, 5, 15);
    assert.equal(testbub.id, "testbub", "bubble_init should set id as testbub");
    assert.equal(testbub.x_lb, 0, "x_lb should be 0");
    assert.equal(testbub.x_ub, 10, "x_ub should be 10");
    assert.equal(testbub.y_lb, 5, "y_lb should be 5");
    assert.equal(testbub.y_ub, 15, "y_up should be 15");
    assert.equal(testbub.arr_len, 0, "player list should be empty");
    assert.equal(testbub.getPlayers(), null, "player list should be empty");
});

QUnit.test("Bubble Updates", function(assert) {
    let testbub = bubble_init("testbub", 0, 15, 0, 15);
    assert.equal(testbub.arr_len, 0, "player list should be empty");
    assert.equal(testbub.getPlayers(), null, "player list should be empty");

    let testPlayer = player_init();
    //function that sets player location outside of bubble
    assert.false(testbub.inBubble(testPlayer), "player should not be in bubble");
    //update player to be in boundaries
    assert.true(testbub.inBubble(testPlayer), "player should be in bubble");

    assert.true(testbub.addPlayer(testPlayer), "player should be added to bubble");
    assert.equal(testbub.arr_len, 1, "player list should have one element");
    //check that player is in list

    assert.true(testbub.removePlayer(testPlayer), "player should be removed from bubble");
    assert.equal(testbub.arr_len, 0, "player list should be empty");
    assert.equal(testbub.getPlayers(), null, "player list should be empty");

    /* Should addPlayer check inBubble(Player)? Or should inBubble call addPlayer and removePlayer?
        >> inBubble, addPlayer, and removePlayer should not call each other but be called in game loop */
    
});