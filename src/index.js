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
        const host = this.shadowRoot.host;
        const canvas = this.shadowRoot.getElementById("canvas");
        this.scene = new RetroSceneAnimation(canvas);

        window.addEventListener('resize', (event) => {
            console.log(host.clientHeight)
            this.scene.resize(host.clientWidth, host.clientHeight);
        })

        this.scene.resize(host.clientWidth, host.clientHeight);
        this.scene.render();
    }

}

customElements.define("retro-scene", RetroScene);
