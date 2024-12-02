import {
  IAnimal,
  IGame,
  MotionData,
  MoveParams,
  TickParams,
} from "../models/interfaces";
import Maths from "./Maths";
import Rnd from "./Rnd";
import PIXI, { Graphics } from "pixi.js";

const chanceToRoam: number = 1;
const dodgeConfig = {
  scanAngleSin: Math.sin(Math.PI / 4),
  angleSin: Math.sin(Math.PI / 3),
  angleCos: Math.cos(Math.PI / 3),
};

class FieldHelper {
  caughtItems: Set<IAnimal> = new Set();

  processTick(items: Set<IAnimal>, params: TickParams): void {
    const { game } = params;
    items.forEach((item: IAnimal): void => {
      item.hasCollision = false;
    });
    items.forEach((item: IAnimal): void => {
      if (!item.isCaught) this.dodgeHerdsman(item, game);

      if (!item.isDodging) {
        if (!item.hasCollision) this.avoidCollisions(item, items);
        if (!item.hasCollision) {
          if (item.isCaught) {
            this.followHerdsman(item, game);
            this.checkYard(item, game);
          } else {
            this.roamAround(item, game);
          }
        }
      }
    });

    items.forEach((item: IAnimal): void => item.tick(params));
  }

  private dodgeHerdsman(item: IAnimal, { herdsman }: IGame): void {
    const {
      delta,
      abs: range,
      sin: sinHtoA,
      cos: cosHtoA,
    }: MotionData = Maths.distance(herdsman.point, item.point);

    const isCaught: boolean =
      this.caughtItems.size < herdsman.capacity &&
      range < item.radius + herdsman.radius;

    if (isCaught) {
      item.isCaught = true;
      this.caughtItems.add(item);
    }

    item.isDodging = range < item.alertRange && !isCaught;
    if (item.isDodging) {
      const { sin: sinH, cos: cosH }: MotionData = herdsman.info;
      const diffAngleSin: number = sinHtoA * cosH - cosHtoA * sinH;
      const moveShift: MoveParams =
        Math.abs(diffAngleSin) > dodgeConfig.angleSin
          ? { x: delta.x, y: delta.y }
          : this.getDodgeShift(range, sinH, cosH, diffAngleSin < 0); // avoid the chase

      item.moveBy({ ...moveShift, v: item.alertSpeed });
    }
  }

  private avoidCollisions(item: IAnimal, comparedItems: Set<IAnimal>): void {
    comparedItems.forEach((comparedItem: IAnimal): void => {
      if (comparedItem === item) return;

      const { delta, abs }: MotionData = Maths.distance(
        item.point,
        comparedItem.point,
      );

      const hasCollision: boolean = abs <= item.radius + comparedItem.radius;
      if (hasCollision) {
        const scale1: number = this.rndScale(10);
        item.hasCollision = true;
        item.moveBy({
          x: -delta.x * scale1,
          y: -delta.y * scale1,
          v: item.baseSpeed,
        });

        const scale2: number = this.rndScale(10);
        comparedItem.hasCollision = true;
        comparedItem.moveBy({
          x: delta.x * scale2,
          y: delta.y * scale2,
          v: item.baseSpeed,
        });
      }
    });
  }

  private followHerdsman(item: IAnimal, { herdsman }: IGame): void {
    const { delta, abs }: MotionData = Maths.distance(
      item.point,
      herdsman.point,
    );

    const hasCollision: boolean = abs <= item.radius + herdsman.radius;

    if (hasCollision) {
      item.moveBy({
        x: -delta.x,
        y: -delta.y,
        v: item.alertSpeed,
      });
    } else {
      item.moveTo({ ...herdsman.point, v: item.followSpeed });
    }
  }

  private checkYard(item: IAnimal, { yard, field }: IGame): void {
    const { abs }: MotionData = Maths.distance(item.point, yard.point);
    const hasEntered: boolean =
      item.isCaught && abs <= yard.radius - item.radius / 2;

    if (hasEntered) {
      this.caughtItems.delete(item);
      yard.addScore();
      field.removeItem(item);
    }
  }

  private roamAround(item: IAnimal, game: IGame): void {
    const isTriggered: boolean = Rnd.chance(chanceToRoam);

    if (isTriggered) {
      item.moveTo({
        ...game.field.rndPoint(),
        v: item.baseSpeed,
      });
    }
  }

  private getDodgeShift(
    range: number,
    sin: number,
    cos: number,
    isLeftTurn: boolean,
  ): MoveParams {
    const _: number = isLeftTurn ? -1 : 1;
    const shiftSin: number =
      sin * dodgeConfig.angleCos + _ * cos * dodgeConfig.angleSin;
    const shiftCos: number =
      cos * dodgeConfig.angleCos - _ * sin * dodgeConfig.angleSin;

    return { x: range * shiftCos, y: range * shiftSin };
  }

  private rndScale(maxScale: number): number {
    return Rnd.val(1, maxScale, 0.5);
  }
}

export default new FieldHelper();
