import PIXI, { Application, Ticker } from "pixi.js";
import Yard from "./Yard";
import Field from "./Field";
import Herdsman from "./Herdsman";
import { PointData } from "pixi.js/lib/maths/point/PointData";
import { IEntity, IGame } from "../models/interfaces";

export class Game implements IGame {
  app: Application;
  field: Field;
  yard: Yard;
  herdsman: Herdsman;

  private width: number;
  private height: number;

  constructor() {
    this.app = new PIXI.Application();
    this.width = document.documentElement.clientWidth;
    this.height = document.documentElement.clientHeight;

    this.yard = new Yard({ x: Yard.size / 2, y: Yard.size / 2 });
    this.herdsman = new Herdsman({ x: this.width / 2, y: this.height / 2 });
    this.field = new Field({
      width: this.width,
      height: this.height,
      onClick: (position: PointData): void =>
        this.herdsman.moveTo({ ...position, v: this.herdsman.baseSpeed }),
    });
  }

  async init(): Promise<void> {
    await this.app.init({
      width: this.width,
      height: this.height,
    });
    [this.field, this.yard, this.herdsman].forEach((entity: IEntity): void => {
      entity.renderTo(this.app.stage);
    });
    document.body.appendChild(this.app.canvas);
    this.run();
  }

  private run(): void {
    this.app.ticker.add((ticker: Ticker): void => {
      const params = { deltaMs: ticker.deltaMS, game: this };

      this.field.tick(params);
      this.herdsman.tick(params);
    });
  }
}
