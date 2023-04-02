import { PlanetService } from 'src/app/service/planet.service';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as THREE from "three";

const skyColor = new THREE.Color(0x010101);

@Component({
  selector: 'app-one-planet',
  templateUrl: './one-planet.component.html',
  styleUrls: ['./one-planet.component.scss']
})
export class OnePlanetComponent implements AfterViewInit {

  @ViewChild('canvas')
  private canvasRef: ElementRef;

  // planet properties

  @Input() public rotationSpeedX: number = 0.00;

  @Input() public rotationSpeedY: number = 0.01;

  @Input() public size: number = 200;

  // stage Properties

  @Input() public cameraZ: number = 2000;

  @Input() public fieldOfView: number = 1;

  @Input('nearClipping') public nearClippingPlane: number = 1;

  @Input('farClipping') public farClippingPlane: number = 10000;

  // helper properties

  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private sun: THREE.Mesh;

  constructor(private readonly planetService: PlanetService) {
    this.sun = this.planetService.getSun();
  }

  ngAfterViewInit(): void {
    this.createScene();
    this.startRenderingLoop();
  }

  private animateCube(): void {
    this.sun.rotation.x += this.rotationSpeedX;
    this.sun.rotation.y += this.rotationSpeedY;
  }

  private createScene(): void {
    // create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(skyColor);
    this.scene.add(this.sun);

    // config camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    )
    this.camera.position.z = this.cameraZ;
  }

  private getAspectRatio(): number {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private startRenderingLoop(): void {
    // renderer
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