import * as THREE from 'three';

export class OverlayCanvas {
    rayOrigin = new THREE.Vector3(0, 0, 0);
    rayDirection = new THREE.Vector3(0, 0, 0);
    pointer = { x: 0, y: 0 }

    constructor({ bgSize, camera }) {
        this.width = bgSize.x * 20;
        this.height = bgSize.y * 20;

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'drawingCanvas';
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';

        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.canvasTexture = new THREE.CanvasTexture(this.canvas);
        this.camera = camera;

        this.createRaycaster();
        this.fillCanvas();
        this.setListeners();
    }

    createRaycaster() {
        this.raycaster = new THREE.Raycaster(this.rayOrigin, this.rayDirection);
    }

    setListeners() {
        window.addEventListener('mousemove', this.updateRaycaster)
    }

    setPlane(plane) {
        this.plane = plane
    }

    // Start
    fillCanvas() {
        this.ctx.fillStyle = 'rgba(0, 0, 255, 1)';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    updateRaycaster = ( event ) => {
        this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        this.checkIntersection()
    }

    drawOnCanvas = (uv) => {
        const x = this.width * uv.x;
        const y = this.height * (1 - uv.y);

        this.ctx.beginPath()
        // this.ctx.fillStyle = 'rgba(255, 0, 0, 1)';
        // this.ctx.arc(x, y, 30, 0, Math.PI * 2);
        // gradient arc blend

        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 30);
        gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.arc(x, y, 50, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.closePath()

        this.canvasTexture.needsUpdate = true;
    }

    checkIntersection = () => {
        if(!this.plane) return;

        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersect = this.raycaster.intersectObject(this.plane)[0];
        if(intersect) {
            this.drawOnCanvas(intersect.uv)
        }
    }

}