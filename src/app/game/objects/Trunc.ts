import * as THREE from 'three';
import { blackMat, brownMat, whiteMat, lightBrownMat, pinkMat, greenMat } from './Constants';

export class Trunc {

  private mesh: any; // = new THREE.Mesh(geom, matTrunc)


  constructor() {
    this.create();
  }

  private create() {
    const truncHeight = 50 + Math.random() * 150;
    const topRadius = 1 + Math.random() * 5;
    const bottomRadius = 5 + Math.random() * 5;
    const mats = [blackMat, brownMat, pinkMat, whiteMat, greenMat, lightBrownMat, pinkMat];
    const matTrunc = blackMat;//mats[Math.floor(Math.random()*mats.length)];
    const nhSegments = 3;//Math.ceil(2 + Math.random()*6);
    const nvSegments = 3;//Math.ceil(2 + Math.random()*6);
    const geom = new THREE.CylinderGeometry(topRadius, bottomRadius, truncHeight, nhSegments, nvSegments);
    geom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, truncHeight / 2, 0));

    this.mesh = new THREE.Mesh(geom, matTrunc);
    const v = new THREE.Vector3();

    const positionAttribute = geom.getAttribute('position');
    for (let i = 0; i < positionAttribute.count; i ++) {
      v.fromBufferAttribute(positionAttribute, i);

      const noise = Math.random();

      v.x += -noise + Math.random() * noise * 2;
      v.y += -noise + Math.random() * noise * 2;
      v.z += -noise + Math.random() * noise * 2;

      geom.computeVertexNormals();

      // FRUITS

      if (Math.random() > .7) {
        const size = Math.random() * 3;
        const fruitGeometry = new THREE.BoxGeometry(size, size, size, 1);
        const matFruit = mats[Math.floor(Math.random() * mats.length)];
        const fruit = new THREE.Mesh(fruitGeometry, matFruit);
        fruit.position.x = v.x;
        fruit.position.y = v.y + 3;
        fruit.position.z = v.z;
        fruit.rotation.x = Math.random() * Math.PI;
        fruit.rotation.y = Math.random() * Math.PI;

        this.mesh.add(fruit);
      }

      // BRANCHES

      if (Math.random() > .5 && v.y > 10 && v.y < truncHeight - 10) {
        const h = 3 + Math.random() * 5;
        const thickness = .2 + Math.random();

        const branchGeometry = new THREE.CylinderGeometry(thickness / 2, thickness, h, 3, 1);
        branchGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, h / 2, 0));
        const branch = new THREE.Mesh(branchGeometry, matTrunc);
        branch.position.x = v.x;
        branch.position.y = v.y;
        branch.position.z = v.z;

        const vec = new THREE.Vector3(v.x, 2, v.z);
        const axis = new THREE.Vector3(0, 1, 0);
        branch.quaternion.setFromUnitVectors(axis, vec.clone().normalize());


        this.mesh.add(branch);
      }
    }
    this.mesh.castShadow = true;
  }
}
