import {
  FieldParams,
  IAnimal,
  IField,
  IGame,
  ITickable,
  TickParams,
} from "../models/interfaces";
import FieldHelper from "../lib/FieldHelper";
import Animal from "./Animal";
import Rnd from "../lib/Rnd";
import { Container } from "pixi.js/lib/scene/container/Container";
import PIXI, { FederatedPointerEvent, Graphics, Texture } from "pixi.js";
import Entity from "../models/Entity";
import Maths from "../lib/Maths";
import { PointData } from "pixi.js/lib/maths/point/PointData";
import animal from "../assets/animal.webp";

export default class Field extends Entity implements IField, ITickable {
  radius: number;
  items: Set<IAnimal> = new Set();

  private itemsLimit: number = 30;
  private width: number;
  private height: number;

  constructor({ width, height, onClick }: FieldParams) {
    super();
    this.width = width;
    this.height = height;
    this.radius = Math.max(width, height) / 2;
    this.img.eventMode = "static";
    this.img.on("pointerdown", (event: FederatedPointerEvent): void =>
      onClick({ x: event.x, y: event.y }),
    );
  }

  tick(params: TickParams): void {
    FieldHelper.processTick(this.items, params);

    this.createItem(params.game);
  }

  renderTo(container: Container): void {
    super.renderTo(container);

    this.items.forEach((item: IAnimal): void => item.renderTo(container));
  }

  removeItem(item: IAnimal): void {
    this.items.delete(item);
    item.img.destroy();
  }

  rndPoint(): PointData {
    return { x: Rnd.val(0, this.width), y: Rnd.val(0, this.height) };
  }

  applyTexture(asset: Texture): this {
    this.img.addChild(new PIXI.Sprite(asset));
    return this;
  }

  createBackground(): Graphics {
    const tileSize: number = 5;
    const pattern = new PIXI.Graphics();

    for (let x: number = 0; x < this.width; x += tileSize) {
      for (let y: number = 0; y < this.height; y += tileSize) {
        pattern.rect(x, y, tileSize, tileSize);
        pattern.fill(Rnd.val(0x004400, 0x007700, 0x100));
      }
    }
    return pattern;
  }

  private createItem(game: IGame): void {
    const chance: number = Maths.round(
      this.itemsLimit / (this.items.size + 1),
      1,
    );
    if (this.items.size < this.itemsLimit && Rnd.chance(chance)) {
      const newItem: IAnimal = new Animal(this.rndPoint());
      this.items.add(newItem);
      newItem.applyTexture(game.assets[animal]).renderTo(game.app.stage);
    }
  }
}
