import { Component, OnInit} from '@angular/core';
import { GameDataService} from '../services/game-data.service'
import { Game } from '../game/game.component'

@Component({
    selector: 'Admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
  })

export class AdminComponent implements OnInit {

    private game: Game
    public gameActive: boolean

    constructor(private gameData: GameDataService) {
    }

    ngOnInit(): void {
        this.gameData.currentGame.subscribe(game => this.game = game)
        this.gameActive = true
    }

    activateStartGame() {
      console.log("Start Game Button pressed")
      this.gameData.broadcast('startGame');
    }

    saveGame() {
      this.gameData.updateGame(this.game);
    }

}