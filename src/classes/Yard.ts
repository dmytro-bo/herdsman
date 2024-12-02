import Entity from "../models/Entity";
import PIXI, { Graphics } from "pixi.js";
import { PointData } from "pixi.js/lib/maths/point/PointData";
import { StepParams } from "../models/types";

export default class Yard extends Entity {
  img: Graphics;
  size: number = 100;

  constructor(pos: PointData) {
    super(pos);
    this.img = new PIXI.Graphics()
      .circle(this.size, this.size, this.size)
      .fill(0xffff00)
      .stroke({ color: 0xc0c000, width: 2 });

    this.img.pivot = { x: this.size, y: this.size };
  }

  step(params: StepParams): void {}
}
