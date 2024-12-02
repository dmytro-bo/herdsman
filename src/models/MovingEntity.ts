import { IMovingEntity } from "./interface";
import Entity from "./Entity";
import { PointData } from "pixi.js/lib/maths/point/PointData";
import Maths from "../lib/Maths";
import { MotionData, MoveParams, Speed, StepParams } from "./types";

export default abstract class MovingEntity
  extends Entity
  implements IMovingEntity
{
  abstract readonly velocity: number;

  protected v: number = 0;
  protected moveData: MotionData = this.distanceTo({ x: this.x, y: this.y });

  get info(): MotionData & Speed {
    return { ...this.moveData, v: this.v };
  }

  moveTo({ x = this.x, y = this.y, v = this.v }: MoveParams): void {
    this.v = v;
    this.moveData = this.distanceTo({ x, y });
  }

  moveBy({ x = 0, y = 0, v }: MoveParams): void {
    this.moveTo({ x: this.x + x, y: this.y + y, v });
  }

  step({ deltaMs }: StepParams): void {
    if (!this.v) return;

    const v: number = this.v;
    const s: number = (v * deltaMs) / 1000;
    const toX: number = this.info.to?.x || this.x;
    const toY: number = this.info.to?.y || this.y;
    const distance: MotionData = this.distanceTo({ x: toX, y: toY });

    if (distance.abs < s) {
      this.x = toX;
      this.y = toY;
      this.v = 0;
    } else {
      this.x += s * distance.cos;
      this.y += s * distance.sin;
    }
  }

  distanceTo({ x, y }: PointData): MotionData {
    return Maths.distance(this.point, { x, y });
  }
}
