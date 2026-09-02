'use client';
import { useEffect, useRef } from 'react';
import type { HeroConfig } from './hero-controls';

/**
 * Hero animation v4 — tetrahedron with:
 * - Simplex-noise vertex deformation
 * - Vertex attraction to cursor
 * - Face flash on cursor hover
 * - Fresnel rim glow
 * Configurable via `config` prop (controlled by HeroControls panel).
 */

const VERTEX_SHADER = `
  uniform float time;
  uniform float displacement;
  uniform vec3  mouseLocal;
  uniform float mouseActive;
  uniform float attractionRadius;
  uniform float attractionStrength;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vNdc;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
          i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  void main() {
    vNormal = normal;
    vPosition = position;
    float disp = snoise(position * 1.5 + time * 0.4) * displacement;
    vec3 newPosition = position + normal * disp;

    if (mouseActive > 0.001) {
      float dist = distance(newPosition, mouseLocal);
      if (dist < attractionRadius) {
        float falloff = 1.0 - (dist / attractionRadius);
        falloff = pow(falloff, 2.0);
        vec3 toMouse = mouseLocal - newPosition;
        newPosition += toMouse * falloff * attractionStrength * mouseActive;
      }
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    vNdc = gl_Position.xy / gl_Position.w;
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 color;
  uniform vec3 pointLightPos;
  uniform vec2  mouseNdc;
  uniform float mouseActive;
  uniform float flashRadius;
  uniform float flashIntensity;
  uniform vec3  flashColor;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vNdc;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(pointLightPos - vPosition);
    float diffuse = max(dot(normal, lightDir), 0.0);
    float fresnel = 1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0);
    fresnel = pow(fresnel, 2.2);

    vec3 baseColor = color * (diffuse * 0.7 + 0.3) + vec3(0.38, 0.82, 1.0) * fresnel * 0.9;

    float flash = 0.0;
    if (mouseActive > 0.001) {
      vec2 d = vNdc - mouseNdc;
      float dist = length(d);
      if (dist < flashRadius) {
        float falloff = 1.0 - (dist / flashRadius);
        falloff = pow(falloff, 1.5);
        flash = falloff * flashIntensity * mouseActive;
      }
    }

    vec3 finalColor = baseColor + flashColor * flash * 1.5;
    gl_FragColor = vec4(finalColor, 0.85);
  }
`;

function createGeometry(THREE: any, shape: string, detail: number) {
  const r = 1.25;
  const d = Math.max(0, Math.min(detail, 8));
  switch (shape) {
    case 'tetrahedron': return new THREE.TetrahedronGeometry(r * 1.3, d);
    case 'icosahedron': return new THREE.IcosahedronGeometry(r, d);
    case 'octahedron': return new THREE.OctahedronGeometry(r * 1.1, d);
    case 'dodecahedron': return new THREE.DodecahedronGeometry(r, d);
    case 'box':
      return new THREE.BoxGeometry(r * 1.5, r * 1.5, r * 1.5,
        Math.max(1, d * 4), Math.max(1, d * 4), Math.max(1, d * 4));
    case 'sphere':
      return new THREE.SphereGeometry(r, Math.max(8, d * 8 + 16), Math.max(8, d * 8 + 16));
    case 'torus-knot':
      return new THREE.TorusKnotGeometry(r * 0.75, r * 0.25,
        Math.max(64, d * 32 + 64), Math.max(8, d * 4 + 12));
    default: return new THREE.IcosahedronGeometry(r, d);
  }
}

export function HeroAnimation({ config }: { config: HeroConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Keep a ref to the latest config so the animation loop reads fresh values
  const configRef = useRef(config);
  configRef.current = config;
  // Refs to Three.js objects we need to mutate when config changes
  const sceneRef = useRef<any>(null);

  useEffect(() => {
    let cleanup = () => {};

    import('three')
      .then((THREE) => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
        camera.position.z = 2.8;

        const renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(0x000000, 0);

        const pointLight = new THREE.PointLight(0xffffff, 2, 50);
        pointLight.position.set(0, 0, 4);
        scene.add(pointLight);

        const initialConfig = configRef.current;
        let geometry = createGeometry(THREE, initialConfig.shape, initialConfig.detail);
        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            pointLightPos: { value: new THREE.Vector3(0, 0, 4) },
            color: { value: new THREE.Color('#38bdf8') },
            displacement: { value: initialConfig.displacement },
            mouseLocal: { value: new THREE.Vector3(0, 0, 4) },
            mouseNdc: { value: new THREE.Vector2(0, 0) },
            mouseActive: { value: 0 },
            attractionRadius: { value: initialConfig.attractionRadius },
            attractionStrength: { value: initialConfig.attractionStrength },
            flashRadius: { value: initialConfig.flashRadius },
            flashIntensity: { value: initialConfig.flashIntensity },
            flashColor: { value: new THREE.Color(initialConfig.flashColor) },
          },
          vertexShader: VERTEX_SHADER,
          fragmentShader: FRAGMENT_SHADER,
          wireframe: initialConfig.wireframe,
          transparent: true,
        });

        let mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        sceneRef.current = { THREE, mesh, material, scene, renderer };

        // Mouse tracking
        const mousePosWorld = new THREE.Vector3(0, 0, 4);
        const mouseNdc = new THREE.Vector2(0, 0);
        let mouseActiveTarget = 0;
        let mouseActiveCurrent = 0;

        const onMouseMove = (e: MouseEvent) => {
          mouseNdc.set(
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY / window.innerHeight) * 2 + 1,
          );
          material.uniforms.mouseNdc.value.copy(mouseNdc);

          const v = new THREE.Vector3(mouseNdc.x, mouseNdc.y, 0.5)
            .unproject(camera)
            .sub(camera.position)
            .normalize();
          const dist = -camera.position.z / (v.z || -1);
          const pos = camera.position.clone().add(v.multiplyScalar(dist));
          mousePosWorld.copy(pos);
          pointLight.position.copy(pos);
          material.uniforms.pointLightPos.value.copy(pos);
          const c = configRef.current;
          if (c.attractionEnabled || c.flashEnabled) mouseActiveTarget = 1;
        };

        const onMouseLeave = () => { mouseActiveTarget = 0; };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        document.addEventListener('mouseleave', onMouseLeave);
        document.body.addEventListener('mouseleave', onMouseLeave);

        // Animation loop
        let animId: number;
        const animate = (e: number) => {
          const c = configRef.current;
          const s = c.speed;
          material.uniforms.time.value = e * 4e-4 * s;
          mesh.rotation.y += 8e-4 * s;
          mesh.rotation.x += 4e-4 * s;

          // Apply brightness via canvas opacity
          canvas.style.opacity = String(c.brightness);
          // Apply scale
          mesh.scale.setScalar(c.scale);

          mesh.updateMatrixWorld();
          const localPos = mousePosWorld.clone();
          mesh.worldToLocal(localPos);
          material.uniforms.mouseLocal.value.copy(localPos);

          if (!c.attractionEnabled && !c.flashEnabled) mouseActiveTarget = 0;
          mouseActiveCurrent += (mouseActiveTarget - mouseActiveCurrent) * 0.1;
          material.uniforms.mouseActive.value = mouseActiveCurrent;

          renderer.render(scene, camera);
          animId = requestAnimationFrame(animate);
        };
        animate(0);

        // Resize
        const onResize = () => {
          if (!container) return;
          const w = container.clientWidth || window.innerWidth;
          const h = container.clientHeight || window.innerHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        window.addEventListener('resize', onResize);

        cleanup = () => {
          cancelAnimationFrame(animId);
          window.removeEventListener('resize', onResize);
          window.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseleave', onMouseLeave);
          document.body.removeEventListener('mouseleave', onMouseLeave);
          geometry.dispose();
          material.dispose();
          renderer.dispose();
        };
      })
      .catch((err) => console.error('[HeroAnimation] Three.js load failed:', err));

    return () => cleanup();
  }, []);

  // Apply config changes to the running scene
  useEffect(() => {
    const sceneState = sceneRef.current;
    if (!sceneState) return;
    const { THREE, mesh, material } = sceneState;

    // Rebuild geometry if shape or detail changed
    const newGeometry = createGeometry(THREE, config.shape, config.detail);
    mesh.geometry.dispose();
    mesh.geometry = newGeometry;

    // Update uniforms
    material.uniforms.displacement.value = config.displacement;
    material.uniforms.attractionRadius.value = config.attractionRadius;
    material.uniforms.attractionStrength.value = config.attractionStrength;
    material.uniforms.flashRadius.value = config.flashRadius;
    material.uniforms.flashIntensity.value = config.flashIntensity;
    material.uniforms.flashColor.value = new THREE.Color(config.flashColor);
    material.wireframe = config.wireframe;
  }, [
    config.shape,
    config.detail,
    config.displacement,
    config.attractionRadius,
    config.attractionStrength,
    config.flashRadius,
    config.flashIntensity,
    config.flashColor,
    config.wireframe,
  ]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  );
}
