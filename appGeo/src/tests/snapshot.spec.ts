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
const Jack = new Player()
Jack.init(13, 'Jack', Location1, ALIVE);
const Mark = new Player()
Mark.init(25, 'Mark', Location1, ALIVE);

QUnit.module("Snapshot_Testing");

QUnit.test("Snapshot Tests", function(assert) {
    const bub = new Bubble();
    bub.init_bubble("Bubble", 0, 5, 10, 15);
    assert.true(bub.addPlayer(Jack), "Jack should be added to bubble");

    const snap = new Snapshot(1, bub);
    assert.equal(snap.getSnapshotID(), 1, "snapshot id should be 1");
    assert.equal(snap.getSnapshotBubbleId(), "Bubble", "should have id: Bubble");

    const player_map = new Map(
        snap.getSnapshotContent().map(object => {
          return [object.getUserID(), object];
        }),
      );

    assert.true(player_map.has(13), "snapshot should have player in bubble with id 13");

    //snapshot should save a copy of the bubble at the time of murder, i.e. it should not update
    assert.true(bub.addPlayer(Mark), "player should be added to original bubble");
    assert.true(bub.removePlayer(Jack), "player should be removed from original bubble");

    const player_map2 = new Map(
      snap.getSnapshotContent().map(object => {
        return [object.getUserID(), object];
      }),
    );

    assert.true(player_map2.has(13), "original player should still be in snapshot");
    assert.false(player_map2.has(25), "new player should not be in snapshot");
});
