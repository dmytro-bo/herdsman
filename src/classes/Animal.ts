import MovingEntity from "../models/MovingEntity";
import PIXI, { Graphics } from "pixi.js";
import { FromTo, IAnimal } from "../models/interfaces";
import Rnd from "../lib/Rnd";

export default class Animal extends MovingEntity implements IAnimal {
  private readonly sizeVariance: FromTo<number> = { from: 20, to: 30 };

  readonly radius: number = this.pickSize();
  readonly baseSpeed: number = this.calcSpeed();
  readonly alertSpeed: number = this.baseSpeed + 100;
  readonly followSpeed: number = this.baseSpeed + 50;
  readonly alertRange: number = this.getAlertRange();

  isCaught: boolean = false;
  isDodging: boolean = false;
  hasCollision: boolean = false;

  fallbackImg: Graphics = new PIXI.Graphics()
    .circle(this.radius, this.radius, this.radius)
    .fill(0xffffff)
    .stroke({ color: 0xa0a0a0, width: 2 });

  private pickSize(): number {
    return Rnd.val(this.sizeVariance.from, this.sizeVariance.to, 1);
  }

  private calcSpeed(): number {
    const ratio: number = 5;
    return (
      (this.sizeVariance.from + this.sizeVariance.to - this.radius) * ratio
    );
  }

  private getAlertRange(): number {
    const ratio: number = 10;
    return this.radius * ratio;
  }
}
