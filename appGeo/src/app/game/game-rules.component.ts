import { Component } from '@angular/core';

export const SUCCESS = 10
export const FAILURE = -10

const MIN_MIN_PLAYERS = 5
const MIN_FRACTION_KILLERS = 0.2

//all constants in minutes
const MIN_GAME_LENGTH = 1440
const DEF_GAME_LENGTH = 10080

//safe length default is 1/3 of game length. Minimum is 1/2 of game length

const DEF_CYCLE_LEN = 1440

//cannot be longer than safe length
const MIN_VOTE_LENGTH = 60

//minutes after game begins
const DEF_VOTE_TIME = 960

const MIN_MAX_KILL = 1
const DEF_MAX_GLOBAL_KILL = Infinity

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

    gameLength: number //the number of minutes the game is long.
    dayCycleLength: number //the number of minutes in the day cycle
    safeLength: number //the number of minutes kills aren't allowed each cycle
    voteLength: number //the number of minutes at the begining of safe time voting is allowed
    
    //number of minutes after midnight
    voteTime: number //number of minutes 

    maxSoloKills: number //number of kills a single killer can do a day
    maxGlobalKills: number //number of kills per day allowed total

    constructor(gameLengthHours?) {
        this.scheduledEnd = true
        this.wipeOutEnd = true
        this.testing_overrule = false

        this.minPlayers = MIN_MIN_PLAYERS
        this.fractionKillers = MIN_FRACTION_KILLERS

        if(gameLengthHours != undefined) {
            this.gameLength = gameLengthHours * 60
            this.dayCycleLength = this.gameLength/6
        } else {
            this.gameLength = DEF_GAME_LENGTH
            this.dayCycleLength = DEF_CYCLE_LEN
        }
        this.safeLength = this.dayCycleLength/3
        this.voteLength = MIN_VOTE_LENGTH

        this.voteTime = DEF_VOTE_TIME

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
    }

    setWipeoutEnd(b: boolean) {
        this.wipeOutEnd = b
    }

    //GETTERS
    getMinPlayers() {
        return this.minPlayers
    }

    getFractionKillers() {
        return this.fractionKillers
    }

    getGameLengthHours() {
        return (this.gameLength / 60)
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
        if((frac > 1) || (frac < 0)) {
            return FAILURE
        }

        this.fractionKillers = frac
        return SUCCESS
    }

    setGameDurations(gameHours: number, cycleMinutes: number, 
                     safeMinutes: number, voteMinutes: number) {
        var gameMinutes = gameHours * 60

        if(((gameMinutes) > MIN_GAME_LENGTH)) {
            return FAILURE
        } else if((cycleMinutes > gameMinutes / 6) || (cycleMinutes < 0)) {
            return FAILURE
        } else if((safeMinutes > cycleMinutes / 2) || (safeMinutes < 600)) {
            return FAILURE
        } else if((voteMinutes > safeMinutes) || (voteMinutes < 0)) {
            return FAILURE
        }

        this.gameLength = gameMinutes
        this.dayCycleLength = cycleMinutes
        this.safeLength = safeMinutes
        this.voteLength = voteMinutes
        return SUCCESS
    }

    setVoteTime(minutesIntoCycle: number) {
        if(minutesIntoCycle > (this.dayCycleLength - this.safeLength) || minutesIntoCycle < 0) {
            return FAILURE
        }

        this.voteTime = minutesIntoCycle
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
    }

}