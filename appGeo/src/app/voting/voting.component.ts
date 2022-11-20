import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { InjectableAnimationEngine } from '@nativescript/angular';
import { ChangeType } from '@nativescript/core';
import { Bubble } from '../map/map.component';
import {Player, Civilian, Killer} from '../player/player.component'
import {GameRules} from '../game/game-rules.component'
import {Game} from '../game/game.component'
//import{Location} from './location_class_declaration';

const DEAD = 0
const ALIVE = 1
const DAILYMAXKILLCOUNT = 2
const SUCCESS = 10
const FAILURE = -10

@Component({
  selector: 'voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})


export class VotingComponent implements OnInit{
    ngOnInit(): void {
    }
}