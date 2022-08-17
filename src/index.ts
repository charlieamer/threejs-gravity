import {
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
  100,
);
camera.position.set(5, 2, 4);
camera.lookAt(0, 0, 0);

// camera control
const controls = new OrbitControls(camera, canvas);

const scene = new Scene();

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

// loops updates
function loop() {
  controls.update();
  if (resizeRendererToDisplaySize(renderer)) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
// runs a continuous loop
loop();
