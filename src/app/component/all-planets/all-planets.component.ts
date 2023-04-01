import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import * as THREE from "three";
import { Router } from "@angular/router";
import { PlanetService } from "src/app/service/planet.service";

const skyColor = new THREE.Color(0x231F70);

@Component({
    selector: 'app-all-planets',
    templateUrl: './all-planets.component.html',
    styleUrls: ['./all-planets.component.scss']
})
export class AllPlanetsComponent {

    @ViewChild('canvas') private canvasRef: ElementRef;

    // stage properties
  
    @Input() public fieldOfView: number = 1;
  
    @Input('nearClipping') public nearClippingPane: number = 1;
  
    @Input('farClipping') public farClippingPane: number = 10000;
  
    // scene properties
    private camera: THREE.PerspectiveCamera;
    private controls: OrbitControls;
    private ambientLight: THREE.AmbientLight;
    private light1: THREE.PointLight;
    private directionalLight: THREE.DirectionalLight;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
  
    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }
  
    // planets 
    private distanceEarthSun: number = 30;
    private sun: THREE.Mesh;
    private earth: THREE.Mesh;
  
    constructor(private readonly router: Router, private readonly planetService: PlanetService) {
        this.sun = this.planetService.getSun();
        this.earth = this.planetService.getEarth();

        this.sun.add(this.earth);
        this.earth.position.x = this.distanceEarthSun;
    }

    ngOnInit(): void {
    }
  
    ngAfterViewInit(): void {
        this.createScene();
        this.startRenderingLoop();
        this.createControls();
    }

    public selectPlanet(): void {
        this.router.navigate(['one-planet']);
    }

    private animateModel(): void {
        this.sun.rotateY(0.01);
        this.earth.rotateY(0.005);
    }
  
    private createControls = (): void => {
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
        this.scene.add(this.sun);

        // config camera
        let aspectRatio = this.getAspectRatio();
        this.camera = new THREE.PerspectiveCamera(
            this.fieldOfView,
            aspectRatio,
            this.nearClippingPane,
            this.farClippingPane
        );
        this.camera.position.x = 100;
        this.camera.position.y = 100;
        this.camera.position.z = 10000;
        this.ambientLight = new THREE.AmbientLight(0x00000, 100);
        this.scene.add(this.ambientLight);
        this.directionalLight = new THREE.DirectionalLight(0xffdf04, 0.4);
        this.directionalLight.position.set(0, 1, 0);
        this.directionalLight.castShadow = true;
        this.scene.add(this.directionalLight);
        this.light1 = new THREE.PointLight(0x4b371c, 10);
        this.light1.position.set(0, 200, 400);
        this.scene.add(this.light1);
    }
  
    private getAspectRatio(): number {
        return this.canvas.clientWidth / this.canvas.clientHeight;
    }
  
    private startRenderingLoop(): void {
        // Renderer
        // Use canvas element in template
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
