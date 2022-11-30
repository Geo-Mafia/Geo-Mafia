import {Bubble} from '../map/map.component';
import {CampusMap} from '../map/campus-map.component';
import { Player } from '../player/player.component';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { databaseAdd, databaseGet, databaseEventListener } from '../../modules/database'
import { firebase } from "@nativescript/firebase";
import { fromObject, ScrollView, ScrollEventData} from '@nativescript/core';

const ALIVE = 1

@Component({
  selector: 'SnapshotComponent',
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
        let testPlayer = new Player();
        let loc = {longitude:20, latitude:20};
        testPlayer.init(12, "player1", loc, ALIVE);
        bub0.addPlayer(testPlayer);
        let temp = new Snapshot(0, bub0);
        snaps = [temp];
        databaseAdd('game/snapshots', snaps);
      } 
      else {
        snaps = value; 
      }
    });
    console.log("in get snapshots")
    return snaps;
  } 

  updateSnapshots(data: object) {
    this.snapshots = [];
    console.log("data: " + JSON.stringify(data));
    let list = data["value"];
    this.snapshots = list;
  }

  createSnapshot(){
    console.log("Inside the create snapshot function")
    let cm = new CampusMap();
    var new_bub = cm.playersBubble(global.player);
    var new_snap = new Snapshot(this.snapshots.length, new_bub);
    this.snapshots.push(new_snap);
    databaseAdd('game/snapshots', this.snapshots);
  
//    console.log("Inside the create snapshot function")
//    let cm = new CampusMap();
//    databaseGet('game/map').then(value => {
//      console.log("val: " + JSON.stringify(value));
//    
//      if (value == null) {
//        const test_bub0 = new Bubble();
//        test_bub0.init_bubble("test_Bubble_without_map_in_db", 0, 0, 0, 0);
//        let testPlayer = new Player();
//        let loc = {longitude:20, latitude:20};
//        testPlayer.init(12, "player1", loc, ALIVE);
//        test_bub0.addPlayer(testPlayer);
//
//        var new_snap = new Snapshot(this.snapshots.length, test_bub0);
//        this.snapshots.push(new_snap);
//
//        console.log("new snapshot ID:", new_snap.snapshot_id)
//        console.log("new snapshot Bubble ID:", new_snap.snapshot_bubble_id)
//        console.log("new snapshot time:", new_snap.snapshot_time)
//        console.log("new snapshot content:", new_snap.snapshot_content)
//
//        databaseAdd('game/snapshots', this.snapshots);
//      } 
//      else {
//        cm = value;
//        var new_bub = cm.playersBubble(global.player);
//        var new_snap = new Snapshot(this.snapshots.length, new_bub);
//        this.snapshots.push(new_snap);
//
//        console.log("new snapshot ID:", new_snap.snapshot_id)
//        console.log("new snapshot Bubble ID:", new_snap.snapshot_bubble_id)
//        console.log("new snapshot time:", new_snap.snapshot_time)
//        console.log("new snapshot content:", new_snap.snapshot_content)
//
//        databaseAdd('game/snapshots', this.snapshots);
//      }
//    });
  }

  onScroll(args: ScrollEventData){
    const scrollView = args.object as ScrollView;

    console.log("scrollX: " + args.scrollX);
    console.log("scrollY: " + args.scrollY);
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
        return toCopy.username;
      })
      this.snapshot_bubble_id = content.id;
      this.snapshot_content = player_copy;
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
