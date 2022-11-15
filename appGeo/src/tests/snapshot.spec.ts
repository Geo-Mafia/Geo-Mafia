import {Bubble} from '../app/map/map.component'
import {Player} from '../app/player/player_class_declaration';
import {Snapshot} from '../app/snapshot/snapshot_class_declaration'

const ALIVE = 1

export class Location{
    x
    constructor(integer){
        this.x = integer;
    }
}

const Location1 = new Location(1);
const Jack = new Player(13, 'Jack', Location1, ALIVE); 
const Mark = new Player(25, 'Mark', Location1, ALIVE); 

QUnit.module("Snapshot_Testing");

QUnit.test("Snapshot Tests", function(assert) {
    let bub
    bub.init_Bubble("Bubble", 0, 0, 0, 0); //error should resolve upon merge with map updates
    assert.true(bub.addPlayer(Jack), "player should be added to bubble");
    
    let snap = new Snapshot(1, bub);
    assert.equal(snap.getSnapshotID(), 1, "snapshot id should be 1");
    assert.equal(snap.getSnapshotContent().id, "Bubble", "bubble stored should have id Bubble");
    //assert.true(snap.getSnapshotContent().List.has(13), "snapshot should have player in bubble with id 13"); //error should resolve upon merge with map updates

    //snapshot should save a copy of the bubble at the time of murder, i.e. it should not update
    assert.true(bub.addPlayer(Mark), "player should be added to original bubble");
    assert.true(bub.removePlayer(Jack), "player should be removed from original bubble");

    // assert.true(snap.getSnapshotContent().has(13), "original player should still be in snapshot"); //error should resolve upon merge with map updates
    // assert.false(snap.getSnapshotContent().has(25), "new player should not be in snapshot"); //error should resolve upon merge with map updates
});