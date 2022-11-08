import { Component, OnInit } from '@angular/core'
import {Bubble} from '../map/map.component'
import {Player} from '../player/player.component'
import {CampusMap} from '../map/campus-map.component'

@Component({
  selector: 'Home',
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit {

  constructor() {
    // Use the component constructor to inject providers.
  }

  ngOnInit(): void {
    // Init your component properties here.
    // Going to initialize a list of bubbles here;
    var map = new CampusMap;
  }

}
