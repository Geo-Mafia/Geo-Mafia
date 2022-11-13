import { Component, OnInit } from '@angular/core';
import {Player, Killer, Civilian} from '../player/player.component';
import{CampusMap} from '../map/campus-map.component'
import {Chat, Message} from '../chat/chat_class_declaration'
//A CampusMap is a Map of the Bubbles that exist on campus

const INACTIVE = 0
const ACTIVE = 1
const CIVILIAN = 0
const KILLER = 1

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
  snapshots: Map<number, Snapshot> //a hashmap of mapping snapshotID ints to snapshots
  chats: Map<number, Chat> //a hashmap of mapping chatsID ints to chats


  constructor(endTime: Date, gameMap: CampusMap, players: Map<number, Player>) {
    this.endTime = endTime
        this.map = gameMap

        if(players != undefined) {
            this.players = players
        } else {
            this.players = new Map()
        }

        this.snapshots = new Map()
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

  setEndTime(endTime) {
      this.endTime = endTime
  }

  getPlayer(playerID) {
      return this.players.get(playerID)
  }

  addPlayer(player) {
      this.players.set(player.getUserID(), player)
  }

  removePlayer(playerID) {
    return this.players.delete(playerID)
  }

  get PlayerCount() {
    return this.players.size
  }

  getRoleCount(countKiller) {

      const playersList = this.map[Symbol.iterator]();//need to adjust the code for Campus Map for this to work


      var count = 0
      var i = 0
      if((playersList[i] instanceof Killer) && (countKiller) || !(playersList[i] instanceof Killer) && !(countKiller)){
        count += 1
      }

      return count

  }

  getFractionRole(countKiller) {
      return (this.getRoleCount(countKiller) / this.PlayerCount)  //does this use RoleCount? the names are different
  }

  getSnapshot(snapshotID) {
      return this.snapshots.get(snapshotID)
  }

  addSnapshot(snapshot) {
      this.snapshots.set(snapshot.getUserID(), snapshot)
  }

  removeSnapshot(snapshotID) {
      return this.snapshots.delete(snapshotID)
  }

  getChat(chatID) {
    return this.chats.get(chatID)
  }

  addChat(chat) {
    this.chats.set(chat.getUserID(), chat)
  }

  removeChat(chatID) {
    return this.chats.delete(chatID)
  }

}


