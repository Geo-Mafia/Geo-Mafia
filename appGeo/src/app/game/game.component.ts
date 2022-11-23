import { Component, OnInit } from '@angular/core';
import {Player, Killer, Civilian} from '../player/player.component';
import{CampusMap} from '../map/campus-map.component'
import {Chat, Message} from '../chat/chat.component'
import { GameRules} from './game-rules.component'
import {Snapshot} from '../snapshot/snapshot.component'
import { databaseAdd, databaseGet, databaseEventListener, databaseUpdate } from '../../modules/database'
import { borderTopRightRadiusProperty } from '@nativescript/core';
//A CampusMap is a Map of the Bubbles that exist on campus

const MAP_PATH = "src/game/map"
const SETTINGS_PATH = "src/settings/"
const START_TIME_PATH = "src/settings/startTime"
const END_TIME_PATH = "src/settings/endTime"
const STATUS_PATH = "src/settings/status"
const GAMERULE_PATH = "src/settings/gameRules"
const VOTE_OPEN_PATH = "src/settings/voteOpen"

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
const VOTE_OPEN_JK = "vote"
const VOTE_CLOSE_JK = "close"
const SAFE_OVER_JK = "unsafe"
const TICK_JK = "tick"

@Component({
  selector: 'ns-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class Game implements OnInit {
  gameRules: GameRules //the object containing the game rules

  gameActive: Number //a boolean number
  gameScheduled: Number //a boolean number
  startTime: Date //a Date object
  endTime: Date //a Date object

  map: CampusMap //a map object

  players: Map<number, Player> //a hashmap of mapping playerID ints to players
  snapshots: Map<number, Snapshot> //a hashmap of mapping snapshotID ints to snapshots
  chats: Map<number, Chat> //a hashmap of mapping chatsID ints to chats

  #scheduledJobs: Map<string, any> //stores all scheduled timers with the id of the timer stored

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
    this.#scheduledJobs = new Map()
  }

  
  ngOnInit(): void {
        // add event listener to update each player
        this.players.forEach((player: Player, key: number) => {
          databaseEventListener(player.getDatabasePath(), this.updatePlayerDatabase.bind(this));
        });
        databaseEventListener(GAMERULE_PATH, this.updateGameRulesDatabase.bind(this));
        databaseEventListener(MAP_PATH, this.updateMapDatabase.bind(this));
        databaseEventListener(START_TIME_PATH, this.updateStartTime.bind(this));
        databaseEventListener(END_TIME_PATH, this.updateEndTime.bind(this));
        databaseEventListener(STATUS_PATH, this.updateStatus.bind(this));

  }

  updatePlayerDatabase(data: object) {
    // Update global player field
    global.player = data["value"];
    // Need to change to hashmap
    let player = data["value"];
    console.log("updated player obj: " + JSON.stringify(player));
    let playerId = player.getUserID();
    this.players.set(playerId, player);
    // Update global playerlist
    global.playerlist.set(playerId, player);
    console.log("End updatePlayerDatabase func");

  }

  updateGameRulesDatabase(data: object) {
    this.gameRules = data["value"]
    console.log("updated game rules: " + JSON.stringify(this.gameRules));
  }

  updateMapDatabase(data: object) {
    this.map = data["value"]
    console.log("updated map: " + JSON.stringify(this.map));
  }

  updateStartTime(data: object) {
    this.startTime = data["value"]
    console.log("updated start time" + JSON.stringify(this.startTime))
  }

  updateEndTime(data: object) {
    this.endTime = data["value"]
    console.log("updated end time" + JSON.stringify(this.endTime))
  }

  updateStatus(data: object) {
    this.gameActive = data["value"]
    console.log("updated status" + JSON.stringify(this.gameActive))
  }

  //schedules an event for a time in the future. Will run recursively if that time in the future is greater than setTimeout can support
  scheduleEvent(date: Date, func: Function, key: string) {
    var now = (new Date()).getTime()
    var eventTime = date.getTime()
    var diff = Math.max((eventTime - now), 0)

    var timer;
    if(diff > 0x7FFFFFFF) {
      timer = setTimeout(function() {this.scheduleEvent(date, func, key)}, 0x7FFFFFFF);
    } else {
      timer = setTimeout(func, diff);
    }
    this.#scheduledJobs.set(key, timer);

    return timer;
  }

  scheduleRecuring(firstDate: Date, loopTime: number, func: Function, key: string) {

    const recFunc = function() {
      func();
      this.scheduleRecuring(new Date(firstDate.getTime() + loopTime), loopTime, func, key)
    }

    this.scheduleEvent(firstDate, recFunc, key)
  }

  //Cancels an event scheduled
  cancelEvent(key: string) {
    clearTimeout(this.#scheduledJobs.get(key))
  }

  gameTick() {
    //All events that must run every tick

    if(this.getGameActive() == ACTIVE) {
      var now = (new Date()).getTime()
      this.scheduleRecuring(new Date(now + 60000), 60000, function() {this.gameTick()}, TICK_JK)
    }
  }

  #startProcess() {

      const playerCount = this.getPlayerCount()

      //number of killers should be fraction of players, rounded down
      const numKillers = Math.floor(playerCount * this.gameRules.getFractionKillers())

      const roledPlayers = new Map()

      const playerArr = this.getPlayers()

      //randomly select killers
      for(let i = 0; i < numKillers; i++) {
        let rand = Math.floor(Math.random() * this.getPlayerCount())
        let player = playerArr[rand]
        let killer = new Killer()
        killer.init(player.getUserID(), player.getUsername(), player.getLocation(), player.getAliveStatus())
        killer.databasePath = player.getDatabasePath()
        killer.setMaxKills(this.gameRules.getMaxSoloKill(), this.gameRules.getMaxGlobalKill())

        roledPlayers.set(killer.getUserID(), killer)
        databaseUpdate(killer.getDatabasePath(), killer)

        roledPlayers.set(killer.getUserID(), killer)
        playerArr.splice(rand, 1)
      }

      //set all other players to civilians
      for(let i = 0; i < playerArr.length; i++) {
        let player = playerArr[i]
        let civilian = new Civilian()
        civilian.init(player.getUserID(), player.getUsername(), player.getLocation(), player.getAliveStatus())
        civilian.databasePath = player.getDatabasePath()

        roledPlayers.set(civilian.getUserID(), civilian)
        databaseUpdate(civilian.getDatabasePath(), civilian)
      }

      //replace unroled players with roles
      this.#setPlayers(roledPlayers)

      this.startTime = new Date();
      databaseAdd(START_TIME_PATH, this.getStartTime())

      if(this.gameRules.isScheduledEnd) {
        this.setEndTime(new Date(this.getStartTime().getTime() + 
                                (this.gameRules.getGameLengthHours() * 60 * 60 * 1800)))
        const endJob = this.scheduleEvent(this.getEndTime(), function() {this.#endProcess()}, END_JK)
        databaseAdd(END_TIME_PATH, this.getEndTime())

      }

      //The three other game timers set
      const voteTime = new Date(this.getStartTime().getTime() + this.gameRules.getVoteTime())
      const voteCloseTime = new Date(voteTime.getTime() + this.gameRules.getVoteLength())
      const safeOverTime = new Date(voteTime.getTime() + this.gameRules.getSafeLength())

      const voteTimer = this.scheduleRecuring(voteTime, this.gameRules.getDayCycleLength(), function() {this.#voting_open()}, VOTE_OPEN_JK)
      const voteCloseTimer = this.scheduleRecuring(voteCloseTime, this.gameRules.getDayCycleLength(), function() {this.#voting_close()}, VOTE_CLOSE_JK)
      const safeOverTimer = this.scheduleRecuring(safeOverTime, this.gameRules.getDayCycleLength(), function() {this.#safetime_end()}, SAFE_OVER_JK)

      this.#scheduledJobs.set(VOTE_OPEN_JK, voteTimer)
      this.#scheduledJobs.set(VOTE_CLOSE_JK, voteCloseTimer)
      this.#scheduledJobs.set(SAFE_OVER_JK, safeOverTimer)

      this.#setGameActive(ACTIVE)
      databaseUpdate(STATUS_PATH, this.gameActive)

      var vote_open: Boolean = false

      databaseAdd(VOTE_OPEN_PATH, vote_open)

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

  }

  scheduleStart(date: Date) {

      if(this.preGameChecks() == FAILURE) {
          return FAILURE
      }

      const job = this.scheduleEvent(date, function() {this.#startProcess()}, START_JK);
      this.#scheduledJobs.set(START_JK, job) //adds start job to list of jobs running

      this.#setGameScheduled(SCHEDULED)
      return SUCCESS;
  }

  cancelScheduledStart() {
      this.cancelEvent(START_JK)
      this.#setGameScheduled(UNSCHEDULED)
      return SUCCESS;
  }

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
    databaseUpdate(STATUS_PATH, this.getGameActive())

    if(this.gameRules.isScheduledEnd()) {
      this.cancelEvent(END_JK)
    }
    
    //disable all game timers
    this.cancelEvent(VOTE_OPEN_JK)
    this.cancelEvent(VOTE_CLOSE_JK)
    this.cancelEvent(SAFE_OVER_JK)
    this.cancelEvent(TICK_JK)
    
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
    this.players.forEach((player: Player, key: number) => {
      if(player instanceof Killer) {
        player.disableKilling()
        databaseUpdate(player.getDatabasePath(), player)
      }
    });

    var vote_open: Boolean = true
    databaseUpdate(VOTE_OPEN_PATH, vote_open)

    console.log("Voting open")
  }

  //Called by scheduled job only
  #voting_close() {
    this.countVoteProcess()
    if(this.winningCondition() != INPROGRESS) {
      this.#endProcess()
    }

    var vote_open: Boolean = false
    databaseUpdate(VOTE_OPEN_PATH, vote_open)
    
    console.log("Voting closed")
  }

  //Called by scheduled job only
  #safetime_end() {
    this.players.forEach((player: Player, key: number) => {
      if(player instanceof Killer) {
        player.resetKilling()
        databaseUpdate(player.getDatabasePath(), player)
      }
    });
    console.log("The safe period is over")
  }

  getGameActive() {
      return this.gameActive
  }

  #setGameActive(status: Number) {
      this.gameActive = status
  }

  getGameScheduled() {
      return this.gameScheduled
  }

  #setGameScheduled(status: Number) {
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

  getPlayers() {
    return Array.from(this.players.values())
  }

  getKillers() {
    const players = this.getPlayers()
    const killers = []
    for(let i = 0; i < players.length; i++) {
      if(players[i] instanceof Killer) {
        killers.push(players[i])
      }
    }

    return killers
  }

  getCivilians() {
    const players = this.getPlayers()
    const civilians = []
    for(let i = 0; i < players.length; i++) {
      if(players[i] instanceof Civilian) {
        civilians.push(players[i])
      }
    }

    return civilians
  }

  #setPlayers(players: Map<number, Player>) {
    this.players = players
    global.playerlist = players;
  }

  getPlayer(playerID) {
      return this.players.get(playerID)
  }

  addPlayer(player) {
      this.players.set(player.getUserID(), player)
      //global.playerlist.set(player.getUserID(), player);
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

  getRoleCount(countedRole: Number) {

      if(countedRole == KILLER) {
        return this.getKillers().length
      } else if (countedRole == CIVILIAN) {
        return this.getCivilians().length
      } else {
        return FAILURE
      }

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
