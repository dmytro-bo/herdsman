import PIXI, { Application, Ticker } from "pixi.js";
import Rnd from "../lib/Rnd";
import Yard from "./Yard";
import Herdsman from "./Herdsman";
import Background from "./Background";
import { PointData } from "pixi.js/lib/maths/point/PointData";
import { IEntity, IGame, IStep } from "../models/interface";
import { Herd } from "./Herd";
import { Size } from "pixi.js/lib/maths/misc/Size";

export class Game implements IGame {
  app: Application;
  herd: Herd;
  yard: Yard;
  herdsman: Herdsman;

  private width: number;
  private height: number;

  constructor() {
    this.app = new PIXI.Application();
    this.width = document.documentElement.clientWidth;
    this.height = document.documentElement.clientHeight;

    this.herd = new Herd(Herd.size, this);
    this.yard = new Yard({ x: 50, y: 50 });
    this.herdsman = new Herdsman({ x: this.width / 2, y: this.height / 2 });

    this.init().catch();
  }

  get size(): Size {
    return { width: this.width, height: this.height };
  }

  run(): void {
    this.app.ticker.add((ticker: Ticker): void => {
      [this.herd, this.herdsman].forEach((item: IStep): void => {
        item.step({ deltaMs: ticker.deltaMS });
        item.syncImg();
      });
    });
  }

  rndPos(): PointData {
    return { x: Rnd.val(0, this.width), y: Rnd.val(0, this.height) };
  }

  private async init(): Promise<void> {
    await this.app.init({
      width: this.width,
      height: this.height,
    });

    this.renderBackground();
    this.renderEntities();

    document.body.appendChild(this.app.canvas);
    this.run();
  }

  private renderBackground(): void {
    new Background(
      {
        onClick: (position: PointData): void => {
          this.herdsman.moveTo({ ...position, v: this.herdsman.velocity });
        },
      },
      this.app,
    ).render();
  }

  private renderEntities(): void {
    [this.yard, ...this.herd.items, this.herdsman].forEach(
      (entity: IEntity): void => {
        entity.syncImg();
        this.app.stage.addChild(entity.img);
      },
    );
  }
}
