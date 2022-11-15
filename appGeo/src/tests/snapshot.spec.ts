import {Bubble} from '~/app/map/map.component';
import {Player} from '~/app/player/player.component';
import {Snapshot} from '../app/snapshot/snapshot_class_declaration'

QUnit.module("Snapshot_Testing");

QUnit.test("Snapshot Tests", function(assert) {
    let bub = new Bubble("Bubble", 0, 0, 0, 0); //error should resolve upon merge with map updates
    let Jack;
    Jack.init_Player(13, "Jack", null, 1); //no constructor?
    assert.true(bub.addPlayer(Jack), "player should be added to bubble");
    
    let snap = new Snapshot(1, bub);
    assert.equal(snap.getSnapshotID(), 1, "snapshot id should be 1");
    assert.equal(snap.getSnapshotContent().id, "Bubble", "bubble stored should have id Bubble");
    assert.true(snap.getSnapshotContent().List.has(13), "snapshot should have player in bubble with id 13"); //error should resolve upon merge with map updates

    //snapshot should save a copy of the bubble at the time of murder, i.e. it should not update
    let Mark;
    Mark.init_Player(25, "Mark", null, 1); //no constructor?
    assert.true(bub.addPlayer(Mark), "player should be added to original bubble");
    assert.true(bub.removePlayer(Jack), "player should be removed from original bubble");

    assert.true(snap.getSnapshotContent().has(13), "original player should still be in snapshot"); //error should resolve upon merge with map updates
    assert.false(snap.getSnapshotContent().has(25), "new player should not be in snapshot"); //error should resolve upon merge with map updates
});