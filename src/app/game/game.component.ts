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
  racket0Y = 40;
  racket1Y = 40;
  racket0X = this.racketMargin;
  racket1X = 100 - this.racketMargin - this.racketWidth;
  ballX = -1 * this.ballWidth;
  ballY = -1 * this.ballHeight;
  canMoveBall = false;
  canMoveRackets = false;

  constructor() {}

  ngOnInit() {
    document.addEventListener("keydown", this.keyDown);
  }

  keyDown(e: KeyboardEvent) {
    if (e.code === "KeyW") {
      window.requestAnimationFrame(() => this.moveRacket0(-0.5));
    }
    if (e.code === "KeyS") {
      window.requestAnimationFrame(() => this.moveRacket0(0.5));
    }
    if (e.code === "ArrowDown") {
      window.requestAnimationFrame(() => this.moveRacket1(-0.5));
    }
    if (e.code === "ArrowUp") {
      window.requestAnimationFrame(() => this.moveRacket1(0.5));
    }
  }

  resetAll() {
    this.score0 = 0;
    this.score1 = 0;
    this.resetBallAndRackets();
  }

  resetBallAndRackets() {
    this.racket0Y = 40;
    this.racket1Y = 40;
    this.ballX = -1 * this.ballWidth;
    this.ballY = -1 * this.ballHeight;
    this.canMoveBall = false;
  }

  newGame() {
    this.resetAll();
    this.startRound();
  }

  startRound() {
    this.setBall();
    const xIncrement = this.getRandomIncrement();
    const yIncrement = this.getRandomIncrement();
    this.canMoveBall = true;
    this.canMoveRackets = true;
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
    if (!this.canMoveBall) {
      return;
    }
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

  moveRacket0(yIncrement: number) {
    if (!this.canMoveRackets) {
      return;
    }
    if (this.racket0Y <= 0 || this.racket0Y + this.racketHeight >= 300) {
      return;
    }
    window.requestAnimationFrame(() => this.moveRacket0(yIncrement));
  }

  moveRacket1(yIncrement: number) {
    if (!this.canMoveRackets) {
      return;
    }
    if (this.racket1Y <= 0 || this.racket1Y + this.racketHeight >= 300) {
      return;
    }
    window.requestAnimationFrame(() => this.moveRacket1(yIncrement));
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
    const racket0RightX = this.racket0X + this.racketWidth;
    const ballCenterY = this.ballY + this.ballHeight / 2;
    return (
      this.ballX <= racket0RightX &&
      this.ballX > this.racket0X &&
      ballCenterY >= this.racket0Y &&
      ballCenterY <= this.racket0Y + this.racketHeight
    );
  }

  isBallCollidedWithRacket1(): boolean {
    const ballRightX = this.ballX + this.ballWidth;
    const racket1RightX = this.racket1X + this.racketWidth;
    const ballCenterY = this.ballY + this.ballHeight / 2;
    return (
      ballRightX >= this.racket1X &&
      ballRightX < racket1RightX &&
      ballCenterY >= this.racket1Y &&
      ballCenterY <= this.racket1Y + this.racketHeight
    );
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
