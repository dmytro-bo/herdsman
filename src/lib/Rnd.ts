import Maths from "./Maths";

function random(): number {
  return Math.random();
}

class Rnd {
  /**
   *  Return random number within the provided range with provided precision/step.
   *      rnd(1, 3) returns 1, 2, 3
   *  When called without arguments returns 0 or 1.
   *  Precision and direction has precedence over specified limits.
   *  If range doesn't fit the integer count of steps, the 'to' limit will be adjusted:
   *      rnd(1, 3, 0.3) returns 1, 1.3, 1.6, 1.9, 2.2, 2.5, 2.8
   *      rnd(3, 1, 0.3) returns 3, 2.7, 2.4, 2.1, 1.8, 1.5, 1.2
   *
   *  Providing negative precision/steps excludes the limit values from random range:
   *      rnd(-3, 3, -1) returns -2, -1, 0, 1 or 2
   *
   * @param from lower limit of random value range (default 0)
   * @param to upper limit of random value range (default 1)
   * @param E precision/step for generated random value (default 1)
   */

  val(from: number = 0, to: number = 1, E: number = 1): number {
    const count: number = Math.floor(Math.abs(from - to) / E);
    const value: number = Math.floor(random() * (count + 1)) * E;

    return Maths.round(
      from > to ? from - value : from + value,
      Maths.fractionLength(E),
    );
  }

  of<T>(items: Array<T>): T | undefined {
    const index: number = this.val(0, items?.length - 1);
    return items?.[index];
  }

  chance(percentage: number): boolean {
    const E: number = 10 ** Maths.fractionLength(percentage);
    return this.val(0, 100 * E) < percentage * E;
  }
}

export default new Rnd();
