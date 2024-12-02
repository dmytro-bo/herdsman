import { IEntity } from "./interfaces";
import { PointData } from "pixi.js/lib/maths/point/PointData";
import { Container } from "pixi.js/lib/scene/container/Container";

export default abstract class Entity implements IEntity {
  protected x: number;
  protected y: number;

  abstract size: number;
  abstract img: Container;

  constructor({ x, y }: PointData = { x: 0, y: 0 }) {
    this.x = x;
    this.y = y;
  }

  get point(): PointData {
    return { x: this.x, y: this.y };
  }

  renderTo(container: Container): void {
    this.syncImg();
    container.addChild(this.img);
  }

  syncImg(): void {
    this.img.position.set(this.x, this.y);
  }
}
