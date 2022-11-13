const INACTIVE = 0
const ACTIVE = 1
const CIVILIAN = 0
const KILLER = 1

import {Player, Civillian, Killer} from '../player/player.component.js';
import {CampusMap} from '../map/campus-map.component.js'
//A CampusMap is a Map of the Bubbles that exist on campus


export class Game{
    gameActive //a boolean
    currentTime //a Date object
    endTime //a Date object

    map //a map object

    players //a hashmap of mapping playerID ints to players
    snapshots //a hashmap of mapping snapshotID ints to snapshots
    chats //a hashmap of mapping chatsID ints to chats

    constructor(endTime, gameMap, players) {
        this.endTime = endTime
        this.map = gameMap

        if(players != undefined) {
            this.players = players
        } else {
            this.players = new Map()
        }

        this.snapshots = new Map()
        chats = new Map()
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
        this.players.add(player.getUserID(), player)
    }

    removePlayer(playerID) {
        return this.players.delete(playerID)
    }

    getPlayerCount() {
        return this.players.size()
    }

    getRoleCount(countKiller) {
        const playersList = this.map[Symbol.iterator]();

        var count = 0

        for(var p in playersList) {
            if(!(typeof p == Killer) ^ (countKiller)) {
                count += 1
            }
        }

        return count

    }

    getFractionRole(countKiller) {
        return (this.countRole(countKiller) / this.getPlayerCount())
    }

    getSnapshot(snapshotID) {
        return this.snapshots.get(snapshotID)
    }

    addSnapshot(snapshot) {
        this.snapshots.add(snapshot.getUserID(), snapshot)
    }

    removeSnapshot(snapshotID) {
        return this.snapshots.delete(snapshotID)
    }

    getChat(chatID) {
        return this.chats.get(chatID)
    }

    addChat(chat) {
        this.chats.add(chat.getUserID(), chat)
    }

    removeChat(chatID) {
        return this.chats.delete(chatID)
    }

}
