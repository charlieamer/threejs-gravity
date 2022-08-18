import {
  Color,
  Mesh,
  MeshPhongMaterial,
  Scene,
  SphereGeometry,
  Vector3,
} from 'three';
import { randFloat } from 'three/src/math/MathUtils';

export class Planet {
  position: Vector3;
  radius: number;
  mass: number;
  constructor(scene: Scene) {
    this.radius = randFloat(1, 10);
    const maxMass = 5;
    this.mass = randFloat(1, maxMass);
    this.position = new Vector3(
      randFloat(-100, 100),
      randFloat(-100, 100),
      randFloat(-100, 100),
    );
    const geometry = new SphereGeometry(this.radius);
    const massColor = this.mass * (1 / maxMass);
    const mesh = new Mesh(
      geometry,
      new MeshPhongMaterial({
        color: new Color(1 - massColor, 0.3, massColor),
      }),
    );
    mesh.position.copy(this.position);
    scene.add(mesh);
  }
}
