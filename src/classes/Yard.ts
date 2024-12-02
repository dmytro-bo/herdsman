import Entity from "../models/Entity";
import PIXI, { BlurFilter, Text } from "pixi.js";
import { PointData } from "pixi.js/lib/maths/point/PointData";
import { IYard } from "../models/interfaces";
import { Container } from "pixi.js/lib/scene/container/Container";

export default class Yard extends Entity implements IYard {
  static size: number = 100;

  img: Container;
  size: number = Yard.size;

  private count: number = 0;
  private score: Text;

  constructor(position: PointData) {
    super(position);
    this.score = new PIXI.Text({
      text: this.count,
      anchor: 0.4,
      x: this.size,
      y: this.size,
      filters: [new BlurFilter({ strength: 2 })],
      style: {
        fontFamily: "Arial",
        fontSize: 80,
        fill: 0x007000,
      },
    });

    this.img = new PIXI.Container({
      children: [
        new PIXI.Graphics()
          .circle(this.size, this.size, this.size)
          .fill(0xffff00)
          .stroke({ color: 0xc0c000, width: 2 }),
        this.score,
      ],
      pivot: { x: this.size, y: this.size },
    });
  }

  addScore(): void {
    this.count++;
    this.score.text = this.count;
  }
}
