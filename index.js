var v=Object.defineProperty;var k=(a,e,t)=>e in a?v(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var o=(a,e,t)=>(k(a,typeof e!="symbol"?e+"":e,t),t);import{V as d,S as x,P as p,M as u,C as l,a as m,B as f,b as z,c as M,F as C,d as P,W as S,R as A,e as b,f as F,E as R,g,h as E,i as G,D as H,j as W,k as L,l as w,m as N}from"./vendor.js";const O=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function t(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerpolicy&&(n.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?n.credentials="include":i.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=t(i);fetch(i.href,n)}};O();const T=`${Date.now()}`;class B{constructor(e=50){o(this,"chunks",new Set);this.chunksize=e}addChunk(e){this.chunks.add(e)}createChunk(e){const t=e.multiplyScalar(this.chunksize),s=new I(this.chunksize,t);this.addChunk(s)}addTo(e){for(const t of this.chunks)t.mesh.position.z=t.offset.z,e.add(t.mesh)}update(e){for(const t of this.chunks)if(t.update(e),t.mesh.position.z>this.chunksize){const s=this.chunksize*2;t.updateOffset(new d(0,0,-s)),t.mesh.position.z-=s}}}class I{constructor(e=50,t=new d){o(this,"height",20);o(this,"smoothing",10);o(this,"segments");o(this,"simplex");o(this,"mesh");o(this,"geometry");o(this,"material");this.size=e,this.offset=t,this.size=e,this.segments=e/2,this.offset=t,this.simplex=new x(T),this.geometry=new p(this.size,this.size,this.segments,this.segments),this.setGeometryHeight(),this.material=new u({color:new l(788010)}),this.mesh=new m(this.geometry,this.material)}setGeometryHeight(){const e=this.geometry.getAttribute("position").array;for(let t=2;t<e.length;t+=3){const s=e[t-2]+this.offset.x,i=e[t-1];e[t]=-i;const n=e[t]+this.offset.z;e[t-1]=this.simplex.noise2D(s/this.smoothing,n/this.smoothing)*this.getHeight(new d(s,i,n))}this.geometry.setAttribute("position",new f(e,3)),this.geometry.computeVertexNormals()}getHeight(e){return Math.min(Math.abs(e.x)*.1,this.height)}addTo(e){e.add(this.mesh)}update(e){this.mesh.position.z=this.mesh.position.z+e}updateOffset(e){this.offset.add(e),this.updateGeometry()}updateGeometry(){const e=this.geometry.getAttribute("position").array;for(let t=2;t<e.length;t+=3){const s=e[t-2]+this.offset.x,i=e[t-1],n=e[t]+this.offset.z;e[t-1]=this.simplex.noise2D(s/this.smoothing,n/this.smoothing)*this.getHeight(new d(s,i,n))}this.geometry.setAttribute("position",new f(e,3)),this.geometry.computeVertexNormals()}}class V{constructor(e){o(this,"canvas");o(this,"pink",12327284);o(this,"skyColor",1771323);o(this,"groundColor",788010);o(this,"FOV",45);o(this,"NEAR",1);o(this,"FAR",350);o(this,"terrain");o(this,"camera");o(this,"renderer");o(this,"composer");o(this,"clock",new z);o(this,"scene",new M);o(this,"animationId",null);this.canvas=e;const t=e.clientWidth,s=e.clientHeight,i=t/s;this.scene.background=new l(this.skyColor),this.scene.fog=new C(this.pink,1,this.FAR/2),this.scene.add(this.createSkydome()),this.scene.add(this.createSunset()),this.createStars().map(r=>this.scene.add(r)),this.camera=new P(this.FOV,i,this.NEAR,this.FAR),this.camera.position.set(0,6,30),this.scene.add(this.camera),this.terrain=new B(this.FAR),this.terrain.createChunk(new d),this.terrain.createChunk(new d(0,0,-1)),this.terrain.addTo(this.scene),this.renderer=new S({antialias:!0,canvas:e}),this.renderer.setPixelRatio(window.devicePixelRatio||1),this.renderer.toneMapping=A,this.renderer.toneMappingExposure=Math.pow(1,4);const n=new b(this.scene,this.camera),c=new F(.2,.75,2048,0);this.composer=new R(this.renderer),this.composer.addPass(n),this.composer.addPass(c)}createSkydome(){const e=`
            varying vec3 vWorldPosition;
    
            void main() {
    
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
    
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    
            }
        `,t=`
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform float offset;
            uniform float exponent;
    
            varying vec3 vWorldPosition;
    
            void main() {
    
                float h = normalize(vWorldPosition + offset).y;
                float w = normalize(vWorldPosition).x;
                gl_FragColor = vec4(
                    mix(
                        bottomColor, 
                        topColor,
                        max(h / exponent, 0.0)
                    ),
                    1.0
                );
    
            }
        `,s={topColor:{value:new l(this.skyColor)},bottomColor:{value:new l(this.pink)},offset:{value:-4},exponent:{value:.2}},i=new g(this.FAR/2,32,15),n=new E({uniforms:s,vertexShader:e,fragmentShader:t,side:G});return new m(i,n)}createGround(){const e=new p(this.FAR,this.FAR,100,100),t=new u({color:this.groundColor});t.side=H;const s=new m(e,t);return s.rotateX(Math.PI/2),s}createSunset(e=40){const t=new g(e,e,32),s=new u({color:this.pink}),i=new m(t,s);return i.position.set(0,e*.35,-this.FAR/1.8),i}createStars(){const e=new W,t=[],s=new d;for(let r=0;r<2e3;r++)s.x=Math.random()*2-1,s.y=Math.random()*2-1,s.z=Math.random()*2-1,s.multiplyScalar(3),t.push(s.x,s.y,s.z);e.setAttribute("position",new L(t,3));const i=[5592405,3355443,3815994].reduce((r,h)=>(r.push(new w({color:h,size:2,sizeAttenuation:!1}),new w({color:h,size:1,sizeAttenuation:!1})),r),[]),n=i.length,c=[];for(let r=10;r<20;r++){const h=new N(e,i[r%n]);h.rotation.x=Math.random()*2,h.rotation.y=Math.random()*2,h.rotation.z=Math.random()*2,h.scale.setScalar(r*10),h.matrixAutoUpdate=!1,h.updateMatrix(),c.push(h)}return c}resize(e,t){this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.composer.setSize(e,t)}render(){this.terrain.update(.5),this.composer.render(),this.animationId=requestAnimationFrame(()=>this.render())}stop(){this.animationId&&cancelAnimationFrame(this.animationId)}}const y=document.createElement("template");y.innerHTML=`
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
`;class D extends HTMLElement{constructor(){super();o(this,"shadow");o(this,"scene");this.shadow=this.attachShadow({mode:"open"})}connectedCallback(){this.shadow.appendChild(y.content.cloneNode(!0));const e=this.shadow.host,t=this.shadow.getElementById("canvas");this.scene=new V(t),window.addEventListener("resize",()=>{var s;(s=this.scene)==null||s.resize(e.clientWidth,e.clientHeight)}),this.scene.resize(e.clientWidth,e.clientHeight),this.scene.render()}disconnectedCallback(){var e;(e=this.scene)==null||e.stop(),this.scene=void 0}}customElements.define("retro-scene",D);
