import MovingEntity from "../models/MovingEntity";
import PIXI, { Graphics } from "pixi.js";
import { PointData } from "pixi.js/lib/maths/point/PointData";
import { IAnimal } from "../models/interface";
import Rnd from "../lib/Rnd";
import { FromTo } from "../models/types";

export default class Animal extends MovingEntity implements IAnimal {
  private readonly sizeRange: FromTo<number> = { from: 20, to: 30 };

  readonly size: number = this.pickSize();
  readonly velocity: number = this.getVelocity();
  readonly alertVelocity: number = this.velocity + 100;
  readonly followVelocity: number = this.velocity + 50;
  readonly alertRange: number = this.getAlertRange();
  readonly img: Graphics;

  isCaught: boolean = false;
  isDodging: boolean = false;
  hasCollision: boolean = false;

  constructor(pos: PointData) {
    super(pos);
    this.img = new PIXI.Graphics()
      .circle(this.size, this.size, this.size)
      .fill(0xffffff)
      .stroke({ color: 0xa0a0a0, width: 2 });

    this.img.pivot = { x: this.size, y: this.size };
  }

  private pickSize(): number {
    return Rnd.val(this.sizeRange.from, this.sizeRange.to, 1);
  }

  private getVelocity(): number {
    const ratio: number = 5;
    return (this.sizeRange.from + this.sizeRange.to - this.size) * ratio;
  }

  private getAlertRange(): number {
    const ratio: number = 10;
    return this.size * ratio;
  }
}
