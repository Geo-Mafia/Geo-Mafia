import { Component, OnInit } from '@angular/core';
import {Player, Killer, Civilian} from '../player/player_class_declaration';
import{CampusMap} from '../map/campus-map.component'
import {Chat, Message} from '../chat/chat_class_declaration'
//A CampusMap is a Map of the Bubbles that exist on campus

const INACTIVE = 0
const ACTIVE = 1
const CIVILIAN = 7
const KILLER = 8
const SUCCESS = 10
const INPROGRESS = 5

@Component({
  selector: 'ns-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class Game implements OnInit {
  gameActive: number //a boolean number
  currentTime: Date //a Date object
  endTime: Date //a Date object

  map: CampusMap //a map object

  players: Map<number, Player> //a hashmap of mapping playerID ints to players
//  snapshots: Map<number, Snapshot> //a hashmap of mapping snapshotID ints to snapshots
  chats: Map<number, Chat> //a hashmap of mapping chatsID ints to chats


  constructor(endTime: Date, gameMap: CampusMap, players: Map<number, Player>) {
    this.gameActive = INACTIVE;
    this.currentTime = new Date();
    this.endTime = endTime
        this.map = gameMap

        if(players != undefined) {
            this.players = players
        } else {
            this.players = new Map()
        }

     //   this.snapshots = new Map()
        this.chats = new Map()
  }

  ngOnInit(): void {
  }

  startGame() {
    this.#setGameActive(ACTIVE)

    //Randomly generate killer objects for 20% of the players and civilians for the rest
    //Rebuild the players list with these objects
    //TODO
  }

  endGame() {
      this.#setGameActive(INACTIVE)

      //TODO
  }

  getGameActive() {
      return this.gameActive
  }

  #setGameActive(status) {
      this.gameActive = status
  }

  getCurrentTime() {
      return this.currentTime
  }

  getEndTime() {
      return this.endTime
  }

  setEndTime(endTime: Date) {
      this.endTime = endTime
      return SUCCESS
  }

  getPlayer(playerID) {
      return this.players.get(playerID)
  }

  getMap(){
      return this.map;
  }

  addPlayer(player) {
      this.players.set(player.getUserID(), player)
      return SUCCESS;
  }

  removePlayer(playerID) {
    return this.players.delete(playerID)
  }

  getPlayerCount() {
    return this.players.size
  }

  /* playersRemaining(): 
   * Functiont that iterates through the hash map of all Players to see how many are still alive 
   */
  playersRemaining(){
    var count = 0;
    for (let [key, value] of this.players){
      if (value.getAliveStatus() == ACTIVE){
          count = count + 1;
      }
    }

    return count;
  }

  /* killersRemaining()
   * Function that iterates through the hash map of all Players to see how many Killers are still alive
   */
  killersRemaining(){
    var count = 0;
    for (let [key, value] of this.players){
      if (value.getAliveStatus() == ACTIVE && value instanceof Killer){
        count = count + 1;
      }
    }

    return count;
  }

  /* civiliansRemaining()
   * Function that iterates through the hash map of all Players to see how many Civilians are still alive
  */
  civiliansRemaining(){
    var count = 0;
    for (let [key, value] of this.players){
      if (value.getAliveStatus() == ACTIVE && value instanceof Civilian){
        count = count + 1;
      }
    }
  
    return count;
  }

  winningCondition(){
    var killers_left = this.killersRemaining();
    var civilians_left = this.civiliansRemaining();

    if (killers_left > 0 && civilians_left == 0){
      //Killers have won!
      return KILLER;
    }
    
    if (killers_left == 0 && civilians_left > 0){
      //Civilians have won!
      return CIVILIAN;
    }

    //Game still hasn't ended, return in progress
    return INPROGRESS;
  }

  getRoleCount(countKiller) {

      const playersList = this.map.MapOfCampus[Symbol.iterator]();//need to adjust the code for Campus Map for this to work


      var count = 0
      var i = 0
      if((playersList[i] instanceof Killer) && (countKiller) || !(playersList[i] instanceof Killer) && !(countKiller)){
        count += 1
      }

      return count

  }

  getFractionRole(countKiller) {
      return (this.getRoleCount(countKiller) / this.getPlayerCount())  //does this use RoleCount? the names are different
  }


  countVoteProcess(){
    var total_players_left = this.playersRemaining(); //Function that will be added in another branch
    var voted_someone_out = false;

    for (let [key, value] of this.players) {
      if (value.getAliveStatus() == ACTIVE){
        var votes = value.getVotes();
        var fraction = votes / total_players_left;
        if (fraction > 0.50){
          //Means over half of the players voted a player ==> Kill the voted out person
          value.getKilled();
          voted_someone_out = true;
        }

        //Means that this player was not voted out ==> Reset their votes for the day
        value.resetVotes();
      }
    }

    return voted_someone_out;
  }

/*   getSnapshot(snapshotID) {
      return this.snapshots.get(snapshotID)
  }

  addSnapshot(snapshot) {
      this.snapshots.set(snapshot.getUserID(), snapshot)
  }

  removeSnapshot(snapshotID) {
      return this.snapshots.delete(snapshotID)
  } */

  getChat(chatID) {
    return this.chats.get(chatID)
  }

  addChat(chat) {
    this.chats.set(chat.getUserID(), chat)
    return SUCCESS;
  }

  removeChat(chatID) {
    return this.chats.delete(chatID)
  }

}


