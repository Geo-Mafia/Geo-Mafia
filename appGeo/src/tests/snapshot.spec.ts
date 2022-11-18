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

    assert.equal(snap.getSnapshotID(), 1, "snapshot id should be 1");
    assert.equal(snap.getSnapshotBubbleId(), "Bubble", "should have id: Bubble");

    const player_map = new Map(
        snap.getSnapshotContent().map(object => {
          return [object.getUserID(), object];
        }),
      );

    assert.true(player_map.has(13), "snapshot should have player in bubble with id 13");
    assert.notDeepEqual(snap.snapshot_content, ['Jack'], "should show that the property of arrays is same");
    
    //just need to assure that a date object is initialized
    assert.ok(snap.snapshot_time, "should have a string initialized in the class to represent time")

    //snapshot should save a copy of the bubble's contents at the time of murder, i.e. it should not update
    assert.true(bub.addPlayer(Mark), "player should be added to original bubble");
    assert.true(bub.removePlayer(Jack), "player should be removed from original bubble");

    const player_map2 = new Map(
      snap.getSnapshotContent().map(object => {
        return [object.getUserID(), object];
      }),
    );

    assert.true(player_map2.has(13), "original player should still be in snapshot");
    assert.false(player_map2.has(25), "new player should not be in snapshot");

    assert.true(snap.snapshot_content.includes(Jack), "Jack should be included in the list of players")
    assert.false(snap.snapshot_content.includes(Mark), "Mark should not be in the content bubbble");
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
