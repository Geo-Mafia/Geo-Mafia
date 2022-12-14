import { Component } from '@angular/core';

export const SUCCESS = 10
export const FAILURE = -10

const MS_SCALE = 60000 //for scaling all minute numbers into miliseconds

const MIN_MIN_PLAYERS = 5
const MIN_FRACTION_KILLERS = 0.2

//all constants in minutes
const MIN_GAME_LENGTH = 1440
const DEF_GAME_LENGTH = 10080

const DEF_CYCLE_LEN = 1440
const MAX_CYCLE_LEN = 30240

//safe length default is 1/3 of cycle length. Minimum is 1/2 of cycle length

//cannot be longer than safe length
const MIN_VOTE_LENGTH = 60

//minutes after game begins
const DEF_VOTE_TIME = 960

const MIN_MAX_KILL = 1
const DEF_MAX_GLOBAL_KILL = Number.MAX_SAFE_INTEGER

@Component({
    selector: 'game-rules',
    templateUrl: './game-rules.component.html',
    styleUrls: ['./game-rules.component.css']
})
export class GameRules {

    testing_overrule: boolean //default false. Turn on if lengths need to be shortened

    scheduledEnd: boolean //if the game has a scheduled end date
    wipeOutEnd: boolean //if true then killers need to kill all civilians to win, or just get majority

    minPlayers: number //number of minimum players
    fractionKillers: number //fractional ratio of civilians who are killers

    gameLength: number //the number of miliseconds the game is long.
    dayCycleLength: number //the number of miliseconds in the day cycle
    safeLength: number //the number of miliseconds kills aren't allowed each cycle
    voteLength: number //the number of miliseconds at the begining of safe time voting is allowed
    
    //number of miliseconds after game start
    voteTime: number //number of miliseconds 

    maxSoloKills: number //number of kills a single killer can do a day
    maxGlobalKills: number //number of kills per day allowed total across all killers

    constructor() {
        this.scheduledEnd = true
        this.wipeOutEnd = true
        this.testing_overrule = false

        this.minPlayers = MIN_MIN_PLAYERS
        this.fractionKillers = MIN_FRACTION_KILLERS

        this.gameLength = DEF_GAME_LENGTH * MS_SCALE
        this.dayCycleLength = DEF_CYCLE_LEN * MS_SCALE
        
        this.safeLength = (this.dayCycleLength/3)
        this.voteLength = MIN_VOTE_LENGTH * MS_SCALE

        this.voteTime = DEF_VOTE_TIME * MS_SCALE

        this.maxSoloKills = MIN_MAX_KILL
        this.maxGlobalKills = DEF_MAX_GLOBAL_KILL
    }

    isScheduledEnd() {
        return this.scheduledEnd
    }

    isWipeoutEnd() {
        return this.wipeOutEnd
    }

    setScheduledEnd(b: boolean) {
        this.scheduledEnd = b
        return SUCCESS
    }

    setWipeoutEnd(b: boolean) {
        this.wipeOutEnd = b
        return SUCCESS
    }

    //GETTERS
    getMinPlayers() {
        return this.minPlayers
    }

    getFractionKillers() {
        return this.fractionKillers
    }

    //game length in ms
    getGameLength() {
        return this.gameLength
    }

    getGameLengthHours() {
        return (this.gameLength / (60 * MS_SCALE))
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
        if(minPlayers < MIN_MIN_PLAYERS) {
            return FAILURE
        }

        this.minPlayers = minPlayers
        return SUCCESS
    }

    setFractionKillers(frac: number) {
        if((frac > 1) || (frac <= 0)) {
            return FAILURE
        }

        this.fractionKillers = frac
        return SUCCESS
    }

    setGameDurations(gameMinutes: number, cycleMinutes: number, 
                     safeMinutes: number, voteMinutes: number) {

        if(((gameMinutes) < MIN_GAME_LENGTH) && !this.testing_overrule) {
            return FAILURE
        } else if((cycleMinutes > (gameMinutes / 6)) || (cycleMinutes < 0) || cycleMinutes > MAX_CYCLE_LEN) {
            return FAILURE
        } else if((safeMinutes > (cycleMinutes / 2)) || (safeMinutes < MIN_VOTE_LENGTH && !this.testing_overrule)) {
            return FAILURE
        } else if((voteMinutes > safeMinutes) || (voteMinutes < MIN_VOTE_LENGTH && !this.testing_overrule)) {
            return FAILURE
        }

        this.gameLength = (gameMinutes * MS_SCALE)
        this.dayCycleLength = (cycleMinutes * MS_SCALE)
        this.safeLength = (safeMinutes * MS_SCALE)
        this.voteLength = (voteMinutes * MS_SCALE)
        return SUCCESS
    }

    setMaxSoloKill(maxKills: number) {
        if(maxKills < MIN_MAX_KILL) {
            return FAILURE
        }
        this.maxSoloKills = maxKills
        return SUCCESS
    }

    setMaxGlobalKill(maxKills: number) {
        if(maxKills < MIN_MAX_KILL) {
            return FAILURE
        }
        this.maxGlobalKills = maxKills
        return SUCCESS
    }

    isTestingOverrule() {
        return this.testing_overrule
    }

    setTestingOverrule(b: boolean) {
        this.testing_overrule = b
        return SUCCESS
    }

}