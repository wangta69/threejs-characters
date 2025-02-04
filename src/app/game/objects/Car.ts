
import * as THREE from 'three';


export class Car {

  public angle = 0;
  public mesh = new THREE.Group();

  constructor() {
    this.create();
  }

  private create() {
  
    this.mesh = new THREE.Group();

    const backWheel = this.createWheels();
    backWheel.position.y = 6;
    backWheel.position.x = -18;
    this.mesh.add(backWheel);
  
    const frontWheel = backWheel.clone();
    frontWheel.position.y = 6;
    frontWheel.position.x = 18;
    this.mesh.add(frontWheel);
  
    const main = new THREE.Mesh(
      // new THREE.BoxBufferGeometry(60, 15, 30),
      new THREE.BoxGeometry(60, 15, 30),
      new THREE.MeshLambertMaterial({ color: 0xa52523 })
    );
    main.position.y = 12;
    this.mesh.add(main);
  
    const carFrontTexture = this.getCarFrontTexture();
  
    const carBackTexture = this.getCarFrontTexture();
  
    const carRightSideTexture = this.getCarSideTexture();
  
    const carLeftSideTexture = this.getCarSideTexture();
    carLeftSideTexture.center = new THREE.Vector2(0.5, 0.5);
    carLeftSideTexture.rotation = Math.PI;
    carLeftSideTexture.flipY = false;
  
    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(33, 12, 24), 
      // new THREE.BoxBufferGeometry(33, 12, 24), 
      [
        new THREE.MeshLambertMaterial({ map: carFrontTexture }), // front
      new THREE.MeshLambertMaterial({ map: carBackTexture }), // back
      new THREE.MeshLambertMaterial({ color: 0xffffff }), // top
      new THREE.MeshLambertMaterial({ color: 0xffffff }), // bottom
      new THREE.MeshLambertMaterial({ map: carRightSideTexture }), // left
      new THREE.MeshLambertMaterial({ map: carLeftSideTexture }) // right

    ]);
    cabin.position.x = -6;
    cabin.position.y = 25.5;
    this.mesh.add(cabin);
  
    // return car;
  }

  private createWheels() {
    // const geometry = new THREE.BoxBufferGeometry(12, 12, 33);
    const geometry = new THREE.BoxGeometry(12, 12, 33);
    const material = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const wheel = new THREE.Mesh(geometry, material);
    return wheel;
  }
  
  private getCarFrontTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context: any = canvas.getContext("2d");
  
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 64, 32);
  
    context.fillStyle = "#666666";
    context.fillRect(8, 8, 48, 24);
  
    return new THREE.CanvasTexture(canvas);
  }
  
  private getCarSideTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;
    const context: any = canvas.getContext("2d");
  
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 128, 32);
  
    context.fillStyle = "#666666";
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);
  
    return new THREE.CanvasTexture(canvas);
  }
}
