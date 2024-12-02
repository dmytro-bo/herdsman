import MovingEntity from "../models/MovingEntity";
import PIXI, { Graphics } from "pixi.js";
import { PointData } from "pixi.js/lib/maths/point/PointData";
import { FromTo, IAnimal } from "../models/interfaces";
import Rnd from "../lib/Rnd";

export default class Animal extends MovingEntity implements IAnimal {
  private readonly sizeVariance: FromTo<number> = { from: 20, to: 30 };

  readonly size: number = this.pickSize();
  readonly baseSpeed: number = this.calcSpeed();
  readonly alertSpeed: number = this.baseSpeed + 100;
  readonly followSpeed: number = this.baseSpeed + 50;
  readonly alertRange: number = this.getAlertRange();
  readonly img: Graphics;

  isCaught: boolean = false;
  isDodging: boolean = false;
  hasCollision: boolean = false;

  constructor(position: PointData) {
    super(position);
    this.img = new PIXI.Graphics()
      .circle(this.size, this.size, this.size)
      .fill(0xffffff)
      .stroke({ color: 0xa0a0a0, width: 2 });

    this.img.pivot = { x: this.size, y: this.size };
  }

  private pickSize(): number {
    return Rnd.val(this.sizeVariance.from, this.sizeVariance.to, 1);
  }

  private calcSpeed(): number {
    const ratio: number = 5;
    return (this.sizeVariance.from + this.sizeVariance.to - this.size) * ratio;
  }

  private getAlertRange(): number {
    const ratio: number = 10;
    return this.size * ratio;
  }
}
