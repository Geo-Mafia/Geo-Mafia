import { Component, OnInit } from '@angular/core';
import {Player, Killer, Civilian} from '../player/player.component';
import{CampusMap} from '../map/campus-map.component'
import {Chat, Message} from '../chat/chat.component'
import { GameRules} from './game-rules.component'
import {Snapshot} from '../snapshot/snapshot_class_declaration'
//import {scheduleJob, Job} from 'node-schedule'
//A CampusMap is a Map of the Bubbles that exist on campus

const INACTIVE = 0
const ACTIVE = 1
const UNSCHEDULED = 5
const SCHEDULED = 6
const CIVILIAN = 7
const KILLER = 8
const SUCCESS = 10
const FAILURE = -10
const INPROGRESS = 5

const START_JK = "start"
const END_JK = "end"

@Component({
  selector: 'ns-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class Game implements OnInit {
  gameRules: GameRules //the object containing the game rules

  gameActive: number //a boolean number
  gameScheduled: number //a boolean number
  startTime: Date //a Date object
  endTime: Date //a Date object

  map: CampusMap //a map object

  players: Map<number, Player> //a hashmap of mapping playerID ints to players
  snapshots: Map<number, Snapshot> //a hashmap of mapping snapshotID ints to snapshots
  chats: Map<number, Chat> //a hashmap of mapping chatsID ints to chats

  //#scheduledJobs: Map<string, Job> //stores all scheduled Jobs

  constructor(gameRules: GameRules, gameMap: CampusMap, players: Map<number, Player>) {
    this.gameRules = gameRules
    this.gameActive = INACTIVE;

    this.startTime = null;
    this.endTime = null
    
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

  #startProcess() {

      const playerCount = this.getPlayerCount()

      //number of killers should be fraction of players, rounded down
      const numKillers = Math.floor(playerCount * this.gameRules.getFractionKillers())

      const roledPlayers = new Map()

      const playerArr = Array.from(this.players.values())

      //randomly select killers
      for(let i = 0; i < numKillers; i++) {
        let rand = Math.floor(Math.random() * this.getPlayerCount())
        let player = playerArr[rand]
        let killer = new Killer()
        killer.init(player.getUserID(), player.getUsername(), player.getLocation(), player.getAliveStatus())

        roledPlayers.set(killer.getUserID(), killer)
        playerArr.splice(rand, 1)
      }

      //set all other players to civilians
      for(let i = 0; i < playerArr.length; i++) {
        let player = playerArr[i]
        let civilian = new Civilian()
        civilian.init(player.getUserID(), player.getUsername(), player.getLocation(), player.getAliveStatus())

        roledPlayers.set(civilian.getUserID, civilian)
      }

      //replace unroled players with roles
      this.#setPlayers(roledPlayers)

      this.startTime = new Date();

      if(this.gameRules.isScheduledEnd) {
        this.endTime = new Date(this.startTime.getTime() + 
                                (this.gameRules.getGameLengthHours() * 60 * 60 * 1800))
        /*const endJob = scheduleJob(this.getEndTime(), function() {this.#endProcess()})
        this.#scheduledJobs.set(END_JK, endJob)
        */
      }

      //TODO: this is where the 3 timers for voting will be set

      this.#setGameActive(ACTIVE)

      return SUCCESS

  }

  /* All checks to be run before the game starts 
  */
  preGameChecks() {
      if(this.getPlayerCount() < this.gameRules.getMinPlayers()) {
          return FAILURE
      } else if (this.getGameActive() == ACTIVE) {
          return FAILURE
      } else if(this.getGameScheduled() == SCHEDULED) {
          return FAILURE
      }

      return SUCCESS
  }

  startGame() {
    if(this.preGameChecks() == FAILURE) {
      return FAILURE
    }

    return this.#startProcess();

    //Randomly generate killer objects for 20% of the players and civilians for the rest
    //Rebuild the players list with these objects
    //TODO
  }

  scheduleStart(date: Date) {

      if(this.preGameChecks() == FAILURE) {
          return FAILURE
      }

      /*const job = scheduleJob(date, function() {this.#startProcess()});
      this.#scheduledJobs.set(START_JK, job) //adds job to list of jobs running*/

      this.#setGameScheduled(SCHEDULED)
      return SUCCESS;
  }

  /*
  cancelScheduledStart() {
      this.#scheduledJobs.get(START_JK).cancel()
      this.#setGameScheduled(UNSCHEDULED)
      return SUCCESS;
  }
  */

  winningCondition(){
    var killers_left = this.killersRemaining();
    var civilians_left = this.civiliansRemaining();

    var min_civ; //minimum number of civilians required to prevent killer win

    if(this.gameRules.isWipeoutEnd()) {
      min_civ = 1;
    } else {
      min_civ = killers_left;
    }

    if (killers_left > 0 && !(civilians_left >= min_civ)){
      //Killers have won!
      return KILLER;
    } else if (killers_left == 0 && civilians_left > 0){
      //Civilians have won!
      return CIVILIAN;
    } else if (this.getGameActive() == INACTIVE && civilians_left > 0) {
      //Civilians have won a time victory or a premature end has occured
      return CIVILIAN;
    }
    //we do not currently handle if both are wiped out

    //Game still hasn't ended, return in progress
    return INPROGRESS;
  }

  #endProcess() {
    this.#setGameActive(INACTIVE)

    /*
    if(this.gameRules.isScheduledEnd()) {
      this.#scheduledJobs.get(END_JK).cancel()
    }
    */
    
    //TODO: This is where the timers for the voting will be disable
    
    return this.winningCondition();
  }

  /* This method is meant to only be called if the game is ended externally and doesn't count
     as a finished game
  */
  endGame() {
      if(this.getGameActive() == INACTIVE) {
        return FAILURE;
      }

      this.#endProcess()

      return SUCCESS
  }

  //Called by scheduled job only
  #voting_open() {
    /*TODO:
      - disable killing
      - enable voting
      - announce voting open(?)
    */
  }

  //Called by scheduled job only
  #voting_close() {
    /* TODO:
      - tally votes
      - eliminate voted out player
      - check end game conditions
        - end game and return if game ended
      - reset votes
      - announce voting over(?)
    */
  }

  //Called by scheduled job only
  #safetime_end() {
    /* TODO:
      - reset kill counts
      - enable killing again
      - announce safetime over(?)
    */
  }

  getGameActive() {
      return this.gameActive
  }

  #setGameActive(status: number) {
      this.gameActive = status
  }

  getGameScheduled() {
      return this.gameScheduled
  }

  #setGameScheduled(status: number) {
      this.gameScheduled = status
  }

  getStartTime() {
      return this.startTime
  }

  getEndTime() {
      return this.endTime
  }

  setEndTime(endTime: Date) {
      this.endTime = endTime
      return SUCCESS
  }

  getMap(){
    return this.map;
  }

  #setPlayers(players: Map<number, Player>) {
    this.players = players
  }

  getPlayer(playerID) {
      return this.players.get(playerID)
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

  getSnapshot(snapshotID) {
      return this.snapshots.get(snapshotID)
  }

  addSnapshot(snapshot) {
      this.snapshots.set(snapshot.getSnapshotID(), snapshot)
      return SUCCESS;
  }

  removeSnapshot(snapshotID) {
      return this.snapshots.delete(snapshotID)
  }

  getChat(chatID) {
    return this.chats.get(chatID)
  }

  addChat(chat) {
    this.chats.set(chat.getChatID(), chat)
    return SUCCESS;
  }

  removeChat(chatID) {
    return this.chats.delete(chatID)
  }

}


