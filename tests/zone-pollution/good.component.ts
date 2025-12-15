import { Component, OnInit, NgZone } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-good',
  template: '<div #canvas></div>'
})
export class GoodComponent implements OnInit {
  private scene: any;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer();

    // Good: wrapping timer in runOutsideAngular
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        renderer.render(this.scene, new THREE.PerspectiveCamera());
      }, 16);
    });
  }
}