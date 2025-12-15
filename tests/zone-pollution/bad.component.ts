import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-bad',
  template: '<div #canvas></div>'
})
export class BadComponent implements OnInit {
  private scene: any;

  ngOnInit() {
    // Bad: using THREE.js without runOutsideAngular
    this.scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer();
    // This will trigger zone pollution
    setInterval(() => {
      renderer.render(this.scene, new THREE.PerspectiveCamera());
    }, 16); // ~60fps
  }
}