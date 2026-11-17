import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/loaders/GLTFLoader.js';

const mount=document.querySelector('#game'), status=document.querySelector('#status');
const scene=new THREE.Scene(); scene.background=new THREE.Color(0x111710); scene.fog=new THREE.Fog(0x111710,18,55);
const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,100); camera.position.set(7,9,11);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7)); renderer.setSize(innerWidth,innerHeight); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap; renderer.outputColorSpace=THREE.SRGBColorSpace; mount.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xbac9cf,0x28301c,2));
const sun=new THREE.DirectionalLight(0xffe4b5,2.3); sun.position.set(-7,12,5); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024); scene.add(sun);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(90,90),new THREE.MeshStandardMaterial({color:0x293327,roughness:1})); ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);
const grid=new THREE.GridHelper(90,45,0x46513a,0x34402f); grid.position.y=.012; scene.add(grid);
function tree(x,z,s=1){const g=new THREE.Group();const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.12*s,.2*s,1.3*s,6),new THREE.MeshStandardMaterial({color:0x493b2a}));trunk.position.y=.65*s;trunk.castShadow=true;g.add(trunk);for(let i=0;i<3;i++){const crown=new THREE.Mesh(new THREE.ConeGeometry((.8-i*.12)*s,1.35*s,7),new THREE.MeshStandardMaterial({color:i===0?0x34482e:0x405636,roughness:1}));crown.position.y=(1.35+i*.48)*s;crown.castShadow=true;g.add(crown)}g.position.set(x,0,z);scene.add(g)}
for(let i=0;i<34;i++){const a=i*2.399,r=9+(i%5)*2.3;tree(Math.cos(a)*r,Math.sin(a)*r,.7+(i%4)*.13)}
const portal=new THREE.Group();portal.position.set(0,0,-5);const ring=new THREE.Mesh(new THREE.TorusGeometry(1.55,.16,12,48),new THREE.MeshStandardMaterial({color:0x9c8150,metalness:.65,roughness:.35,emissive:0x3b2107}));ring.position.y=2.1;portal.add(ring);const glow=new THREE.Mesh(new THREE.CircleGeometry(1.42,40),new THREE.MeshBasicMaterial({color:0x276d82,transparent:true,opacity:.5,side:THREE.DoubleSide}));glow.position.set(0,2.1,0);portal.add(glow);scene.add(portal);
const hero=new THREE.Group();scene.add(hero);
const mat=new THREE.MeshStandardMaterial({color:0x9a8b6b,roughness:.82});
const body=new THREE.Mesh(new THREE.CapsuleGeometry(.34,.85,5,10),mat);body.position.y=1.05;body.castShadow=true;hero.add(body);
const head=new THREE.Mesh(new THREE.SphereGeometry(.27,12,10),new THREE.MeshStandardMaterial({color:0xc4aa88}));head.position.y=1.82;head.castShadow=true;hero.add(head);
const cloak=new THREE.Mesh(new THREE.ConeGeometry(.48,.95,8),new THREE.MeshStandardMaterial({color:0x34302a,roughness:1}));cloak.position.set(0,.72,-.18);cloak.rotation.x=Math.PI;cloak.castShadow=true;hero.add(cloak);
new GLTFLoader().load('./assets/hero/model.glb',g=>{
  hero.clear(); const model=g.scene;
  const before=new THREE.Box3().setFromObject(model), size=before.getSize(new THREE.Vector3()), center=before.getCenter(new THREE.Vector3());
  const factor=2.0/Math.max(size.y,.001); model.scale.setScalar(factor);
  model.position.set(-center.x*factor,-before.min.y*factor,-center.z*factor);
  model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
  hero.add(model); status.textContent='Character model loaded · movement enabled';
},undefined,()=>{status.textContent='World ready · temporary hero (model file not connected yet)'});
const keys={};addEventListener('keydown',e=>keys[e.key.toLowerCase()]=true);addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
let joy={x:0,y:0},joyPointer=null;const stick=document.querySelector('#stick'),nub=document.querySelector('#nub');
stick.addEventListener('pointerdown',e=>{e.stopPropagation();joyPointer=e.pointerId;stick.setPointerCapture(e.pointerId);moveJoy(e)});
stick.addEventListener('pointermove',e=>{if(e.pointerId===joyPointer)moveJoy(e)});
function joyEnd(){joyPointer=null;joy={x:0,y:0};nub.style.transform='translate(0,0)'}
stick.addEventListener('pointerup',joyEnd);stick.addEventListener('pointercancel',joyEnd);
function moveJoy(e){const r=stick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,l=Math.hypot(dx,dy),m=35,k=l>m?m/l:1;joy={x:dx*k/m,y:dy*k/m};nub.style.transform=`translate(${joy.x*35}px,${joy.y*35}px)`}
let yaw=0,lookPointer=null,lastX=0;renderer.domElement.addEventListener('pointerdown',e=>{lookPointer=e.pointerId;lastX=e.clientX;renderer.domElement.setPointerCapture(e.pointerId)});renderer.domElement.addEventListener('pointermove',e=>{if(e.pointerId===lookPointer){yaw-=(e.clientX-lastX)*.004;lastX=e.clientX}});function stopLook(e){if(e.pointerId===lookPointer)lookPointer=null}renderer.domElement.addEventListener('pointerup',stopLook);renderer.domElement.addEventListener('pointercancel',stopLook);
const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);let x=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+joy.x;let z=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0)+joy.y;const len=Math.hypot(x,z);if(len>.08){x/=Math.max(1,len);z/=Math.max(1,len);const c=Math.cos(yaw),s=Math.sin(yaw),wx=x*c+z*s,wz=-x*s+z*c;hero.position.x+=wx*4*dt;hero.position.z+=wz*4*dt;hero.rotation.y=Math.atan2(wx,wz)}const target=new THREE.Vector3(hero.position.x+Math.sin(yaw)*7,hero.position.y+8,hero.position.z+Math.cos(yaw)*9);camera.position.lerp(target,.08);camera.lookAt(hero.position.x,1,hero.position.z);ring.rotation.z+=dt*.22;renderer.render(scene,camera)}
animate();addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
