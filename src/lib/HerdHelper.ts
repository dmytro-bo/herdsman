import { IAnimal, IGame } from "../models/interface";
import Maths from "./Maths";
import Rnd from "./Rnd";
import { MotionData, MoveParams, StepParams } from "../models/types";

const chanceToRoam: number = 1;
const dodgeConfig = {
  scanAngleSin: Math.sin(Math.PI / 4),
  angleSin: Math.sin(Math.PI / 3),
  angleCos: Math.cos(Math.PI / 3),
};

class HerdHelper {
  caughtItems: Set<IAnimal> = new Set();

  processStep(items: IAnimal[], game: IGame, params: StepParams): void {
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

    items.forEach((item: IAnimal): void => {
      item.step(params);
    });
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
      range < item.size + herdsman.size;

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
          : this.getDodgeShift(range, sinH, cosH, diffAngleSin < 0); //  avoid the chase

      item.moveBy({ ...moveShift, v: item.alertVelocity });
    }
  }

  private avoidCollisions(item: IAnimal, comparedItems: IAnimal[]): void {
    comparedItems.forEach((comparedItem: IAnimal): void => {
      if (comparedItem === item) return;

      const { delta, abs }: MotionData = Maths.distance(
        item.point,
        comparedItem.point,
      );

      const hasCollision: boolean = abs <= item.size + comparedItem.size;
      if (hasCollision) {
        const scale1: number = this.rndScale(10);
        item.hasCollision = true;
        item.moveBy({
          x: -delta.x * scale1,
          y: -delta.y * scale1,
          v: item.velocity,
        });

        const scale2: number = this.rndScale(10);
        comparedItem.hasCollision = true;
        comparedItem.moveBy({
          x: delta.x * scale2,
          y: delta.y * scale2,
          v: item.velocity,
        });
      }
    });
  }

  private followHerdsman(item: IAnimal, { herdsman }: IGame): void {
    const { delta, abs }: MotionData = Maths.distance(
      item.point,
      herdsman.point,
    );

    const hasCollision: boolean = abs <= item.size + herdsman.size;

    if (hasCollision) {
      item.moveBy({
        x: -delta.x,
        y: -delta.y,
        v: item.alertVelocity,
      });
    } else {
      item.moveTo({ ...herdsman.point, v: item.followVelocity });
    }
  }

  private checkYard(item: IAnimal, { yard }: IGame): void {
    const { abs }: MotionData = Maths.distance(item.point, yard.point);
    const hasEntered: boolean = abs <= yard.size - item.size;
  }

  private roamAround(item: IAnimal, game: IGame): void {
    const isTriggered: boolean = Rnd.chance(chanceToRoam);

    if (isTriggered) {
      item.moveTo({
        ...game.rndPos(),
        v: item.velocity,
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

export default new HerdHelper();
