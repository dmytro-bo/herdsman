import PIXI, { Application, FederatedPointerEvent, Sprite } from "pixi.js";
import Rnd from "../lib/Rnd";
import { PointData } from "pixi.js/lib/maths/point/PointData";

export default class Background {
  private readonly tileSize: number = 5;
  private readonly img: Sprite;

  constructor(
    params: { onClick: (position: PointData) => void },
    private app: Application,
  ) {
    const pattern = new PIXI.Graphics();

    for (let x: number = 0; x < app.screen.width; x += this.tileSize) {
      for (let y: number = 0; y < app.screen.height; y += this.tileSize) {
        pattern.rect(x, y, this.tileSize, this.tileSize);
        pattern.fill(Rnd.val(0x004400, 0x007700, 0x100));
      }
    }

    this.img = new PIXI.Sprite(app.renderer.generateTexture(pattern));
    this.addClickListener(params.onClick);
  }

  private addClickListener(onClick: (position: PointData) => void): void {
    this.img.eventMode = "static";
    this.img.on("pointerdown", (event: FederatedPointerEvent): void =>
      onClick({ x: event.x, y: event.y }),
    );
  }

  render(): void {
    this.app.stage.addChild(this.img);
  }
}
