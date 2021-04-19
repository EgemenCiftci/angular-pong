import { Component, ViewChild } from "@angular/core";
import { GameComponent } from "./game/game.component";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  @ViewChild(GameComponent) gameComponent: GameComponent;
}
