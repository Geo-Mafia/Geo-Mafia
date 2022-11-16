import {Bubble} from '../map/map.component';

/* functionally, snapshot should be identified by an id and save a copy of the state of
   the state of the bubble at the time of a murder, specifically the players in the bubble.
   assuming that dead players are not in bubbles(? verify), it would be a direct saving
   of the bubble with no changes. */
export class Snapshot {
    snapshot_id: number;
    snapshot_content: Bubble;

    constructor(id: number, content: Bubble){
        this.snapshot_id = id;
        const bub = new Bubble();
        bub.init_bubble(content.id, content.xLb, content.xUb, content.yLb, content.yUb);
        let playerListCopy = content.returnPlayers.slice();
        bub.List = playerListCopy;
        this.snapshot_content = bub;
    }

    getSnapshotID(){
        return this.snapshot_id;
    }
    
    getSnapshotContent(){
        return this.snapshot_content;
    }
}