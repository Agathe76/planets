import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import * as THREE from "three";
import { Router } from "@angular/router";

const skyColor = new THREE.Color(0x231F70);

@Component({
    selector: 'app-all-planets',
    templateUrl: './all-planets.component.html',
    styleUrls: ['./all-planets.component.scss']
})
export class AllPlanetsComponent {

    @ViewChild('canvas') private canvasRef: ElementRef;

    //* Stage Properties
  
    @Input() public fieldOfView: number = 1;
  
    @Input('nearClipping') public nearClippingPane: number = 1;
  
    @Input('farClipping') public farClippingPane: number = 10000;
  
    //? Scene properties

    private camera: THREE.PerspectiveCamera;
    private controls: OrbitControls;
    private ambientLight: THREE.AmbientLight;
    private light1: THREE.PointLight;
    private light2: THREE.PointLight;
    private light3: THREE.PointLight;
    private light4: THREE.PointLight;
    private model: any;
    private directionalLight: THREE.DirectionalLight;
  
    //? Helper Properties (Private Properties);
  
    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }
  
    private loader = new THREE.TextureLoader();
    private sunGeometry = new THREE.SphereGeometry( 15, 32, 16 ); // new THREE.SphereGeometry( 7.5, 16, 8 );
    private sunMaterial = new THREE.MeshBasicMaterial( {
        // color: 0xffff88
        map: this.loader.load('/../../../assets/images/sun_texture.png')
    });
  
    private sun: THREE.Mesh = new THREE.Mesh(this.sunGeometry, this.sunMaterial);
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
  
    constructor(private readonly router: Router) {}
  
    ngOnInit(): void {}
  
    ngAfterViewInit(): void {
        this.createScene();
        this.startRenderingLoop();
        this.createControls();
    }

    public selectPlanet(): void {
        this.router.navigate(['one-planet']);
    }

    private animateModel(): void {
        if (this.model) {
            this.model.rotation.z += 0.005;
        }
    }
  
    private createControls = (): void => {
        console.log('createControls');
        const renderer = new CSS2DRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0px';
        document.body.appendChild(renderer.domElement);
        this.controls = new OrbitControls(this.camera, renderer.domElement);
        this.controls.autoRotate = true;
        this.controls.enableZoom = true;
        this.controls.enablePan = false;
        this.controls.maxDistance = this.farClippingPane;
        this.controls.update();
    };
  
    private createScene() {
        //* Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(skyColor);
        this.scene.add(this.sun);

        //*Camera
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
        this.light2 = new THREE.PointLight(0x4b371c, 10);
        this.light2.position.set(500, 100, 0);
        this.scene.add(this.light2);
        this.light3 = new THREE.PointLight(0x4b371c, 10);
        this.light3.position.set(0, 100, -500);
        this.scene.add(this.light3);
        this.light4 = new THREE.PointLight(0x4b371c, 10);
        this.light4.position.set(-500, 300, 500);
        this.scene.add(this.light4);
    }
  
    private getAspectRatio() {
        return this.canvas.clientWidth / this.canvas.clientHeight;
    }
  
    private startRenderingLoop() {
        //* Renderer
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
