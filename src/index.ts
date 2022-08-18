import {
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { Planet } from './Planet';
import { Point } from './Point';

function resizeRendererToDisplaySize(renderer: WebGLRenderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

const canvas = document.getElementById('app') as HTMLCanvasElement;
const renderer = new WebGLRenderer({
  canvas,
});

// camera
const camera = new PerspectiveCamera(
  30,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000,
);
camera.position.set(200, 200, 200);
camera.lookAt(0, 0, 0);

// camera control
const controls = new FlyControls(camera, canvas);

const scene = new Scene();

// planets
const planets: Planet[] = [];
for (let i = 0; i < 50; i++) {
  planets.push(new Planet(scene));
}

// points
const points: Point[] = [];
for (let i = 0; i < 100; i++) {
  points.push(new Point(scene));
}

// light
{
  const color = 0xffffff;
  const intensity = 1;
  const light = new DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
}

// ambient light
scene.add(new AmbientLight(0x333333));

let previousTime = new Date().getTime();

// loops updates
function loop() {
  const currentTime = new Date().getTime();
  controls.update((currentTime - previousTime) * 0.03);
  previousTime = currentTime;
  if (resizeRendererToDisplaySize(renderer)) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  for (const point of points) {
    point.update(planets);
  }
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
// runs a continuous loop
loop();
