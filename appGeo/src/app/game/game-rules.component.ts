import { Component } from '@angular/core';

const MIN_MIN_PLAYERS = 5
const MIN_FRACTION_KILLERS = 0.2

const MIN_GAME_LENGTH = 24
const DEF_GAME_LENGTH = 168

//safe length default is 1/3 of game length. Minimum is 1/2 of game length

const DEF_CYCLE_LEN = 24

//cannot be longer than safe length
const MIN_VOTE_LENGTH = 60

//both are minutes after local midnight
const DEF_CYCLE_START_TIME = 240
const DEF_VOTE_TIME = 1200

const MIN_MAX_SOLO_KILL = 1
const DEF_MAX_GLOBAL_KILL = Infinity

@Component({
    selector: 'game-rules',
    templateUrl: './game-rules.component.html',
    styleUrls: ['./game-rules.component.css']
})
export class GameRules {

    scheduledEnd: boolean //if the game has a scheduled end date
    wipeOutEnd: boolean //if true then killers need to kill all civilians to win, or just get majority
    startSafe: boolean //if the extra time before the cycle starts will be a safe zone

    minPlayers: number //number of minimum players
    fractionKillers: number //fractional ratio of civilians who are killers

    gameLengthHours: number //the number of hours the game is long.
                            //if null, the game has no scheduled end 
    dayCycleLength: number //the number of minutes in the day cycle
    safeLength: number //the number of minutes kills aren't allowed each cycle
    voteLength: number //the number of minutes at the begining of safe time voting is allowed
    
    //number of minutes after midnight
    cycleStartTime: number //number of minutes after midnight
    voteTime: number //number of minutes 

    maxSoloKills: number //number of kills a single killer can do a day
    maxGlobalKills: number //number of kills per day allowed total

    constructor(gameLengthHours?: number) {
        this.scheduledEnd = true
        this.wipeOutEnd = true
        this.startSafe = true

        this.minPlayers = MIN_MIN_PLAYERS
        this.fractionKillers = MIN_FRACTION_KILLERS

        if(gameLengthHours != undefined) {
            this.gameLengthHours = gameLengthHours
            this.dayCycleLength = gameLengthHours/6
        } else {
            this.gameLengthHours = DEF_GAME_LENGTH
            this.dayCycleLength = DEF_CYCLE_LEN
        }
        this.safeLength = this.dayCycleLength/3
        this.voteLength = MIN_VOTE_LENGTH

        this.cycleStartTime = DEF_CYCLE_START_TIME
        this.voteTime = DEF_VOTE_TIME

        this.maxSoloKills = MIN_MAX_SOLO_KILL
        this.maxGlobalKills = DEF_MAX_GLOBAL_KILL

    }

    isScheduledEnd() {
        return this.scheduledEnd
    }

    isWipeoutEnd() {
        return this.wipeOutEnd
    }

    isStartSafe() {
        return this.startSafe
    }

    setScheduledEnd(b: boolean) {
        this.scheduledEnd = b
    }

    setWipeoutEnd(b: boolean) {
        this.wipeOutEnd = b
    }

    setStartSafe(b: boolean) {
        this.startSafe = b
    }

    //GETTERS
    getMinPlayers() {
        return this.minPlayers
    }

    getFractionKillers() {
        return this.fractionKillers
    }

    getGameLengthHours() {
        return this.gameLengthHours
    }

    getDayCycleLength() {
        return this.dayCycleLength
    }

    getSafeLength() {
        return this.safeLength
    }

    getVoteLength() {
        return this.voteLength
    }

    getCycleStartTime() {
        return this.cycleStartTime
    }

    getVoteTime() {
        return this.voteTime
    }

    getMaxSoloKill() {
        return this.maxSoloKills
    }

    getMaxGlobalKill() {
        return this.maxGlobalKills
    }

    //SETTERS
    setMinPlayers(minPlayers: number) {
        this.minPlayers = minPlayers
    }

    setFractionKillers(frac: number) {
        this.fractionKillers = frac
    }

    setGameLengthHours(hours: number) {
        this.gameLengthHours = hours
    }

    setDayCycleLength(minutes: number) {
        this.dayCycleLength = minutes
    }

    setSafeLength(minutes: number) {
        this.safeLength = minutes
    }

    setVoteLength(minutes: number) {
        this.voteLength = minutes
    }

    setCycleStartTime(minutesAfterMidnight: number) {
        this.cycleStartTime = minutesAfterMidnight
    }

    setVoteTime(minutesAfterMidnight: number) {
        this.voteTime = minutesAfterMidnight
    }

    setMaxSoloKill(maxKills: number) {
        this.maxSoloKills = maxKills
    }

    setMaxGlobalKill(maxKills: number) {
        this.maxGlobalKills = maxKills
    }

}