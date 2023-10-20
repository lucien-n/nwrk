export class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  distance(vector: Vector3): number {
    return Math.sqrt(this.x * vector.x + this.y * vector.y + this.z * vector.z);
  }

  substract(vector: Vector3): Vector3 {
    return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
  }

  add(vector: Vector3): Vector3 {
    return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }

  static readonly NORTH = new Vector3(0, 0, -1);
  static readonly EAST = new Vector3(1, 0, 0);
  static readonly SOUTH = new Vector3(0, 0, 1);
  static readonly WEST = new Vector3(-1, 0, 0);
  static readonly UP = new Vector3(0, 1, 0);
  static readonly DOWN = new Vector3(0, -1, 0);
}
