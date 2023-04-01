import { Injectable } from "@angular/core";
import * as THREE from "three";

@Injectable({
    providedIn: 'root',
})
export class PlanetService {
  
    private loader = new THREE.TextureLoader();

    constructor() {}
  
    public getSun(): THREE.Mesh {
        let sunGeometry = new THREE.SphereGeometry( 15, 32, 16 );
        let sunMaterial = new THREE.MeshBasicMaterial( {
            map: this.loader.load('/../../../assets/images/sun_texture.png')
        });
      
        return new THREE.Mesh(sunGeometry, sunMaterial);
    }

    public getEarth(): THREE.Mesh {
        let earthGeometry = new THREE.SphereGeometry( 3, 30, 30 );
        let earthMaterial = new THREE.MeshBasicMaterial( {
            map: this.loader.load('/../../../assets/images/texture_bleue.png')
        });
      
        return new THREE.Mesh(earthGeometry, earthMaterial);
    }

}
