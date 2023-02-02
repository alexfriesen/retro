import {
	BufferAttribute,
	Vector3,
	Color,
	Mesh,
	MeshBasicMaterial,
	PlaneGeometry,
	Scene,
} from 'three';
import { createNoise2D, NoiseFunction2D } from 'simplex-noise';
import alea from 'alea';

const seed = `${Date.now()}`;

export class Terrain {
	chunks = new Set<TerrainChunk>();

	constructor(private chunksize = 50) {}

	addChunk(chunk: TerrainChunk) {
		this.chunks.add(chunk);
	}

	createChunk(offset: Vector3) {
		const offsetPosition = offset.multiplyScalar(this.chunksize);
		const chunk = new TerrainChunk(this.chunksize, offsetPosition);

		this.addChunk(chunk);
	}

	addTo(scene: Scene) {
		for (const chunk of this.chunks) {
			chunk.mesh.position.z = chunk.offset.z;

			scene.add(chunk.mesh);
		}
	}

	update(speed: number) {
		for (const chunk of this.chunks) {
			chunk.update(speed);
			if (chunk.mesh.position.z > this.chunksize) {
				const skip = this.chunksize * 2;
				chunk.updateOffset(new Vector3(0, 0, -skip));

				chunk.mesh.position.z -= skip;
			}
		}
	}
}

export class TerrainChunk {
	height = 20;
	smoothing = 10;
	segments: number;
	simplex: NoiseFunction2D;

	mesh: Mesh;
	geometry: PlaneGeometry;
	material: MeshBasicMaterial;

	constructor(private size = 50, public offset = new Vector3()) {
		this.size = size;
		this.segments = size / 2;
		this.offset = offset;
		this.simplex = createNoise2D(alea(seed));

		this.geometry = new PlaneGeometry(
			this.size,
			this.size,
			this.segments,
			this.segments
		);
		this.setGeometryVertecies();

		this.material = new MeshBasicMaterial({ color: new Color(0x0c062a) });

		this.mesh = new Mesh(this.geometry, this.material);
	}

	setGeometryVertecies() {
		const position = this.geometry.getAttribute('position') as BufferAttribute;
		const currentVertices = position.array;

		const vertices = new Float32Array(currentVertices.length);

		for (let i = 0; i < currentVertices.length - 2; i += 3) {
			const x = currentVertices[i] + this.offset.x;
			const y = currentVertices[i + 1];
			const z = -y + this.offset.z;

			vertices[i] = x;
			vertices[i + 2] = -y;
			vertices[i + 1] = this.getNoiseAt(x, z);
		}

		this.geometry.setAttribute('position', new BufferAttribute(vertices, 3));
		this.geometry.computeVertexNormals();
	}

	getNoiseAt(x: number, z: number) {
		return (
			this.simplex(x / this.smoothing, z / this.smoothing) *
			Math.min(Math.abs(x) * 0.1, this.height)
		);
	}

	addTo(scene: Scene) {
		scene.add(this.mesh);
	}

	update(speed: number) {
		this.mesh.position.z = this.mesh.position.z + speed;
	}

	updateOffset(offset: Vector3) {
		this.offset.add(offset);

		this.updateGeometryVertecies();
	}

	updateGeometryVertecies() {
		const position = this.geometry.getAttribute('position') as BufferAttribute;
		const currentVertices = position.array;

		const vertices = new Float32Array(currentVertices.length);

		for (let i = 0; i < currentVertices.length - 2; i += 3) {
			const x = currentVertices[i] + this.offset.x;
			const z = currentVertices[i + 2] + this.offset.z;

			vertices[i] = currentVertices[i];
			vertices[i + 1] = this.getNoiseAt(x, z);
			vertices[i + 2] = currentVertices[i + 2];
		}

		this.geometry.setAttribute('position', new BufferAttribute(vertices, 3));
		this.geometry.computeVertexNormals();
	}
}
