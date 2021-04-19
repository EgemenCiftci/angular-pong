import { NgModule, ViewChild } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { GameComponent } from "./game/game.component";

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, GameComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
