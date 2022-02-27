'use strict';

/**
* default
**/
let scene    = null,
    camera   = null,
    renderer = null,
    controls = null,
    tokyotower  = null,
    width    = 0,
    height   = 0;

/**
* init
**/
function init() {
  width = window.innerWidth,
  height = window.innerHeight;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(0, 160, 1500);
  renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  renderer.setPixelRatio(
    window.devicePixelRatio
  );
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  
  addLights();
  drawTokyotower();

  document.getElementById('myCanvas').appendChild(renderer.domElement);
  window.addEventListener('resize',onResize,false);
}

/**
* lights
**/
function addLights() {
  const directLight1 = new THREE.DirectionalLight(0xffffff);
  directLight1.castShadow = true;
  directLight1.position.set(0, 1, 1);
  scene.add(directLight1);
  const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
  scene.add(pointLight);
}

/**
* draw
**/
function drawTokyotower() {
  tokyotower = new Tokyotower();
  scene.add(tokyotower.group);
}

/**
* resize
**/
function onResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

/**
* degree
**/
function degree(degrees) {
  return degrees * (Math.PI / 180);
}

/**
* animate
**/
function animate() {
  requestAnimationFrame(animate);
  render();
}

/**
* render
**/
function render() {
  tokyotower.moveBody();
  renderer.render(scene, camera);
}

/**
* Tokyotower
**/
class Tokyotower {
  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(0, -150, 0);
    this.group.rotation.set(degree(0), degree(45), degree(0));
    this.wingangle = 0;
    this.bodyangle = 0;
    this.drawBody();
  }
  drawBody() {
    function Root( tga, tgb, tgc, tgd, tge, px, py, pz, rx, ry, rz, group ) {
       const branch_geometry = new THREE.TorusGeometry( tga, tgb, tgc, tgd, degree(tge) )
       const branch_material = new THREE.MeshPhongMaterial( {color: 0xf41322} );
       const branch_mesh = new THREE.Mesh( branch_geometry, branch_material );
       branch_mesh.position.set(px, py, pz);
       branch_mesh.rotation.set(degree(rx), degree(ry), degree(rz));
       group.add( branch_mesh );
    }
    Root( 600, 5, 50, 50, 40, -650, 150, 0, 0, 0, -50, this.group );
    Root( 600, 5, 50, 50, 40, 650, 150, 0, 0, 180, -50, this.group );
    Root( 600, 5, 50, 50, 40, 0, 150, -650, 0, -90, -50, this.group );
    Root( 600, 5, 50, 50, 40, 0, 150, 650, 0, 90, -50, this.group );
    Root( 600, 5, 50, 50, 30, -456, 82, 456, 0, 45, -30, this.group );
    Root( 600, 5, 50, 50, 30, -456, 82, -456, 0, -45, -30, this.group );
    Root( 600, 5, 50, 50, 30, 456, 82, 456, 0, -45, 180, this.group );
    Root( 600, 5, 50, 50, 30, 456, 82, -456, 0, 45, 180, this.group );
    Root( 600, 5, 50, 50, 30, -222, 102, 608, -5, 70, -30, this.group );
    Root( 600, 5, 50, 50, 30, -222, 102, -608, 5, -70, -30, this.group );
    Root( 600, 5, 50, 50, 30, 222, 102, 608, -5, -70, 180, this.group );
    Root( 600, 5, 50, 50, 30, 222, 102, -608, 5, 70, 180, this.group );
    Root( 600, 5, 50, 50, 30, -567, 82, 320, 5, 210, -175, this.group );
    Root( 600, 5, 50, 50, 30, -567, 82, -320, -5, -210, -175, this.group );   
    Root( 600, 5, 50, 50, 30, 567, 82, 320, 5, -210, -35, this.group );  
    Root( 600, 5, 50, 50, 30, 567, 82, -320, -5, 210, -35, this.group ); 
    Root( 120, 5, 50, 50, 180, -135, -315,  135, 135,  38, 210, this.group );
    Root( 120, 5, 50, 50, 180, 135, -315, -135, 225,  38, 150, this.group );
    Root( 120, 5, 50, 50, 180, 135, -315,  135, 135, -38, 150, this.group );
    Root( 120, 5, 50, 50, 180, -135, -315, -135, 225, -38, 210, this.group );

    function Line_red( px, py, pz, rx, ry, rz, width, color, group ) {
      const geometry = new THREE.CylinderGeometry( 5, 5, width, 5 );
      const material = new THREE.MeshPhongMaterial( {color: color} );
      const cylinder = new THREE.Mesh( geometry, material );
      cylinder.position.set(px, py, pz);
      cylinder.rotation.set(degree(rx), degree(ry), degree(rz));
      group.add( cylinder );
    }
    function Line_white( px, py, pz, rx, ry, rz, width, color, group ) {
      const geometry = new THREE.CylinderGeometry( 6, 6, width, 5 );
      const material = new THREE.MeshPhongMaterial( {color: color} );
      const cylinder = new THREE.Mesh( geometry, material );
      cylinder.position.set(px, py, pz);
      cylinder.rotation.set(degree(rx), degree(ry), degree(rz));
      group.add( cylinder );
    }
    Line_red( 0, 260, 42, -5, 0, 0, 500, 0xf41322, this.group );
    Line_red( 0, 260, -42, 5, 0, 0, 500, 0xf41322, this.group );
    Line_red( -42, 260, 0, 0, 0, -5, 500, 0xf41322, this.group );
    Line_red( 42, 260, 0, 0, 0, 5, 500, 0xf41322, this.group );
    Line_red( 21, 260, 21, -2.5, 0, 2.5, 500, 0xf41322, this.group );
    Line_red( -21, 260, -21, 2.5, 0, -2.5, 500, 0xf41322, this.group );
    Line_red( 21, 260, -21, 2.5, 0, 2.5, 500, 0xf41322, this.group );
    Line_red( -21, 260, 21, -2.5, 0, -2.5, 500, 0xf41322, this.group );
    Line_red( 175, -240,  20, 90, 0, 45, 58, 0xf41322, this.group );
    Line_red( 25, -240, 175, 90, 0, 45, 58, 0xf41322, this.group );
    Line_red( 18, -280, 212, 90, 0, 45, 50, 0xf41322, this.group );
    Line_red( 212, -280,  18, 90, 0, 45, 50, 0xf41322, this.group );
    Line_red( -175, -240, -20, 90, 0, 45, 58, 0xf41322, this.group );
    Line_red( -25, -240, -175, 90, 0, 45, 58, 0xf41322, this.group );
    Line_red( -18, -280, -212, 90, 0, 45, 50, 0xf41322, this.group );
    Line_red( -212, -280, -18, 90, 0, 45, 50, 0xf41322, this.group );
    Line_red( -175, -240,  20, 0, -45, 90, 58, 0xf41322, this.group );
    Line_red( -25, -240, 175, 0, -45, 90, 58, 0xf41322, this.group );
    Line_red( -18, -280, 212, 0, -45, 90, 50, 0xf41322, this.group );
    Line_red( -212, -280,  18, 0, -45, 90, 50, 0xf41322, this.group );
    Line_red( 175, -240, -20, 0, -45, 90, 58, 0xf41322, this.group );
    Line_red( 25, -240, -175, 0, -45, 90, 58, 0xf41322, this.group );
    Line_red( 18, -280, -212, 0, -45, 90, 50, 0xf41322, this.group );
    Line_red( 212, -280, -18, 0, -45, 90, 50, 0xf41322, this.group );
    Line_white( 0, 262, 42, -5, 0, 0, 125, 0xffffff, this.group );
    Line_white( 0, 262, -42, 5, 0, 0, 125, 0xffffff, this.group );
    Line_white( -42, 262, 0, 0, 0, -5, 125, 0xffffff, this.group );
    Line_white( 42, 262, 0, 0, 0, 5, 125, 0xffffff, this.group );
    Line_white( 21, 262, 21, -2.5, 0, 2.5, 125, 0xffffff, this.group );
    Line_white( -21, 262, -21, 2.5, 0, -2.5, 125, 0xffffff, this.group );
    Line_white( 21, 262, -21, 2.5, 0, 2.5, 125, 0xffffff, this.group );
    Line_white( -21, 262, 21, -2.5, 0, -2.5, 125, 0xffffff, this.group );
      
    function box( px, py, pz, rx, ry, rz, width, height, thickness, radius, color, group ) {
      const box_top = new THREE.CylinderGeometry(width, height, thickness, radius);
      const box_top_material = new THREE.MeshPhongMaterial({color: color});
      const box_top_mesh = new THREE.Mesh(box_top, box_top_material);
      box_top_mesh.position.set(px, py, pz);
      box_top_mesh.rotation.set(degree(rx), degree(ry), degree(rz));
      group.add(box_top_mesh);
    }
    box(0, 680, 0, 0, 0, 0, 2, 2, 100,  100, 0xf41322, this.group);
    box(0, 570, 0, 0, 0, 0, 7, 20, 170, 100, 0xf41322, this.group);
    box(0, 610, 0, 0, 0, 0, 10, 14, 55, 100, 0xffffff, this.group);
    box(0, 520, 0, 0, 0, 0, 35, 35, 20, 100, 0xf41322, this.group);
    box(0, 490, 0, 0, 0, 0, 35, 35, 40, 100, 0xffffff, this.group);
    box(0, 70, 0, 0, 20, 0, 80, 80, 50, 8,   0xffffff, this.group);
    box(0, 70, 0, 0, 20, 0, 82, 82, 40, 8,   0x230084, this.group);

    function square(px, py, pz, rx, ry, rz, width, height, thickness, radius, color, group) {
      const geometry = new THREE.TorusGeometry( width, height, thickness, radius );
      const material = new THREE.MeshPhongMaterial( { color: color } );
      const torus = new THREE.Mesh( geometry, material );
      torus.position.set(px, py, pz);
      torus.rotation.set(degree(rx), degree(ry), degree(rz));  
      group.add( torus );
    }
    square(0, 440, 0, 90, 0, 0, 25, 5, 16, 4, 0xf41322, this.group);
    square(0, 400, 0, 90, 0, 0, 29, 5, 16, 4, 0xf41322, this.group);
    square(0, 360, 0, 90, 0, 0, 32, 5, 16, 4, 0xf41322, this.group);
    square(0, 320, 0, 90, 0, 0, 36, 5, 16, 4, 0xffffff, this.group);
    square(0, 280, 0, 90, 0, 0, 39, 5, 16, 4, 0xffffff, this.group);
    square(0, 240, 0, 90, 0, 0, 43, 5, 16, 4, 0xffffff, this.group);
    square(0, 200, 0, 90, 0, 0, 45, 5, 16, 4, 0xffffff, this.group);
    square(0, 160, 0, 90, 0, 0, 50, 5, 16, 4, 0xf41322, this.group);
    square(0, 120, 0, 90, 0, 0, 53, 5, 16, 4, 0xf41322, this.group);
    square(0, 0, 0, 90, 0, 0, 69, 5, 16, 4, 0xf41322, this.group);
    square(0, -40, 0, 90, 0, 0, 80, 5, 16, 4, 0xf41322, this.group);
    square(0, -80, 0, 90, 0, 0, 93, 5, 16, 4, 0xf41322, this.group);
    square(0,-120, 0, 90, 0, 0, 113, 5, 16, 4, 0xf41322, this.group);
    square(0,-160, 0, 90, 0, 0, 134, 5, 16, 4, 0xf41322, this.group);
    square(0,-200, 0, 90, 0, 0, 162, 5, 16, 4, 0xf41322, this.group);

    function floor(px,py,pz,rx,ry,rz,width,height,thickness,radius,color,group) {
      const floor = new THREE.CylinderGeometry(width, height, thickness, radius);
      const floor_material = new THREE.MeshPhongMaterial({color: color});
      const floor_mesh = new THREE.Mesh(floor, floor_material);
      floor_mesh.position.set(px, py, pz);
      floor_mesh.rotation.set(degree(rx), degree(ry), degree(rz));
      group.add(floor_mesh);
    }
    floor(0,100,0,0,0,0,20,20,750,4,0x50232C,this.group);
    floor(0,-290,0,0,0,0,200,200,40,4,0x50232C,this.group);
    floor(0,-320,0,0,0,0,350,350,20,4,0xf41322,this.group);
  }
  moveBody() {
    const bodyamplitude = 30;
    this.group.rotation.y += 0.025;
  }  
}

init();
animate();
