import * as THREE from 'three';

export class OverlayCanvas {
    rayOrigin = new THREE.Vector3(0, 0, 0);
    rayDirection = new THREE.Vector3(0, 0, 0);
    pointer = { x: 0, y: 0 };
    positions = []; // Tableau pour stocker les positions UV

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
        window.addEventListener('mousemove', this.updateRaycaster);
    }

    setPlane(plane) {
        this.plane = plane;
    }

    // Remplissage initial de la toile
    fillCanvas() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // Mettre à jour le raycaster lors du déplacement de la souris
    updateRaycaster = (event) => {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.checkIntersection();
    };

    // Dessiner plusieurs points sur la toile pour créer l'effet de traînée
    drawOnCanvas = () => {
        // Effacer la toile à chaque frame
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.fillCanvas(); // Remplir à nouveau le fond

        // Pour chaque position stockée, dessiner un point
        this.positions.forEach((pos, index) => {
            const x = this.width * pos.x;
            const y = this.height * (1 - pos.y);

            const alpha = (index + 1) / this.positions.length; // Alpha pour l'effet de traînée
            this.ctx.beginPath();
            // this.ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`; // Ajuste l'opacité pour un effet de traînée

            // effet gradient
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 80);
            gradient.addColorStop(0, `rgba(255, 0, 0, ${alpha})`);
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            this.ctx.fillStyle = gradient;

            // this.ctx.fillStyle = alpha;
    
            this.ctx.arc(x, y, 80, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.closePath();
        });

        // Signaler que la texture a besoin d'être mise à jour
        this.canvasTexture.needsUpdate = true;
    };


    // Vérifier l'intersection entre le raycaster et le plan
    checkIntersection = () => {
        if (!this.plane) return;

        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersect = this.raycaster.intersectObject(this.plane)[0];
        if (intersect) {
            // Ajouter la position UV dans le tableau
            this.positions.push(intersect.uv);

            // Limiter le nombre de positions stockées (ici à 20)
            if (this.positions.length > 20) {
                this.positions.shift(); // Supprimer le point le plus ancien
            }

            this.drawOnCanvas(); // Redessiner la toile avec les nouvelles positions
        } else {
            // Efface ton canvas
            // this.ctx.clearRect(0, 0, this.width, this.height);
            let repeatCount = 0;
            const clear = () => {
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                this.ctx.fillRect(0, 0, this.width, this.height);

                repeatCount++;
                this.canvasTexture.needsUpdate = true;

                if(repeatCount < 10) {
                    requestAnimationFrame(clear);
                    this.positions = [];
                }
            }
            clear()
        }
    };
}
