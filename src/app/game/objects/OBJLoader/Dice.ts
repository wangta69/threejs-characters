
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';

export class Dice {

  public diceObject: any;
  constructor() {
  }

  public create(){
    return new Promise((resolve, reject) => {
    
      const mtlLoader = new MTLLoader();

      const objUrl = '/assets/object/dice/';
      mtlLoader.setPath(objUrl);
      mtlLoader.load('dice.mtl', (materials: any) => {
        materials.preload();
        // const objLoader: any = new (this.THREE as any).OBJLoader();
        const objLoader: any = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(objUrl);
        console.log('before objloader.load');
        objLoader.load('dice.obj', (object: any) => {
          object.scale.set (50, 50, 50);
          object.position.set (0, 50, 0);
          this.diceObject = object;
          resolve(object);
        }, this.onProgressObjLoader, this.onErrorObjLoader);

      }, this.onProgress, this.onError);
    });
  }

  private onProgress(e: any): void {
    console.log('onProgress>>', e);
  }

  private onError(e: any): void {
    console.error(e);
  }

  private onProgressObjLoader(e: any): void {
    console.log('onProgressObjLoader>>', e);
  }

  private onErrorObjLoader(e: any): void {
    console.error(e);
  }

  private unitize(object: any, targetSize: number): any  {
    // find bounding box of 'object'
    // const box3 = new THREE.Box3();
    // box3.setFromObject(object);
    // const size = new THREE.Vector3();
    // size.subVectors (box3.max, box3.min);
    // // const center = new THREE.Vector3();
    // // center.addVectors(box3.max, box3.min).multiplyScalar (1);

    // // uniform scaling according to objSize
    // const objSize = Math.max (size.x, size.y, size.z);
    // const scaleSet = targetSize / objSize;


    

  }
/*
  private unitize(object: any, targetSize: number): any  {
    // find bounding box of 'object'
    const box3 = new THREE.Box3();
    box3.setFromObject(object);
    const size = new THREE.Vector3();
    size.subVectors (box3.max, box3.min);
    const center = new THREE.Vector3();
    center.addVectors(box3.max, box3.min).multiplyScalar (1);

    // uniform scaling according to objSize
    const objSize = Math.max (size.x, size.y, size.z);
    const scaleSet = targetSize / objSize;

    const theObject =  new THREE.Object3D();
    theObject.add (object);
    object.scale.set (scaleSet, scaleSet, scaleSet);
    object.position.set (0, 0, 0);
    return theObject;
  }
  */
}
