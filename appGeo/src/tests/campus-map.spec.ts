import {Bubble} from '~/app/map/map.component'
import {CampusMap} from '~/app/map/campus-map.component'
import{Player} from '~/app/player/player.component';

class Location{

  is_tracking = false;
  longitude = 0 //Default value is being at 0,0
  latitude = 0 //Default value is being at 0,0
  constructor(long, lat){
    this.longitude = long
    this.latitude = lat
  }
}
// Bubbles to place in the CampusMap
  let testbub1 = new Bubble();
  testbub1.init_bubble("testbubble1", 0, 10, 5, 15)
  var testbub2 = new Bubble()
  testbub2.init_bubble("testbub2", 0, 15, 15, 30)
//Locations corresponding to being present in these Bubbles
  var inTB1 = new Location(6, 8)
  var inTB2 = new Location(8, 18)
  var notInB = new Location(20, 40)

//Our test Player going through these locations
  var P1 = new Player()
  P1.init(1, "Player1", inTB1, 1)
  var P2 = new Player()
  P2.init(2, "Player2", inTB1, 1)

  var testMap = new CampusMap(); //should have some bubbles already initialized

QUnit.test("Adding Bubbles to CampusMap", function(assert) {

    assert.false(testMap.MapOfCampus.has(testbub1.id),
     "Should not recognize testbubble1 inside the MapOfCampus");
    testMap.addToMap(testbub1.id, testbub1)
    assert.true(testMap.MapOfCampus.has(testbub1.id), "Should now have testbubble1 added to the MapOfCampus");
});

QUnit.module("Campus Map tests")

QUnit.test("testing the display variable and playerInBubble", function(assert){

  testMap.addToMap(testbub1.id, testbub1)
  testMap.playerInBubble(P1)

  assert.equal(testMap.display,testbub1,
    "should now have the testbubble1 as the display variable")
  testMap.addToMap(testbub2.id, testbub2)
  testMap.playerInBubble(P1)
  testMap.playerInBubble(P2)
  assert.deepEqual(testbub1.playerArray, [P1, P2], "should have P1 and P2 added to the list of players in testbub1");
  P1.location = inTB2
  testMap.playerInBubble(P1)
  assert.deepEqual(testbub1.playerArray, [P2], "should have P2 as the only player in the list of Players found in testbub1");
  assert.deepEqual(testbub2.playerArray, [P1], "should have P1 placed inside the List of players for testbub2")
  P2.alive = 0
  testMap.playerInBubble(P2)
  assert.false(testbub1.playerArray.includes(P2), "should not have player 2 in the Bubble anymore")
  P2.location = inTB2
  testMap.playerInBubble(P2)
  assert.false(testbub2.playerArray.includes(P2), "should not have P2 in testbubble 2 either")
  P1.location = notInB
  testMap.playerInBubble(P1)
  assert.deepEqual(testMap.display.id, 'The Outside of any assigned Campuse Buildings', "should have recognized the player is Off Campus")
  var checking = new Player()
  checking.init(1, "PoT_To", {longitude: 41.78495048653673, latitude: -87.59665817689283}, 1)
  testMap.playerInBubble(checking)
  assert.deepEqual(testMap.display.id, "Woodlawn Dining Commons", "should recognize that player is in wood")

})





