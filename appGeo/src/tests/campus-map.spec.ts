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


})

QUnit.test("testing playersBubble", function(assert){
  let t_map = new CampusMap()
  let bub1 = new Bubble(), bub2 = new Bubble
  bub1.init_bubble("id1", 1000, 1010, 1000, 1010)
  bub2.init_bubble("id2", 1020, 1030, 1020, 1030)
  t_map.addToMap(bub1.NameOfBubble, bub1)
  t_map.addToMap(bub2.NameOfBubble, bub2)

  let loc1 = {longitude:1009, latitude:1009}, loc2 = {longitude:1025, latitude:1025}
  let py1 = new Player(), py2 = new Player()
  py1.init(1, "py1", loc1, 1)
  py2.init(2, "py2", loc2, 1)
  t_map.playerInBubble(py1)
  t_map.playerInBubble(py2)

  //inBubble passes but not playersBubble
  assert.true(bub1.inBubble(py1), "py1 should be in bub1")
  assert.equal(bub1.NameOfBubble, testMap.playersBubble(py1).NameOfBubble, "returned bubble 1 should have the same id as original")
  assert.true(bub2.inBubble(py2), "py2 should be in bub2")
  assert.equal(bub2.NameOfBubble, testMap.playersBubble(py2).NameOfBubble, "returned bubble 2 should have the same id as original")
})





