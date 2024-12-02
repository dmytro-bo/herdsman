import { Container } from "pixi.js/lib/scene/container/Container";
import { PointData } from "pixi.js/lib/maths/point/PointData";
import { Application } from "pixi.js";
import { Size } from "pixi.js/lib/maths/misc/Size";
import { MotionData, MoveParams, Speed, StepParams } from "./types";

export interface IGame {
  get size(): Size;
  app: Application;
  yard: IEntity;
  herd: IHerd;
  herdsman: IHerdsman;
  rndPos(): PointData;
}

export interface IStep {
  step(params: StepParams): void;
  syncImg(): void;
}

export interface IEntity extends IStep {
  get point(): PointData;
  img: Container;
  size: number;
}

export interface IMovingEntity extends IEntity {
  readonly velocity: number;
  get info(): MotionData & Speed;
  moveTo({ x, y, v }: MoveParams): void;
  moveBy({ x, y, v }: MoveParams): void;
}

export interface IHerd extends IStep {
  items: IAnimal[];
}

export interface IAnimal extends IMovingEntity {
  readonly alertVelocity: number;
  readonly followVelocity: number;
  readonly alertRange: number;
  isCaught: boolean;
  isDodging: boolean;
  hasCollision: boolean;
}

export interface IHerdsman extends IMovingEntity {
  readonly capacity: number;
}
