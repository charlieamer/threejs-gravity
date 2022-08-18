import {
  BufferGeometry,
  Float32BufferAttribute,
  Line,
  LineBasicMaterial,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
} from 'three';
import { randFloat } from 'three/src/math/MathUtils';
import { Planet } from './Planet';

const TRAIL_LENGTH = 100;

export class Point {
  private geometry = new BufferGeometry();
  private trailGeometry = new BufferGeometry();
  private trailBuffer = new Float32BufferAttribute(
    new Array(TRAIL_LENGTH * 3),
    3,
  );
  private trail: number[] = [];
  private position = new Vector3();
  private positionBuffer = new Float32BufferAttribute([0, 0, 0], 3);
  private velocity = new Vector3();
  constructor(scene: Scene) {
    this.updatePositionToGeometry();
    const points = new Points(
      this.geometry,
      new PointsMaterial({
        color: 0xffffff,
        size: 1,
      }),
    );
    points.frustumCulled = false;
    scene.add(points);
    const lines = new Line(
      this.trailGeometry,
      new LineBasicMaterial({
        color: 0x3355aa,
        opacity: 0.3,
        transparent: true,
      }),
    );
    lines.frustumCulled = false;
    scene.add(lines);
    this.geometry.setAttribute('position', this.positionBuffer);
    this.trailGeometry.setAttribute('position', this.trailBuffer);
    this.reset();
  }
  private reset(): void {
    const maxSpeed = 0.3;
    this.velocity.set(
      randFloat(-maxSpeed, maxSpeed),
      randFloat(-maxSpeed, maxSpeed),
      randFloat(-maxSpeed, maxSpeed),
    );
    this.position.set(0, 0, 0);
    this.trail.fill(0);
  }
  private updatePositionToGeometry(): void {
    this.positionBuffer.set(this.position.toArray()).needsUpdate = true;
    this.trailBuffer.set(this.trail).needsUpdate = true;
  }
  update(planets: Planet[]): void {
    let shouldReset = false;
    for (const planet of planets) {
      const dir = planet.position.clone().sub(this.position);
      const distSq = dir.lengthSq();
      if (distSq < planet.radius * planet.radius) {
        shouldReset = true;
      }
      dir.setLength((planet.mass / distSq) * 1);
      this.velocity.add(dir);
    }
    this.position.add(this.velocity);
    if (
      this.position.x < -100 ||
      this.position.x > 100 ||
      this.position.y < -100 ||
      this.position.y > 100 ||
      this.position.z < -100 ||
      this.position.z > 100
    ) {
      shouldReset = true;
    }
    this.trail.push(...this.position.toArray());
    if (this.trail.length > TRAIL_LENGTH * 3) {
      this.trail.splice(0, 3);
    }
    if (shouldReset) {
      this.reset();
    }
    this.updatePositionToGeometry();
  }
}
