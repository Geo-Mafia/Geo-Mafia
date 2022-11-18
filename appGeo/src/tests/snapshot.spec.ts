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
const player1 = new Player()
player1.init(1, 'Jack', Location1, ALIVE);
const Mark = new Player()
Mark.init(25, 'Mark', Location1, ALIVE);

QUnit.module("Snapshot_Testing");

QUnit.test("Testing receiving data", function(assert) {
    const bub = new Bubble();
    bub.init_bubble("Bubble", 0, 0, 0, 0);
    bub.addPlayer(player1)

    const snap = new Snapshot(1, bub);
    assert.deepEqual(snap.snapshot_content, ['Jack'], "player should be added to bubble");

    assert.equal(snap.getSnapshotID(), 1, "snapshot id should be 1");
    assert.equal(snap.getSnapshotBubbleId(), "Bubble", "should have id: Bubble");

    assert.deepEqual(snap.snapshot_content, ['Jack'], "should show that the property of arrays is same");
    assert.true(snap.snapshot_content.includes(player1.username), "Jack should be included in the list of players")
    assert.false(snap.snapshot_content.includes(Mark.username), "Mark should not be in the content bubbble");
    //just need to assure that a date object is initialized
    assert.ok(snap.snapshot_time, "should have a string initialized in the class to represent time")
    bub.addPlayer(Mark)
});
QUnit.test("Testing depth of name Array", function(assert){
  const bubb = new Bubble()
  bubb.init_bubble("Bubble", 0, 0, 0, 0)
  bubb.addPlayer(player1)
  assert.propContains(bubb.returnPlayers, {Player: {username : 'Jack'} }, "should check if Jack is found/contained inside the array of usernames")

  const snap = new Snapshot(1, bubb);
  //checks if the additions changed the bubble's playerArray
  //alogside the snapshot_content array, they both are represented differently
  //now but need to make sure the snapshot_content is not affected by bubble changes
  assert.equal(snap.getSnapshotContent().includes('Jack'),1,"Should show that Jack's username is the content array")
  bubb.addPlayer(Mark)
  assert.false(snap.getSnapshotContent().includes('Mark'),"Mark should not be found in this array")
  assert.true(bubb.playerArray.includes(Mark), "should count Mark present in this array now")
})
