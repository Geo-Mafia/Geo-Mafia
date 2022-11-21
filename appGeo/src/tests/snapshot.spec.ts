import { assert } from 'qunit';
import {Bubble} from '../app/map/map.component'
import {Player} from '../app/player/player.component';
import {Snapshot} from '../app/snapshot/snapshot_class_declaration'

const ALIVE = 1

export class Location{
    x
    constructor(integer){
        this.x = integer;
    }
}

const Location1 = new Location(1);
//player and snapshot ids are different to ensure correct assignments
const Jack = new Player()
Jack.init(13, 'Jack', Location1, ALIVE);
const Mark = new Player()
Mark.init(25, 'Mark', Location1, ALIVE);

QUnit.module("Snapshot_Testing");

QUnit.test("Testing receiving data", function(assert) {
    const bub = new Bubble();
    bub.init_bubble("Bubble", 0, 0, 0, 0);
    assert.true(bub.addPlayer(Jack), "player should be added to player list");

    const snap = new Snapshot(1, bub);
    assert.deepEqual(snap.snapshot_content, ['Jack'], "player should be added to bubble");

    assert.equal(snap.getSnapshotID(), 1, "snapshot id should be 1");
    assert.equal(snap.getSnapshotBubbleID(), "Bubble", "should have id: Bubble");

    assert.deepEqual(snap.snapshot_content, ['Jack'], "should show that the property of arrays is same");
    assert.true(snap.snapshot_content.includes('Jack'), "Jack should be included in the list of players")
    assert.false(snap.snapshot_content.includes('Mark'), "Mark should not be in the content bubbble");
    //just need to assure that a date object is initialized
    assert.ok(snap.snapshot_time, "should recognize that there is a string initialized in the class to represent time")
});

QUnit.test("Testing depth of name Array", function(assert){
  const bubb = new Bubble()
  bubb.init_bubble("Bubble", 0, 0, 0, 0)
  bubb.addPlayer(Jack)
  //returnPlayers map is struggling to find the key, but the string array is correctly set
  assert.true(bubb.returnPlayers.has(Jack.getUserID()), "should come out true that Jack is in the map of Players")
  assert.equal(bubb.playerArray.includes(Jack), 1, "should check if Jack is found/contained inside the array of usernames")

  const snap = new Snapshot(1, bubb);
  //checks if the additions changed the bubble's playerArray
  //alogside the snapshot_content array, they both are represented differently
  //now but need to make sure the snapshot_content is not affected by bubble changes
  assert.equal(snap.getSnapshotContent().includes('Jack'),1,"Should show that Jack's username is the content array");

  //removing and adding players to bubble
  assert.true(bubb.addPlayer(Mark), "player Mark should be added to original bubble");
  assert.true(bubb.removePlayer(Jack), "player Jack should be removed from original bubble");

  //comparing the Bubble's PlayerArray state to the snapshot_content array state
  assert.false(snap.getSnapshotContent().includes('Mark'),"Mark should not be found in the snapshot array");
  assert.true(bubb.playerArray.includes(Mark), "should count Mark present in the bubble's Player array now");
  assert.true(snap.getSnapshotContent().includes('Jack'),"Jack should still be found in the snapshot array");
  assert.false(bubb.playerArray.includes(Jack),"Jack should not be found in the bubble's playerArray");


})
