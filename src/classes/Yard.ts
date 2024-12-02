import Entity from "../models/Entity";
import PIXI, { BlurFilter, Graphics, Text, Texture } from "pixi.js";
import { PointData } from "pixi.js/lib/maths/point/PointData";
import { IYard } from "../models/interfaces";

export default class Yard extends Entity implements IYard {
  static radius: number = 100;

  radius: number = Yard.radius;

  private count: number = 0;
  private score: Text;

  fallbackImg: Graphics = new PIXI.Graphics()
    .circle(this.radius, this.radius, this.radius)
    .fill(0xffff00)
    .stroke({ color: 0xc0c000, width: 2 });
  constructor(position: PointData) {
    super(position);
    this.score = new PIXI.Text({
      text: this.count,
      anchor: 0.5,
      x: this.radius,
      y: this.radius,
      filters: [new BlurFilter({ strength: 2 })],
      style: {
        fontFamily: "Arial",
        fontSize: 72,
        fill: 0x007000,
      },
    });
  }

  applyTexture(texture: Texture): this {
    super.applyTexture(texture);

    this.img.addChild(this.score);
    return this;
  }

  addScore(): void {
    this.count++;
    this.score.text = this.count;
  }
}
