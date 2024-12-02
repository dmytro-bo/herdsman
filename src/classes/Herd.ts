import { IAnimal, IGame, IHerd } from "../models/interface";
import HerdHelper from "../lib/HerdHelper";
import { StepParams } from "../models/types";
import Animal from "./Animal";

export class Herd implements IHerd {
  static size: number = 10;

  items: IAnimal[] = [];

  private limit: number;

  constructor(
    count: number,
    private game: IGame,
  ) {
    this.limit = 2 * count;

    for (let i: number = 0; i < count; i++)
      this.items.push(new Animal(game.rndPos()));
  }

  syncImg(): void {
    this.items.forEach((item: IAnimal): void => item.syncImg());
  }

  step(params: StepParams): void {
    HerdHelper.processStep(this.items, this.game, params);
  }
}
