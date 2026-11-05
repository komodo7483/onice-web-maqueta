/* Portada: tren de engranajes encajados. Cada engranaje es una familia y lleva a ella. */
(function(){
  var NS='http://www.w3.org/2000/svg',M=12;                 /* módulo: radio primitivo = M·dientes/2 */
  var DIENTES=[24,18,15,14];                                 /* de mayor a menor familia */
  var ANGULOS=[-38,24,42];                                   /* dirección de cada eslabón de la cadena (grados) */
  function el(n,a,p){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
  function rad(g){return g*Math.PI/180;}
  function camino(N){                                         /* contorno del engranaje con dientes trapezoidales */
    var r=M*N/2,rr=r-1.25*M,ro=r+M,p=360/N,d='';
    function pt(R,a){return (R*Math.cos(rad(a))).toFixed(2)+' '+(R*Math.sin(rad(a))).toFixed(2);}
    for(var k=0;k<N;k++){
      var c=k*p;
      d+=(k?'A '+rr+' '+rr+' 0 0 1 ':'M ')+pt(rr,c-.32*p)+' L '+pt(ro,c-.10*p)+' L '+pt(ro,c+.10*p)+' L '+pt(rr,c+.32*p)+' ';
    }
    return d+'A '+rr+' '+rr+' 0 0 1 '+pt(rr,-.32*p)+' Z';
  }
  function pintar(host,d){
    host.className='mecanismo';
    host.innerHTML='';
    var fam=d.familias.slice(0,4),n=fam.length;
    /* posiciones y fases para que los dientes encajen */
    var G=[],i;
    for(i=0;i<n;i++)G.push({N:DIENTES[i],r:M*DIENTES[i]/2,p:360/DIENTES[i],x:0,y:0,fase:0});
    for(i=1;i<n;i++){
      var a=G[i-1],b=G[i],t=ANGULOS[i-1],dist=a.r+b.r;
      b.x=a.x+dist*Math.cos(rad(t));b.y=a.y+dist*Math.sin(rad(t));
      if(i===1){a.fase=t;}                                   /* diente de a justo en el contacto */
      var fa=(((t-a.fase)/a.p)%1+1)%1;                       /* fracción de a en el contacto */
      var fb=((0.5-fa)%1+1)%1;
      b.fase=t+180-b.p*fb;
    }
    var x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
    G.forEach(function(g){var R=g.r+M;x0=Math.min(x0,g.x-R);y0=Math.min(y0,g.y-R);x1=Math.max(x1,g.x+R);y1=Math.max(y1,g.y+R);});
    var pad=26;
    var svg=el('svg',{viewBox:(x0-pad)+' '+(y0-pad)+' '+(x1-x0+2*pad)+' '+(y1-y0+2*pad),role:'group','aria-label':'Familias de producto'},null);
    var info=document.createElement('p');info.className='mecanismo-info';info.setAttribute('aria-live','polite');
    var base='Elige una familia: toca o pasa el ratón por un engranaje.';info.textContent=base;
    var rot=[];
    fam.forEach(function(f,k){
      var g=G[k],a=el('a',{href:'familia.html?f='+f.id,'class':'engranaje','aria-label':f.nombre+', '+f.subfamilias.length+' subfamilias'},svg);
      var giro=el('g',{transform:'translate('+g.x+' '+g.y+')'},a);
      var cuerpo=el('g',{},giro);
      el('path',{d:camino(g.N),'class':'diente',transform:'rotate('+g.fase+')'},cuerpo);
      var radios=el('g',{transform:'rotate('+g.fase+')','class':'radios'},cuerpo);
      for(var s=0;s<6;s++)el('line',{x1:g.r*.80,y1:0,x2:g.r*.97-M*1.25,y2:0,transform:'rotate('+(s*60)+')'},radios);
      el('circle',{r:g.r*.80,'class':'aro'},giro);
      var tx=el('text',{'class':'nombre','text-anchor':'middle',y:2},giro);tx.textContent=f.nombre;
      var tc=el('text',{'class':'cuenta','text-anchor':'middle',y:22},giro);tc.textContent=f.subfamilias.length+' subfamilias';
      rot.push({nodo:cuerpo,g:g,sentido:k%2?-1:1});
      var quita=function(){info.textContent=base;a.classList.remove('activo');turbo=1;};
      var pon=function(){info.textContent=f.nombre+': '+f.resumen;a.classList.add('activo');turbo=5;};
      a.addEventListener('mouseenter',pon);a.addEventListener('mouseleave',quita);a.addEventListener('focus',pon);a.addEventListener('blur',quita);
    });
    host.appendChild(svg);host.appendChild(info);
    /* giro: velocidad inversamente proporcional a los dientes; se acelera al señalar y al hacer scroll */
    var turbo=1,vel=1,ang=0,ult=performance.now(),sy=window.scrollY;
    var quieto=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    function pasa(t){
      var dt=Math.min(.05,(t-ult)/1000);ult=t;
      vel+= (turbo-vel)*Math.min(1,dt*4);
      var ny=window.scrollY;ang+=(ny-sy)*.25;sy=ny;
      ang+=dt*7*vel;
      rot.forEach(function(r){var a=ang*(G[0].N/r.g.N)*r.sentido;r.nodo.setAttribute('transform','rotate('+a.toFixed(2)+')');});
      requestAnimationFrame(pasa);
    }
    if(!quieto)requestAnimationFrame(pasa);
  }
  window.Mecanismo={pintar:pintar};
})();
