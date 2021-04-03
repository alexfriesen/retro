import { RetroSceneAnimation } from './js/animation.js';

const template = document.createElement("template");
template.innerHTML = /*html*/`
    <style>
        :host {
            display: block;
            height: 100%;
            width: 100%;
        }
        canvas {
            position: relative;
            height: 100%;
            width: 100%;
        }
    </style>
    <canvas id="canvas"></canvas>
`;

class RetroScene extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const canvas = this.shadowRoot.getElementById("canvas");
        this.scene = new RetroSceneAnimation(canvas);

        window.addEventListener('resize', (event) => {
            this.scene.resize(this.shadowRoot.host.clientWidth, this.shadowRoot.host.clientHeight);
        })

        this.scene.resize(canvas.clientWidth, canvas.clientHeight);
        this.scene.render();
    }

}

customElements.define("retro-scene", RetroScene);
