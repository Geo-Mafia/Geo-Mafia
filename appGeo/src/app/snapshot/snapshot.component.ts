import {Bubble} from '../map/map.component';
import { Player } from '../player/player.component';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { databaseAdd, databaseGet, databaseEventListener } from '../../modules/database'
import { firebase } from "@nativescript/firebase";
import { fromObject, ScrollView, ScrollEventData} from '@nativescript/core';

@Component({
  selector: 'Snapshot',
  templateUrl: './snapshot.component.html',
  styleUrls: ['./snapshot.component.css']
})

export class SnapshotComponent implements OnInit {
  public snapshots: Array<any>;

  constructor() { 
    this.snapshots = [];
  }

  ngOnInit(): void {
    this.snapshots = this.getSnapshots();
    databaseEventListener("game/snapshots", this.updateSnapshots.bind(this));
    console.log("got to snapshot");
  }

  getSnapshots() {
    let snaps = [];
    databaseGet('game/snapshots').then(value => {
      console.log("val: " + JSON.stringify(value));

      if (value == null) {
        const bub0 = new Bubble();
        bub0.init_bubble("Bubble0", 0, 0, 0, 0);
        let temp = new Snapshot(0, bub0)
        snaps = [temp];
        databaseAdd('game/snapshots', snaps);
      } 
      else {
        snaps = value; 
      }
    });
    console.log("in get msgs")
    return snaps;
  } 

  updateSnapshots(data: object) {
    this.snapshots = [];
    console.log("data: " + JSON.stringify(data));
    let list = data["value"];
    this.snapshots = list;
  }
}


/* functionally, snapshot should be identified by an id and save a copy of the state of
   the state of the bubble at the time of a murder, specifically the players in the bubble.
   assuming that dead players are not in bubbles(? verify), it would be a direct saving
   of the bubble with no changes. */
export class Snapshot {
    snapshot_id: Number;
    snapshot_bubble_id: String
    snapshot_content: Array<String>; //returning array of names for easy display
    snapshot_time: String

    constructor(id: Number, content: Bubble){
      const init_date = new Date();
      this.snapshot_time = init_date.toLocaleString(); //a string that shows the MM/DD/YYY, HH:MM:SS format
      this.snapshot_id = id;
      const player_copy  = content.playerArray.map(toCopy => {
        return toCopy.username
      })
      this.snapshot_bubble_id = content.id
      this.snapshot_content = player_copy
    }

    getSnapshotID(){
        return this.snapshot_id;
    }

    getSnapshotBubbleID(){
      return this.snapshot_bubble_id
    }

    getSnapshotContent(){
        return this.snapshot_content;
    }
}
