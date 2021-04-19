import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.svg",
  styleUrls: ["./game.component.css"]
})
export class GameComponent implements OnInit {
  // constants
  ballWidth = 3;
  ballHeight = 4;
  racketWidth = 3;
  racketHeight = 20;
  racketMargin = 3;

  score0 = 0;
  score1 = 0;
  y0 = 40;
  y1 = 40;
  ballX = -1 * this.ballWidth;
  ballY = -1 * this.ballHeight;

  constructor() {}

  ngOnInit() {}

  resetAll() {
    this.score0 = 0;
    this.score1 = 0;
    this.resetBallAndRackets();
  }

  resetBallAndRackets() {
    this.y0 = 40;
    this.y1 = 40;
    this.ballX = -1 * this.ballWidth;
    this.ballY = -1 * this.ballHeight;
  }

  newGame() {
    this.resetAll();
    this.startRound();
  }

  startRound() {
    this.setBall();
    const xIncrement = this.getRandomIncrement();
    const yIncrement = this.getRandomIncrement();
    window.requestAnimationFrame(() => this.moveBall(xIncrement, yIncrement));
  }

  getRandomIncrement(): number {
    const isNegative = Math.floor(Math.random() * 2) === 1;
    return ((Math.floor(Math.random() * 3) + 3) * (isNegative ? -1 : 1)) / 10;
  }

  setBall() {
    this.ballX = 48.5;
    this.ballY = Math.floor(Math.random() * (100 - this.ballHeight + 1));
  }

  async moveBall(xIncrement: number, yIncrement: number) {
    this.ballX += xIncrement;
    this.ballY += yIncrement;

    if (this.isBallCollidedWithWalls()) {
      yIncrement *= -1;
    }

    if (this.isBallCollidedWithRacket0()) {
      xIncrement *= -1;
    } else if (this.isBallCollidedWithRacket1()) {
      xIncrement *= -1;
    }

    if (this.isPlayer0Scored()) {
      this.score0++;
      if (!this.isPlayer0Win() && !this.isPlayer1Win()) {
        await this.delay(1000);
        this.startRound();
      }
      return;
    } else if (this.isPlayer1Scored()) {
      this.score1++;
      if (!this.isPlayer0Win() && !this.isPlayer1Win()) {
        await this.delay(1000);
        this.startRound();
      }
      return;
    }

    window.requestAnimationFrame(() => this.moveBall(xIncrement, yIncrement));
  }

  applyCollisionWithRackets(xIncrement: number): number {
    if (
      this.ballX <= this.racketMargin + this.racketWidth ||
      this.ballX + this.ballWidth >= 100 - this.racketMargin - this.racketWidth
    ) {
      return -1 * xIncrement;
    } else {
      return xIncrement;
    }
  }

  isBallCollidedWithRacket0(): boolean {
    return false;
  }

  isBallCollidedWithRacket1(): boolean {
    return false;
  }

  isBallCollidedWithWalls(): boolean {
    return this.ballY <= 0 || this.ballY + this.ballHeight >= 100;
  }

  isPlayer0Scored(): boolean {
    return this.ballX >= 100;
  }

  isPlayer1Scored(): boolean {
    return this.ballX + this.ballWidth <= 0;
  }

  isPlayer0Win(): boolean {
    return this.score0 === 10;
  }

  isPlayer1Win(): boolean {
    return this.score1 === 10;
  }

  delay(ms: number): Promise<void> {
    return new Promise(f => setTimeout(f, ms));
  }
}
