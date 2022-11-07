import { Component, OnInit } from '@angular/core'
import {Bubble} from '../map/map.component'
import {Player} from '../player/player.component'

@Component({
  selector: 'Home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  bubble1: Bubble;
  constructor() {
    // Use the component constructor to inject providers.
  }

  ngOnInit(): void {
    // Init your component properties here.
    // Going to initialize a list of bubbles here;
    this.bubble1 =  new Bubble();
    this.bubble1.init_bubble('Campus', 41.79, 41.78, -87.59, -87.6);
    var Player1 = new Player();
    var Player2 = new Player();

    var P1point = {x: 41.7901, y: -87.5999 };
    Player1.init_Player(1, "SUUUper", P1point, true);
    var P2point = {x: 41.000001, y: -87.590001};
    Player2.init_Player(1, "Player2", P1point, true);

    this.bubble1.addPlayer(Player1);
    this.bubble1.addPlayer(Player2);

  }

}
