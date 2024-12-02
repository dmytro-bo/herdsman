import { PointData } from "pixi.js/lib/maths/point/PointData";

// v: velocity pixels per second
export type Speed = { v: number };
export type StepParams = { deltaMs: number };
export type MoveParams = Partial<PointData & Speed>;

export type FromTo<T> = {
  from: T;
  to: T;
};

export type MotionData = FromTo<PointData> & {
  delta: PointData;
  abs: number;
  cos: number;
  sin: number;
  tan: number;
};
