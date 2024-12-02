import { IEntity } from "./interfaces";
import { PointData } from "pixi.js/lib/maths/point/PointData";
import { Container } from "pixi.js/lib/scene/container/Container";
import PIXI, { Sprite, Texture } from "pixi.js";

export default abstract class Entity implements IEntity {
  protected x: number;
  protected y: number;

  abstract radius: number;
  fallbackImg?: Container;
  img: Container;

  constructor({ x, y }: PointData = { x: 0, y: 0 }) {
    this.x = x;
    this.y = y;
    this.img = new PIXI.Container();
    this.syncImgPosition();
  }

  get point(): PointData {
    return { x: this.x, y: this.y };
  }

  applyTexture(texture: Texture): this {
    if (texture) {
      const image: Sprite = new PIXI.Sprite(texture);
      image.width = this.radius * 2;
      image.height = this.radius * 2;
      this.img.addChild(image);
    } else if (this.fallbackImg) {
      this.img.addChild(this.fallbackImg);
    }
    this.img.pivot = { x: this.radius, y: this.radius };

    return this;
  }

  renderTo(container: Container): void {
    container.addChild(this.img);
  }

  syncImgPosition(): void {
    this.img.position.set(this.x, this.y);
  }

  insertImage(data: Container): void {
    this.img.addChild(data);
  }
}
