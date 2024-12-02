import { IEntity } from "./interface";
import { Container } from "pixi.js/lib/scene/container/Container";
import { PointData } from "pixi.js/lib/maths/point/PointData";
import { StepParams } from "./types";

export default abstract class Entity implements IEntity {
  protected x: number;
  protected y: number;

  abstract size: number;
  abstract img: Container;
  abstract step(params: StepParams): void;

  constructor({ x, y }: PointData) {
    this.x = x;
    this.y = y;
  }

  get point(): PointData {
    return { x: this.x, y: this.y };
  }

  syncImg(): void {
    this.img.position.set(this.x, this.y);
  }
}
