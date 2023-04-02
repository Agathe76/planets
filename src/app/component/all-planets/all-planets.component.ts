import { AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import * as THREE from "three";
import { Router } from "@angular/router";
import { PlanetAndObject, PlanetService } from "src/app/service/planet.service";

const skyColor = new THREE.Color(0x010101);

@Component({
    selector: 'app-all-planets',
    templateUrl: './all-planets.component.html',
    styleUrls: ['./all-planets.component.scss']
})
export class AllPlanetsComponent implements AfterViewInit {

    @ViewChild('canvas') private canvasRef: ElementRef;

    // stage properties
  
    @Input() public fieldOfView: number = 1;
  
    @Input('nearClipping') public nearClippingPane: number = 1;
  
    @Input('farClipping') public farClippingPane: number = 10000;
  
    // scene properties
    private camera: THREE.PerspectiveCamera;
    private controls: OrbitControls;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
  
    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }
  
    // planets 
    private distanceEarthSun: number = 33;
    private distanceMarsSun: number = 25;
    private sun: PlanetAndObject;
    private earth: PlanetAndObject;
    private mars: PlanetAndObject;
  
    public constructor(private readonly router: Router, private readonly planetService: PlanetService) {
        this.sun = this.planetService.createSunAndObject(16, '/../../../assets/images/sun_texture.png');
        this.earth = this.planetService.createPlanetAndObject(3, '/../../../assets/images/texture_bleue.png');
        this.mars = this.planetService.createPlanetAndObject(2, '/../../../assets/images/texture_verte.png');
        
        this.earth.planet.position.x = this.distanceEarthSun;
        this.mars.planet.position.x = this.distanceMarsSun;
    }
  
    public ngAfterViewInit(): void {
        this.createScene();
        this.startRenderingLoop();
        this.createControls();
    }

    public selectPlanet(): void {
        this.router.navigate(['one-planet']);
    }

    private animateModel(): void {
        this.sun.planet.rotateY(0.01);
        this.earth.planet.rotateY(0.005);
        this.earth.object.rotateY(0.04);
        this.mars.planet.rotateY(0.008);
        this.mars.object.rotateY(0.06);
    }
  
    private createControls(): void {
        const renderer = new CSS2DRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0px';
        document.body.appendChild(renderer.domElement);
        this.controls = new OrbitControls(this.camera, renderer.domElement);
        this.controls.autoRotate = true;
        this.controls.enableZoom = true;
        this.controls.enablePan = false;
        this.controls.maxDistance = this.farClippingPane - this.distanceEarthSun;
        this.controls.update();
    };
  
    private createScene(): void {
        // build sun
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(skyColor);

        // config camera
        let aspectRatio = this.getAspectRatio();
        this.camera = new THREE.PerspectiveCamera(
            this.fieldOfView,
            aspectRatio,
            this.nearClippingPane,
            this.farClippingPane
        );
        this.camera.position.x = 100;
        this.camera.position.y = 200;
        this.camera.position.z = 10000;

        // add lights
        const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0x333333);
        const pointLight: THREE.PointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
        
        // add elements to the scene in order
        this.scene.add(this.sun.planet);
        this.scene.add(this.earth.object);
        this.scene.add(this.mars.object);
        this.scene.add(ambientLight);
        this.scene.add(pointLight);
    }
  
    private getAspectRatio(): number {
        return this.canvas.clientWidth / this.canvas.clientHeight;
    }
  
    private startRenderingLoop(): void {
        // renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        let component: AllPlanetsComponent = this;
        
        (function render() {
            component.renderer.render(component.scene, component.camera);
            component.animateModel();
            requestAnimationFrame(render);
        }());
    }
}
