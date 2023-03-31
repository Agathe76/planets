import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three";

const skyColor = new THREE.Color(0x231F70);

@Component({
  selector: 'app-one-planet',
  templateUrl: './one-planet.component.html',
  styleUrls: ['./one-planet.component.scss']
})
export class OnePlanetComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas')
  private canvasRef: ElementRef;

  //* Cube Properties

  @Input() public rotationSpeedX: number = 0.00;

  @Input() public rotationSpeedY: number = 0.01;

  @Input() public size: number = 200;

  @Input() public texture: string = "/../../../assets/images/texture.png";

  //* Stage Properties

  @Input() public cameraZ: number = 1000;

  @Input() public fieldOfView: number = 1;

  @Input('nearClipping') public nearClippingPlane: number = 1;

  @Input('farClipping') public farClippingPlane: number = 1000;

  //? Helper Properties (Private Properties);

  private camera!: THREE.PerspectiveCamera;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  private loader = new THREE.TextureLoader();
  // private cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  // private cubeMaterial = new THREE.MeshBasicMaterial({ map: this.loader.load(this.texture) });
  
  private sunGeometry = new THREE.SphereGeometry( 15, 32, 16 ); // new THREE.SphereGeometry( 7.5, 16, 8 );
  private sunMaterial = new THREE.MeshBasicMaterial( {
    // color: 0xffff00
    map: this.loader.load('/../../../assets/images/sun_texture.png')
  });

  // private cube: THREE.Mesh = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial);
  private sun: THREE.Mesh = new THREE.Mesh(this.sunGeometry, this.sunMaterial);

  private renderer!: THREE.WebGLRenderer;

  private scene!: THREE.Scene;

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
  }

  private animateCube() {
    // this.cube.rotation.x += this.rotationSpeedX;
    // this.cube.rotation.y += this.rotationSpeedY;
    this.sun.rotation.x += this.rotationSpeedX;
    this.sun.rotation.y += this.rotationSpeedY;
  }

  private createScene() {
    //* Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(skyColor);
    // this.scene.add(this.cube);
    this.scene.add(this.sun);

    // const geometry = new THREE.SphereGeometry( 1.5, 3.2, 1.6 );
    // const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    // const sphere = new THREE.Mesh( geometry, material );
    // this.scene.add( sphere );


    //*Camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    )
    this.camera.position.z = this.cameraZ;
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private startRenderingLoop() {
    //* Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: OnePlanetComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    }());
  }

}