import PIXI, { Application, Graphics, Texture, Ticker } from "pixi.js";
import Yard from "./Yard";
import Field from "./Field";
import Herdsman from "./Herdsman";
import { PointData } from "pixi.js/lib/maths/point/PointData";
import { ApplicationOptions } from "pixi.js/lib/app/Application";
import { IGame } from "../models/interfaces";

import herdsman from "../assets/herdsman.webp";
import animal from "../assets/animal.webp";
import yard from "../assets/yard.webp";

export class Game implements IGame {
  assets: Record<string, Texture> = {};
  app: Application;
  field: Field;
  yard: Yard;
  herdsman: Herdsman;

  constructor() {
    this.app = new PIXI.Application();
    const width: number = document.documentElement.clientWidth;
    const height: number = document.documentElement.clientHeight;

    this.yard = new Yard({ x: Yard.radius / 2, y: Yard.radius / 2 });
    this.herdsman = new Herdsman({ x: width / 2, y: height / 2 });
    this.field = new Field({
      width,
      height,
      onClick: (position: PointData): void =>
        this.herdsman.moveTo({ ...position, v: this.herdsman.baseSpeed }),
    });

    this.init({ width, height }).catch();
  }

  async init(options: Partial<ApplicationOptions>): Promise<void> {
    await this.app.init(options);
    this.assets = await PIXI.Assets.load([herdsman, animal, yard]);

    this.renderEntities();
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

  private renderEntities(): void {
    const fieldBackground: Texture = this.app.renderer.generateTexture(
      this.field.createBackground(),
    );
    this.field.applyTexture(fieldBackground).renderTo(this.app.stage);
    this.yard.applyTexture(this.assets[yard]).renderTo(this.app.stage);
    this.herdsman.applyTexture(this.assets[herdsman]).renderTo(this.app.stage);
  }
}
