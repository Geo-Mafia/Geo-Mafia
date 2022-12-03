import { Component, OnInit} from '@angular/core';
import { GameDataService} from '../services/game-data.service'
import { Game } from '../game/game.component'

@Component({
    selector: 'Admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
  })

export class AdminComponent implements OnInit {

    public game: Game
    public startEndButtonText: string

    constructor(private gameData: GameDataService) {
    }

    ngOnInit(): void {
        this.gameData.currentGame.subscribe(game => this.game = game)
        this.setStartButtonEndText()
    }

    activateGame() {
      console.log("Activate game button pressed")
      if(this.game.gameActive == 0) {
        this.gameData.broadcast("startGame");
      } else {
        this.gameData.broadcast("endGame");
      }
    }

    openVoting() {
      if(this.game.getGameActive() == 1) {
        this.gameData.broadcast("openVoting")
      }
      
    }

    closeVoting() {
      if(this.game.getGameActive() == 1) {
        this.gameData.broadcast("closeVoting")
      }
    }

    endSafety() {
      if(this.game.getGameActive() == 1) {
        this.gameData.broadcast("endSafety")
      }
    }

    saveGame() {
      this.gameData.updateGame(this.game);
    }

    setStartButtonEndText() {
      if(this.game.getGameActive() == 0) {
        this.startEndButtonText = "Start Game"
      } else {
        this.startEndButtonText = "End Game"
      }
    }

}