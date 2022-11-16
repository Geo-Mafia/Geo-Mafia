import {Bubble} from '../map/map.component';
import { Player } from '../player/player.component';

/* functionally, snapshot should be identified by an id and save a copy of the state of
   the state of the bubble at the time of a murder, specifically the players in the bubble.
   assuming that dead players are not in bubbles(? verify), it would be a direct saving
   of the bubble with no changes. */
export class Snapshot {
    snapshot_id: number;
    snapshot_bubble_id: string
    snapshot_content: Array<Player>;

    constructor(id: number, content: Bubble){
        this.snapshot_id = id;
        const player_copy  = content.playerArray.slice();
        this.snapshot_bubble_id = content.id
        this.snapshot_content = player_copy
    }

    getSnapshotID(){
        return this.snapshot_id;
    }

    getSnapshotBubbleId(){
      return this.snapshot_bubble_id
    }

    getSnapshotContent(){
        return this.snapshot_content;
    }
}
