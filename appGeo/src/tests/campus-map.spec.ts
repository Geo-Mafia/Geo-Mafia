import {CampusMap} from 'src/app/map/campus-map.component';
import {Bubble} from 'src/app/map/map.component'
import{Player} from 'src/app/player/player.component';

const CampusMap_test = require('../map.component');

QUnit.module("CampusMap_Testing");

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

//assumes bubble variables are not private
QUnit.test("Adding Bubbles to CampusMap", function(assert) {


    assert.equal(displayMap(testMap), "Crerar\nBookstore\nHinds Lab\nKovler\nCobb Hall\nGodspeed Hall\nWeiboldt Hall\nHarper",
     "Should be immediately initialized list of the MapofCampus");
    assert.equal(testbub1.xLb, 0, "xLb should be 0");
    assert.equal(testbub1.xUb, 10, "xUb should be 10");
    assert.equal(testbub1.yLb, 5, "yLb should be 5");
    assert.equal(testbub1.yLb, 15, "yUb should be 15");
    assert.equal(testbub1.List.size, 0, "player list should be empty");
    assert.equal(testbub1.returnPlayers, null, "player list should be empty");
});
