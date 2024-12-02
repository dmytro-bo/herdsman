import MovingEntity from "../models/MovingEntity";
import { IHerdsman } from "../models/interfaces";
import PIXI, { Graphics } from "pixi.js";

export default class Herdsman extends MovingEntity implements IHerdsman {
  readonly capacity: number = 5;
  readonly baseSpeed: number = 500;

  radius: number = 30;

  fallbackImg: Graphics = new PIXI.Graphics()
    .circle(this.radius, this.radius, this.radius)
    .fill(0xf00000)
    .stroke({ color: 0xa00000, width: 2 });
}
