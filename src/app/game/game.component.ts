import { Component,OnInit,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import * as GSAP from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Hero } from './objects/Hero';
import { Monster } from './objects/Monster';
import { Tree } from './objects/Tree';
import { Hedgehog } from './objects/Hedgehog';
import { Carrot } from './objects/Carrot';
import { Car as Car1 } from './objects/Car';
import { Dice } from './objects/OBJLoader/Dice';
import { Car } from './objects/OBJLoader/Car';
import { Cottage } from './objects/OBJLoader/Cottage';
import { BonusParticles } from './objects/BonusParticles';

@Component({
  selector: 'app-root',
  templateUrl: './game.html',
  styleUrl: './game.scss'
})
export class GameComponent implements OnInit, AfterViewInit{
  @ViewChild('domContainer', {
    static: true
  }) domContainer!: ElementRef < HTMLDivElement > ;

  //THREEJS RELATED VARIABLES 

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  private fieldOfView: any;
  private aspectRatio: any;
  private nearPlane: any;
  private farPlane: any;
  private gobalLight: any;
  private shadowLight: any;
  private backLight: any;
  
  private container: any;
  private controls: any;
  private clock: any;
  private delta = 0;
  private floorRadius = 200;
  private speed = 6;
  private distance = 0;
  private level = 1;
  private levelInterval: any;
  private levelUpdateFreq = 3000;
  private initSpeed = 5;
  private maxSpeed = 48;

  private monster: any;
  private monsterPos = .65;
  private monsterPosTarget = .65;
  private floorRotation = 0;
  private collisionObstacle = 10;
  private collisionBonus = 20;
  private gameStatus = "play";
  private cameraPosGame = 160;
  // private cameraPosGameOver = 260;
  private monsterAcceleration = 0.004;
  private malusClearColor = 0xb44b39;
  private malusClearAlpha = 0;
  // private audio = new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/264161/Antonio-Vivaldi-Summer_01.mp3');

  private carrot: any;
  private obstacle: any;
  private floor: any; //new THREE.Group();
  private fieldGameOver: any;
  private fieldDistance: any;
  private bonusParticles: any;

  
  private dice: any;
  private car1: any;
  
  //SCREEN & MOUSE VARIABLES
  private HEIGHT!: number;
  private WIDTH!: number;
  private windowHalfX: any;
  private windowHalfY: any;
  private mousePos = {
    x: 0,
    y: 0
  };

  //3D OBJECTS VARIABLES

  private hero: any;

  constructor(
  ) { 
  }

  ngOnInit() {

  }
  ngAfterViewInit() {
    this.initScreenAnd3D();
    this.createLights();
    this.createFloor()
    // this.createHero();
    // this.createMonster();
    // this.createFirs();
    // this.createCarrot();
    // this.createCar1();
    // this.createDice();
    // this.createCar();
    this.createCottage();
    // this.createBonusParticles();
    // this.createObstacle();
    // this.initUI();
    // this.resetGame();
    this.loop();
  }

  private initScreenAnd3D() {
    // this.HEIGHT = window.innerHeight;
    // this.WIDTH = window.innerWidth;
    this.WIDTH = this.domContainer.nativeElement.offsetWidth;
    this.HEIGHT = this.domContainer.nativeElement.offsetHeight;

    this.windowHalfX = this.WIDTH / 2;
    this.windowHalfY = this.HEIGHT / 2;

    this.scene = new THREE.Scene();
    // this.scene.fog = new THREE.Fog(0xd6eae6, 160, 350);

    // 카메라 환경설정
    this.aspectRatio = this.WIDTH / this.HEIGHT;
    this.fieldOfView = 50;
    this.nearPlane = 1;
    this.farPlane = 2000;
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      this.aspectRatio,
      this.nearPlane,
      this.farPlane
    );
    this.camera.position.x = 0;
    this.camera.position.z = this.cameraPosGame;
    this.camera.position.y = 30;
    this.camera.lookAt(new THREE.Vector3(0, 30, 0));

    // var helper = new THREE.CameraHelper(dirLight.shadow.camera);
    var helper = new THREE.CameraHelper(this.camera);
    this.scene.add(helper);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(this.malusClearColor, this.malusClearAlpha);

    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.renderer.shadowMap.enabled = true;


    this.domContainer.nativeElement.appendChild(this.renderer.domElement);

    window.addEventListener('resize', this.handleWindowResize.bind(this), false);
    document.addEventListener('mousedown', this.handleMouseDown.bind(this), false);
    document.addEventListener("touchend", this.handleMouseDown.bind(this), false);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.minPolarAngle = -Math.PI / 2; 
    controls.maxPolarAngle = Math.PI / 2;
    controls.autoRotate = true;
    // controls.noZoom = true;
    // controls.noPan = true;

    // this.controls.noPan = true;

    this.clock = new THREE.Clock();
  }

  private createLights() {
    const globalLight = new THREE.AmbientLight(0xffffff, .9);

    const shadowLight = new THREE.DirectionalLight(0xffffff, 1);
    shadowLight.position.set(-30, 40, 20);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 2000;
    shadowLight.shadow.mapSize.width = shadowLight.shadow.mapSize.height = 2048;

    this.scene.add(globalLight);
    this.scene.add(shadowLight);
  }
  private createFloor() {
    const floorShadow = new THREE.Mesh(new THREE.SphereGeometry(this.floorRadius, 50, 50), new THREE.MeshPhongMaterial({
      color: 0x7abf8e,
      specular: 0x000000,
      shininess: 1,
      transparent: true,
      opacity: .5
    }));
    //floorShadow.rotation.x = -Math.PI / 2;
    floorShadow.receiveShadow = true;

    const floorGrass = new THREE.Mesh(new THREE.SphereGeometry(this.floorRadius - .5, 50, 50), new THREE.MeshBasicMaterial({
        color: 0x7abf8e
    }));
    //floor.rotation.x = -Math.PI / 2;
    floorGrass.receiveShadow = false;

    this.floor = new THREE.Group();

  }

  private createCar1() {
    this.car1 = new Car1();
    // console.log('car:', this.car1 );
    // this.car1.mesh.position.x = 100;
    // this.car1.mesh.position.y = 100;
    console.log('this.car1.mesh:', this.car1.mesh)
    this.scene.add(this.car1.mesh);
  }

  /*
  private createCarrot() {
    this.carrot = new Carrot();
    this.scene.add(this.carrot.mesh);
  }
    */
  
  private async createDice() {
    this.dice = new Dice();
    const dice = await this.dice.create();
    console.log('dice:', dice);
    this.scene.add(dice);

    
  }

  private async createCar() {
    const carObj = new Car();
    const car: any = await carObj.create();

    this.scene.add(car.children[3]);
  }

  private async createCottage() {
    const obj = new Cottage();
    const cottage: any = await obj.create();
    this.scene.add(cottage);
  }

  private createHero() {
    this.hero = new Hero(this);
    this.hero.mesh.rotation.y = Math.PI / 2;
    this.scene.add(this.hero.mesh);
    this.hero.nod();
  }

  private createMonster() {
    this.monster = new Monster(this);
    this.monster.mesh.position.z = 20;
    //monster.mesh.scale.set(1.2,1.2,1.2);
    this.scene.add(this.monster.mesh);

    this.monster.mesh.position.y = 10
    this.monster.mesh.position.x = -90;
    // console.log(Math.cos(angle) * (this.floorRadius + 15));
    this.monster.mesh.rotation.z =0.5
    this.monster.mesh.rotation.x =0.5
    // this.updateMonsterPosition();
  }


  private createFirs() {
    const nTrees = 100;
    for (let i = 0; i < nTrees; i++) {
      const phi = i * (Math.PI * 2) / nTrees;
      let theta = Math.PI / 2;
      //theta += .25 + Math.random()*.3; 
      theta += (Math.random() > .05) ? .25 + Math.random() * .3 : - .35 - Math.random() * .1;

      const fir = new Tree();
      fir.mesh.position.x = 10;
      fir.mesh.position.y = -90;
      fir.mesh.position.z = 0.5;

      const vec = fir.mesh.position.clone();
      const axis = new THREE.Vector3(0, 1, 0);
      fir.mesh.quaternion.setFromUnitVectors(axis, vec.clone().normalize());
      this.floor.add(fir.mesh);
    }
  }
  private createCarrot() {
    this.carrot = new Carrot();
    this.scene.add(this.carrot.mesh);
  }
  private createBonusParticles() {
    this.bonusParticles = new BonusParticles();
    this.bonusParticles.mesh.visible = false;
    this.scene.add(this.bonusParticles.mesh);
  }
  private createObstacle() {
    this.obstacle = new Hedgehog();
    this.obstacle.body.rotation.y = 70;
    this.obstacle.mesh.scale.set(1.1, 1.1, 1.1);
    this.obstacle.mesh.position.y = 10;
    this.obstacle.mesh.position.x = 100;
    this.obstacle.nod();
    this.scene.add(this.obstacle.mesh);
  }
  // private initUI() {
  //   this.fieldDistance = document.getElementById("distValue");
  //   this.fieldGameOver = document.getElementById("gameoverInstructions");
  // }

  private loop = () => {  
    this.delta = this.clock.getDelta();
    // console.log('this.delta >>>>>', this.delta);
    // this.updateFloorRotation();
    // console.log(this.gameStatus, this.hero.status);
    // if (this.gameStatus == "play") {

      // if (this.hero.status == "running") {
      //   this.hero.run();
      //   this.monster.run();
      // }

      // this.car1.mesh.rotation.y -= 0.007;

      // this.carrot.mesh.rotation.y += this.delta * 6;


      // this.updateDistance();
      // this.updateMonsterPosition();
      // this.updateCarrotPosition();
      // this.updateObstaclePosition();
      // this.checkCollision();
    // }

    this.render();
    requestAnimationFrame(this.loop);
  }


  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  private handleWindowResize() {
    this.HEIGHT = window.innerHeight;
    this.WIDTH = window.innerWidth;
    this.windowHalfX = this.WIDTH / 2;
    this.windowHalfY = this.HEIGHT / 2;

    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.camera.aspect = this.WIDTH / this.HEIGHT;
    this.camera.updateProjectionMatrix();
  }
  
  private handleMouseDown(event:any) {
  
  }




  

}


/*





Fir = function () {
    const height = 200;
    const truncGeom = new THREE.CylinderGeometry(2, 2, height, 6, 1);
    truncGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, height / 2, 0));
    this.mesh = new THREE.Mesh(truncGeom, greenMat);
    this.mesh.castShadow = true;
}

const firs = new THREE.Group();


























window.addEventListener('load', init, false);






////////////////////////////////////////////////
//                                        MODELS
////////////////////////////////////////////////





*/
