'use client';
import { useEffect, useRef } from 'react';

/**
 * Hero animation — tetrahedron with simplex-noise deformation + Fresnel rim glow.
 * Port of https://litter.catbox.moe/t42kfh.html to React.
 * Uses Three.js (loaded via CDN importmap for compatibility).
 */

const VERTEX_SHADER = `
  uniform float time;
  uniform float displacement;
  varying vec3 vNormal;
  varying vec3 vPosition;

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
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 color;
  uniform vec3 pointLightPos;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(pointLightPos - vPosition);
    float diffuse = max(dot(normal, lightDir), 0.0);
    float fresnel = 1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0);
    fresnel = pow(fresnel, 2.2);
    vec3 finalColor = color * (diffuse * 0.7 + 0.3) + vec3(0.38, 0.82, 1.0) * fresnel * 0.9;
    gl_FragColor = vec4(finalColor, 0.85);
  }
`;

export function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup = () => {};

    // Load Three.js dynamically (client-only)
    import('three')
      .then((THREE) => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const CONFIG = {
          shape: 'tetrahedron',
          detail: 0,
          speed: 0.25,
          displacement: 0.3,
          wireframe: true,
          color: '#38bdf8',
        };

        function createGeometry(shape: string, detail: number) {
          const r = 1.25;
          const d = Math.max(0, Math.min(detail, 8));
          switch (shape) {
            case 'tetrahedron': return new THREE.TetrahedronGeometry(r * 1.3, d);
            case 'icosahedron': return new THREE.IcosahedronGeometry(r, d);
            case 'octahedron': return new THREE.OctahedronGeometry(r * 1.1, d);
            case 'dodecahedron': return new THREE.DodecahedronGeometry(r, d);
            default: return new THREE.IcosahedronGeometry(r, d);
          }
        }

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

        const geometry = createGeometry(CONFIG.shape, CONFIG.detail);
        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            pointLightPos: { value: new THREE.Vector3(0, 0, 4) },
            color: { value: new THREE.Color(CONFIG.color) },
            displacement: { value: CONFIG.displacement },
          },
          vertexShader: VERTEX_SHADER,
          fragmentShader: FRAGMENT_SHADER,
          wireframe: CONFIG.wireframe,
          transparent: true,
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const pointLight = new THREE.PointLight(0xffffff, 2, 50);
        pointLight.position.set(0, 0, 4);
        scene.add(pointLight);

        let animId: number;
        const animate = (e: number) => {
          const s = CONFIG.speed;
          material.uniforms.time.value = e * 4e-4 * s;
          mesh.rotation.y += 8e-4 * s;
          mesh.rotation.x += 4e-4 * s;
          renderer.render(scene, camera);
          animId = requestAnimationFrame(animate);
        };
        animate(0);

        const onResize = () => {
          if (!container) return;
          const w = container.clientWidth || window.innerWidth;
          const h = container.clientHeight || window.innerHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        window.addEventListener('resize', onResize);

        const onMouseMove = (e: MouseEvent) => {
          const v = new THREE.Vector3(
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY / window.innerHeight) * 2 + 1,
            0.5,
          )
            .unproject(camera)
            .sub(camera.position)
            .normalize();
          const dist = -camera.position.z / (v.z || -1);
          const pos = camera.position.clone().add(v.multiplyScalar(dist));
          pointLight.position.copy(pos);
          material.uniforms.pointLightPos.value.copy(pos);
        };
        window.addEventListener('mousemove', onMouseMove, { passive: true });

        cleanup = () => {
          cancelAnimationFrame(animId);
          window.removeEventListener('resize', onResize);
          window.removeEventListener('mousemove', onMouseMove);
          geometry.dispose();
          material.dispose();
          renderer.dispose();
        };
      })
      .catch((err) => console.error('[HeroAnimation] Three.js load failed:', err));

    return () => cleanup();
  }, []);

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
