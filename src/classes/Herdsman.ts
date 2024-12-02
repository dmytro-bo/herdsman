import MovingEntity from "../models/MovingEntity";
import PIXI, { Graphics } from "pixi.js";
import { PointData } from "pixi.js/lib/maths/point/PointData";
import { IHerdsman } from "../models/interface";

export default class Herdsman extends MovingEntity implements IHerdsman {
  readonly capacity: number = 5;
  readonly velocity: number = 500;

  img: Graphics;
  size: number = 30;

  constructor(pos: PointData) {
    super(pos);
    this.img = new PIXI.Graphics()
      .circle(this.size, this.size, this.size)
      .fill(0xf00000)
      .stroke({ color: 0xa00000, width: 2 });

    this.img.pivot = { x: this.size, y: this.size };
  }
}
