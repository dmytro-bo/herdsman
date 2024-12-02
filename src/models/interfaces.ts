import { Container } from "pixi.js/lib/scene/container/Container";
import { PointData } from "pixi.js/lib/maths/point/PointData";
import { Application, Texture } from "pixi.js";

// v: velocity pixels per second
export type Speed = { v: number };

export type FieldParams = {
  onClick: (position: PointData) => void;
  width: number;
  height: number;
};
export type TickParams = { deltaMs: number; game: IGame };
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

export interface IGame {
  app: Application;
  assets: Record<string, Texture>;
  yard: IYard;
  field: IField;
  herdsman: IHerdsman;
}
export interface ITickable {
  tick(params: TickParams): void;
}

export interface IEntity {
  img: Container;
  fallbackImg?: Container;
  radius: number;
  get point(): PointData;
  renderTo(container: Container): void;
  applyTexture(texture: Texture): this;
  syncImgPosition(): void;
}

export interface IMovingEntity extends IEntity, ITickable {
  readonly baseSpeed: number;
  get info(): MotionData & Speed;
  moveTo({ x, y, v }: MoveParams): void;
  moveBy({ x, y, v }: MoveParams): void;
}

export interface IField extends IEntity {
  rndPoint(): PointData;
  items: Set<IAnimal>;
  removeItem: (item: IAnimal) => void;
}

export interface IAnimal extends IMovingEntity {
  readonly alertSpeed: number;
  readonly followSpeed: number;
  readonly alertRange: number;
  isCaught: boolean;
  isDodging: boolean;
  hasCollision: boolean;
}

export interface IHerdsman extends IMovingEntity {
  readonly capacity: number;
}

export interface IYard extends IEntity {
  addScore(): void;
}
