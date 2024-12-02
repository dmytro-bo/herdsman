import { PointData } from "pixi.js/lib/maths/point/PointData";
import { MotionData } from "../models/interfaces";

class Maths {
  round(value: number, precision: number = 0): number {
    const fractionDigits: number =
      precision < 0 ? 0 : precision > 100 ? 100 : Math.floor(precision);

    return +value.toFixed(fractionDigits || 0);
  }

  fractionLength(value: number): number {
    return String(value).split(".")[1]?.length ?? 0;
  }

  distance(from: PointData, to: PointData): MotionData {
    const d: PointData = { x: to.x - from.x, y: to.y - from.y };
    const abs: number = Math.sqrt(d.x ** 2 + d.y ** 2);
    const cos: number = abs ? d.x / abs : 1;
    const sin: number = abs ? d.y / abs : 0;
    const tan: number = d.y / d.x;

    return { to, from, delta: d, abs, cos, sin, tan };
  }
}

export default new Maths();
