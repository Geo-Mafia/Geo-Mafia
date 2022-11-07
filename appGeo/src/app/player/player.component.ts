import { Component, OnInit } from '@angular/core';
import { InjectableAnimationEngine } from '@nativescript/angular';
import { Bubble } from '../map/map.component';

type Point = {
  x: number;
  y: number;
};

const DEAD = false
const ALIVE = true
const DAILYMAXKILLCOUNT = 2
const SUCCESS = 10
const FAILURE = -10

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})


export class Player implements OnInit {
  userID: number; // An int
  username: string; // A String
  location: Point; // A Coordinate Object
  alive: Boolean; // A Boolean
  votes: number; // An int
  constructor(){}

  init_Player(userID: number, username: string, location: Point, alive: Boolean){
    this.userID = userID;
    this.username = username;
    this.location = location;
    this.alive = alive;
    this.votes = 0;
  }
  getKilled(){
    this.alive = DEAD
    return SUCCESS
}
/*
takeSnapshot(){
    const scene_capture = new Snapshot() //Create a Snapshot object
    // Note: Snapshot class not done yet, will want some function to add
    // all information required for a snapshot
    if (scene_capture == 1){
        return SUCCESS
    }
    return FAILURE
} */
/*
open_snapshot(Snapshot){
    const open = Snapshot.view()
    if (open == 1) {
        return SUCCESS
    }
    return FAILURE
} */

/* see_people_in_bubble(Players){
    // Take in as input hash table from Map Class of Players
    // The hash table maps each player's userID to the player's location
    player_list = []
    // Sift through Hash Table and find nearby players
    for (var i in Players) {
        if (Players[i] = this.location) {
            player_list.push(Players[i])
        }
    }
    return player_list
} */

open_chat(chat){
    const open = chat.view()
    if (open == 1) {
        return SUCCESS
    }
    return FAILURE
}

send_chat_message(chat, message){
    const sent = chat.send(message)
    if (sent == 1) {
        return SUCCESS
    }
    return FAILURE
}

receive_chat(chat, message){
    const received = chat.receive(message)
    if (received == 1) {
        return SUCCESS
    }
    return FAILURE
}

voteForExecution(player){
    player.votes++;
    return SUCCESS
}


  ngOnInit(): void {
  }

}
