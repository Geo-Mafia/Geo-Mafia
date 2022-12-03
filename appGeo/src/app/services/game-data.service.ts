import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, Observable } from "rxjs";
import { GameRules } from "../game/game-rules.component";
import { Game } from "../game/game.component"
import { CampusMap } from "../map/campus-map.component";
import { Player } from "../player/player.component"

@Injectable({
    providedIn: 'root'
})
export class GameDataService {

    private gameSource = new BehaviorSubject<Game>(new Game(new GameRules(), new CampusMap(), new Map<number, Player>))
    currentGame = this.gameSource.asObservable();

    private msgSource: Subject<any> = new Subject<string>();
    public readonly messageReceived$: Observable<string> = this.msgSource.asObservable();

    updateGame(game: Game) {
        this.gameSource.next(game)
    }

    broadcast(message: string)
    {
        this.msgSource.next(message);
    }

}