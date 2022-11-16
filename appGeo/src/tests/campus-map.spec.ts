import {CampusMap} from 'src/app/map/campus-map.component';
import {Bubble} from 'src/app/map/map.component'
import{Player} from 'src/app/player/player.component';

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

//Our test Player going through these locations
  var P1 = new Player();
  P1.init_Player(1, "Player1", inTB1, 1)
  var P2 = new Player();
  P1.init_Player(2, "Player2", inTB1, 1)

  var testMap = new CampusMap(); //should have some bubbles already initialized

  function displayMap(gmap){
    for (let name of this.MapOfCampus.keys()) {
      console.log(name);
    }
  }


QUnit.test("testing the display variable and playerInBubble", function(assert){
  assert.equal(testMap.display,
              { List: {},
                id: 'Crerar',
                xLb: 41.7901331,
                xUb: 41.7909298,
                yLb: -87.6025138,
                yUb: -87.6031023},
              "should have the Crerar bubble initially as the display variable")
  testMap.addToMap(testbub1.id, testbub1)
  testMap.playerInBubble(P1)
  assert.equal(testMap.display,
    { List: {},
      id: 'testbubble1',
      xLb: 0,
      xUb: 10,
      yLb: 5,
      yUb: 15},
    "should now have the testbubble1 as the display variable")
  testMap.addToMap(testbub2.id, testbub2)
  testMap.playerInBubble(P1)
  testMap.playerInBubble(P2)
  assert.equal(testbub1.playerArray, {P1, P2}, "should have P1 and P2 added to the list of players in testbub1");
  P1.location = inTB2
  testMap.playerInBubble(P2)
  assert.equal(testbub1.playerArray, {P1}, "should have P1 as the only player in the list of Players found in testbub1");
  assert.equal(testbub2.playerArray, {P2}, "should have P2 placed inside the List of players for testbub2")
})


QUnit.test("Adding Bubbles to CampusMap", function(assert) {

    assert.equal(displayMap(testMap), "Crerar\nBookstore\nHinds Lab\nKovler\nCobb Hall\nGodspeed Hall\nWeiboldt Hall\nHarper",
     "Should show the names of the immediately initialized list of the MapofCampus");
    testMap.addToMap(testbub1.id, testbub1)
    assert.equal(displayMap(testMap), "Crerar\nBookstore\nHinds Lab\nKovler\nCobb Hall\nGodspeed Hall\nWeiboldt Hall\nHarper\ntestbubble1", "Should show the names of the bubbles + the new added bubble, testbubble1");
});


