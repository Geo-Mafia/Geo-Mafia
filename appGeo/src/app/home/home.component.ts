import { Component, OnInit } from '@angular/core'
import {Bubble} from '../map/map.component'

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
    var bubble1 =  new Bubble();
    bubble1.init_bubble('Campus', 41.79, 41.78, -87.59, -87.6);
  }

}
