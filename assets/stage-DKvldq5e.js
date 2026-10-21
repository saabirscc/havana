import{W as Z,y as $,H as ee,C as A,c as C,S as te,k as N,a as ne,P as X,g as oe,n as ie,s as ae,t as re,u as se,v as le,A as ce,b as Y,V as P,N as de,ag as me,O as _}from"./three-CKHXu_af.js";function ve(){const t=(1+Math.sqrt(5))/2,c=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(i=>new P(...i).normalize()),l=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]].map(([i,o,g])=>c[i].clone().add(c[o]).add(c[g]).normalize());return[...c,...l]}const pe=`
  varying vec3 vObj;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vObj = normalize(position);
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`,fe=`
  uniform vec3 uDirs[32];
  uniform vec3 uRimA;
  uniform vec3 uRimB;
  varying vec3 vObj;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float d1 = -2.0, d2 = -2.0; int idx = 0;
    for (int i = 0; i < 32; i++) {
      float d = dot(vObj, uDirs[i]);
      if (d > d1) { d2 = d1; d1 = d; idx = i; } else if (d > d2) { d2 = d; }
    }
    float edge = d1 - d2;
    bool penta = idx < 12;
    vec3 base = penta ? vec3(0.055, 0.06, 0.09) : vec3(0.95, 0.95, 0.97);
    // pillowed panels: a little darker towards the seams, a dark stitched groove on the seam
    float pillow = smoothstep(0.0, 0.09, edge);
    base *= mix(0.72, 1.0, pillow);
    float seam = 1.0 - smoothstep(0.004, 0.012, edge);
    base = mix(base, vec3(0.03), seam * 0.9);

    vec3 n = normalize(vNormal);
    vec3 key = normalize(vec3(0.4, 0.9, 0.6));
    float diff = max(dot(n, key), 0.0);
    float fill = max(dot(n, normalize(vec3(-0.7, -0.2, 0.4))), 0.0);
    vec3 h = normalize(key + vView);
    float spec = pow(max(dot(n, h), 0.0), penta ? 60.0 : 36.0) * (penta ? 0.9 : 0.45) * pillow;
    float fres = pow(1.0 - max(dot(n, vView), 0.0), 2.6);
    vec3 rim = mix(uRimA, uRimB, smoothstep(-0.6, 0.6, n.x));
    vec3 col = base * (0.18 + diff * 0.95 + fill * 0.25) + spec + rim * fres * 1.25;
    gl_FragColor = vec4(col, 1.0);
  }
`,ue=`
  uniform float uTime;
  uniform vec3 uLine;
  varying vec2 vUv;
  float line(float d, float w) { return 1.0 - smoothstep(w, w + 0.012, abs(d)); }
  void main() {
    vec2 p = (vUv - 0.5) * vec2(36.0, 36.0); // world units, pitch centre at 0
    // mowing stripes
    float stripe = step(0.5, fract(p.y / 3.0));
    vec3 grass = mix(vec3(0.02, 0.09, 0.06), vec3(0.03, 0.12, 0.08), stripe);
    // markings: halfway line, centre circle, centre spot, touchlines
    float r = length(p);
    float m = line(p.x, 0.035);
    m = max(m, line(r - 4.2, 0.035));
    m = max(m, 1.0 - smoothstep(0.12, 0.16, r));
    m = max(m, line(abs(p.y) - 9.0, 0.04));
    // penalty boxes
    vec2 q = vec2(abs(p.x) - 14.0, p.y);
    m = max(m, line(q.x + 3.0, 0.035) * step(abs(q.y), 5.5));
    m = max(m, line(abs(q.y) - 5.5, 0.035) * step(-3.0, q.x) * step(q.x, 0.0));
    float pulse = 0.75 + 0.25 * sin(uTime * 1.4 - r * 0.45);
    vec3 col = grass + uLine * m * pulse;
    float fade = 1.0 - smoothstep(5.0, 16.0, r);
    gl_FragColor = vec4(col, fade);
  }
`;function xe(t,{reduce:c=!1}={}){const l=new Z({antialias:!0,alpha:!0,powerPreference:"high-performance"});l.setPixelRatio(Math.min(window.devicePixelRatio,1.75)),l.setClearColor(0,0),t.appendChild(l.domElement);const i=new $,o=new ee(32,1,.1,100);o.position.set(0,2.2,11);const g=new A("#e2ad45"),H=new A("#ffd98a"),y=new C(new te(1.35,96,64),new N({vertexShader:pe,fragmentShader:fe,uniforms:{uDirs:{value:ve()},uRimA:{value:g},uRimB:{value:H}}})),m=new ne;m.add(y),i.add(m);const R=new N({vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:ue,transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uLine:{value:new A("#f0cd7d").multiplyScalar(.5)}}}),f=new C(new X(36,36),R);f.rotation.x=-Math.PI/2,f.rotation.z=Math.PI/2.4,f.position.y=-1.9,i.add(f);const K=(()=>{const e=document.createElement("canvas");e.width=e.height=128;const n=e.getContext("2d"),s=n.createRadialGradient(64,64,0,64,64,64);return s.addColorStop(0,"rgba(0,0,0,.85)"),s.addColorStop(1,"rgba(0,0,0,0)"),n.fillStyle=s,n.fillRect(0,0,128,128),new oe(e)})(),v=new C(new X(3.4,3.4),new ie({map:K,transparent:!0,depthWrite:!1}));v.rotation.x=-Math.PI/2,v.position.y=-1.88,i.add(v);const V=260,u=new Float32Array(V*3);for(let e=0;e<V;e++)u[e*3]=(Math.random()-.5)*18,u[e*3+1]=Math.random()*7-1.5,u[e*3+2]=(Math.random()-.5)*10-1;const q=new ae;q.setAttribute("position",new re(u,3));const L=new se(q,new le({color:16769696,size:.035,transparent:!0,opacity:.55,depthWrite:!1,blending:ce}));i.add(L);const a=new Y(.004,.009),b=new Y(0,0);let p=!1,r=null,M=0,d=0,k=0;const B=e=>{p=!0,r={x:e.clientX,y:e.clientY,t:performance.now(),moved:0}},E=e=>{const n=t.getBoundingClientRect();if(b.set(((e.clientX-n.left)/n.width-.5)*2,((e.clientY-n.top)/n.height-.5)*2),!p||!r)return;const s=e.clientX-r.x,h=e.clientY-r.y;r.moved+=Math.abs(s)+Math.abs(h),a.set(h*.006,s*.006),r.x=e.clientX,r.y=e.clientY},F=()=>{p&&r&&r.moved<6&&j(),p=!1};function j(){d=.16,a.x+=Math.random()*.3+.15,a.y+=(Math.random()-.5)*.2,M=1}const D=t.parentElement;D.addEventListener("pointerdown",B),window.addEventListener("pointermove",E,{passive:!0}),window.addEventListener("pointerup",F);function G(){const e=t.clientWidth,n=t.clientHeight;l.setSize(e,n,!1),o.aspect=e/n,o.fov=e<900?46:32,o.updateProjectionMatrix()}G();const O=new ResizeObserver(G);O.observe(t);const w=new me,Q=new P(1,0,0),J=new P(0,1,0);let x=0,T=!0,S=!0;const z=new de;function U(){if(!T||(requestAnimationFrame(U),!S))return;const e=Math.min(z.getDelta(),.05),n=z.elapsedTime;R.uniforms.uTime.value=n,p||(a.x+=(.004-a.x)*.02,a.y+=(.009-a.y)*.02);const s=c?.25:1;w.setFromAxisAngle(Q,a.x*s),y.quaternion.premultiply(w),w.setFromAxisAngle(J,a.y*s),y.quaternion.premultiply(w),M&&(d-=.6*e,x+=d,x<0&&(x=0,d=-d*.45,Math.abs(d)<.02&&(d=0,M=0)));const h=c?0:Math.sin(n*1.6)*.12;m.position.y=.15+h+x*6-k*1.5,m.position.x=k*2.2;const I=m.position.y+1.9;v.scale.setScalar(_.clamp(1.25-I*.12,.3,1.2)),v.material.opacity=_.clamp(1-I*.18,.15,.9),v.position.x=m.position.x,L.rotation.y=n*.02,o.position.x+=(b.x*.6-o.position.x)*.04,o.position.y+=(2.2-b.y*.35-o.position.y)*.04,o.lookAt(0,0,0),l.render(i,o)}U();const W=new IntersectionObserver(([e])=>{S=e.isIntersecting,S&&z.getDelta()});return W.observe(t),{kick:j,setScroll(e){k=e},dispose(){T=!1,O.disconnect(),W.disconnect(),D.removeEventListener("pointerdown",B),window.removeEventListener("pointermove",E),window.removeEventListener("pointerup",F),l.dispose()}}}export{xe as createStage};
