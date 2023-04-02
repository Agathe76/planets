import { Injectable } from "@angular/core";
import * as THREE from "three";

export interface PlanetAndObject {
    planet: THREE.Mesh,
    object: THREE.Object3D, // obj for rotation arround the sun
};

@Injectable({
    providedIn: 'root',
})
export class PlanetService {
  
    private loader = new THREE.TextureLoader();

    constructor() {}
  
    public getSun(): THREE.Mesh {
        let sunGeometry = new THREE.SphereGeometry(15, 32, 16);
        let sunMaterial = new THREE.MeshBasicMaterial( {
            map: this.loader.load('/../../../assets/images/sun_texture.png')
        });
      
        return new THREE.Mesh(sunGeometry, sunMaterial);
    }

    public createPlanetAndObject(radius: number, texture: string): PlanetAndObject {
        const earthGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(radius, 30, 30);
        const earthMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial( {
            map: this.loader.load(texture)
        });
        let planetObject: THREE.Object3D = new THREE.Object3D();
        let planet: THREE.Mesh = new THREE.Mesh(earthGeometry, earthMaterial);
        planetObject.add(planet);

        return {
            planet: planet,
            object: planetObject,
        };
    }

    public createSunAndObject(radius: number, texture: string): PlanetAndObject {
        const earthGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(radius, 30, 30);
        const earthMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial( {
            map: this.loader.load(texture)
        });
        let planetObject: THREE.Object3D = new THREE.Object3D();
        let planet: THREE.Mesh = new THREE.Mesh(earthGeometry, earthMaterial);
        planetObject.add(planet);

        return {
            planet: planet,
            object: planetObject,
        };
    }

}
