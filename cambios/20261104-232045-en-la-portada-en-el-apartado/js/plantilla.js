/* Cabecera, pie y contacto: se definen aquí y solo aquí. */
(function(){
  var CONTACTO={
    telefono:'639 965 693',
    telefonoEnlace:'+34639965693',
    correo:'onice@onicom.es',
    direccion:'Calle Este, Nº 4, Bajo Izquierda, La Chana, 18015 Granada',
    horario:'[por confirmar]',
    lema:'Detectamos. Controlamos. Actuamos.',
    nombreFormal:'Suministros Industriales Onice'
  };
  var MENU=[['Categorías','categorias.html'],['Fabricantes','fabricantes.html'],['Casos','casos.html'],['Quiénes somos','quienes-somos.html'],['Contacto','contacto.html']];
  var I={
    lupa:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>',
    tel:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z"/></svg>',
    mail:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    menu:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>'
  };
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function telLink(txt){return '<a href="tel:'+CONTACTO.telefonoEnlace+'">'+I.tel+'<span>'+(txt||CONTACTO.telefono)+'</span></a>';}
  function mailLink(txt,asunto){return '<a href="mailto:'+CONTACTO.correo+(asunto?'?subject='+encodeURIComponent(asunto):'')+'">'+I.mail+'<span>'+(txt||CONTACTO.correo)+'</span></a>';}
  function buscador(grande,etq){
    return '<div class="buscador'+(grande?' buscador--grande':'')+'" role="search">'+
      '<input type="search" autocomplete="off" aria-label="'+esc(etq||'Buscar por palabra clave o referencia')+'" placeholder="Buscar por palabra clave o referencia" data-buscador>'+
      '<button type="button" aria-label="Buscar" data-buscar-btn>'+I.lupa+'</button></div>';
  }
  function cabecera(){
    var act=(location.pathname.split('/').pop()||'index.html');
    var nav=MENU.map(function(m){return '<li><a href="'+m[1]+'"'+(m[1]===act?' aria-current="page"':'')+'>'+m[0]+'</a></li>';}).join('');
    return '<a class="salto" href="#contenido">Saltar al contenido</a>'+
    '<div class="aviso-maqueta">Maqueta · contenido de ejemplo</div>'+
    '<div class="barra-sup sobre-oscuro"><div class="contenedor"><div class="contacto-sup">'+telLink()+mailLink()+'</div><span class="lema">'+CONTACTO.lema+'</span></div></div>'+
    '<div class="fila-principal"><div class="contenedor">'+
      '<a class="logo-cab" href="index.html" aria-label="Onice, inicio"><img class="completo" src="img/onice-logo-principal.svg" width="132" height="85" alt="Onice"><img class="iso" src="img/onice-isotipo.svg" width="48" height="31" alt="" aria-hidden="true"></a>'+
      '<button class="btn-menu" type="button" aria-expanded="false" aria-controls="menu-prin" data-menu>'+I.menu+'<span>Menú</span></button>'+
      buscador(false)+
      '<a class="tel-fila" href="tel:'+CONTACTO.telefonoEnlace+'" aria-label="Llamar al '+CONTACTO.telefono+'">'+I.tel+CONTACTO.telefono+'</a>'+
    '</div></div>'+
    '<nav class="menu-prin" id="menu-prin" aria-label="Principal"><ul>'+nav+'</ul></nav>';
  }
  function pie(){
    var nav=MENU.map(function(m){return '<li><a href="'+m[1]+'">'+m[0]+'</a></li>';}).join('');
    return '<footer class="pie sobre-oscuro"><div class="contenedor"><div class="pie-rejilla">'+
      '<div><img src="img/onice-logo-blanco.svg" width="150" height="97" alt="Onice"><address><strong>'+CONTACTO.nombreFormal+'</strong><br>'+CONTACTO.direccion+'</address></div>'+
      '<div><h2>Contacto</h2><ul><li>'+telLink()+'</li><li>'+mailLink()+'</li></ul></div>'+
      '<div><h2>Navegación</h2><ul>'+nav+'<li><a href="aviso-legal.html">Aviso legal</a></li></ul></div>'+
    '</div><p class="legal">'+CONTACTO.lema+' · Maqueta con contenido de ejemplo.</p></div></footer>'+
    '<a class="llamar-fijo" href="tel:'+CONTACTO.telefonoEnlace+'">'+I.tel+' Llamar · '+CONTACTO.telefono+'</a>';
  }
  function migas(items){
    return '<nav class="migas" aria-label="Migas de pan"><ol>'+items.map(function(m,i){
      return '<li>'+(i<items.length-1&&m[1]?'<a href="'+m[1]+'">'+esc(m[0])+'</a>':'<span'+(i===items.length-1?' aria-current="page"':'')+'>'+esc(m[0])+'</span>')+'</li>';}).join('')+'</ol></nav>';
  }
  function bloqueContacto(titulo,texto){
    return '<div class="bloque-contacto"><div><h2>'+(titulo||'¿No sabes qué pieza es?')+'</h2><p>'+(texto||'Muchas piezas no salen en el catálogo. Llámanos o escríbenos y te ayudamos a dar con ella.')+'</p></div>'+
      '<div class="acciones"><span class="btn" data-x></span></div></div>';
  }
  function contactoHtml(titulo,texto){
    var h=bloqueContacto(titulo,texto);
    return h.replace('<span class="btn" data-x></span>',
      '<a class="btn" href="tel:'+CONTACTO.telefonoEnlace+'">'+I.tel+' Llamar · '+CONTACTO.telefono+'</a><a class="btn btn--sec" href="mailto:'+CONTACTO.correo+'">'+I.mail+' Enviar correo</a>');
  }
  function irABuscar(q){q=(q||'').trim();location.href='buscar.html'+(q?'?q='+encodeURIComponent(q):'');}
  function iniciar(){
    var c=document.getElementById('cabecera'),p=document.getElementById('pie');
    if(c)c.innerHTML=cabecera();
    if(p)p.innerHTML=pie();
    document.querySelectorAll('[data-slot="buscador-grande"]').forEach(function(e){e.innerHTML=buscador(true,'Buscar por palabra clave o referencia (portada)');});
    document.querySelectorAll('[data-slot="contacto"]').forEach(function(e){e.innerHTML=contactoHtml(e.dataset.titulo,e.dataset.texto);});
    document.querySelectorAll('[data-slot="acciones-contacto"]').forEach(function(e){
      var cl=e.dataset.claro!==undefined;
      e.innerHTML='<a class="btn btn--grande '+(cl?'btn--claro':'')+'" href="tel:'+CONTACTO.telefonoEnlace+'">'+CONTACTO.telefono+'</a><a class="btn '+(cl?'btn--borde-claro':'btn--sec')+'" href="mailto:'+CONTACTO.correo+'">'+I.mail+' '+CONTACTO.correo+'</a>';
    });
    var qs=new URLSearchParams(location.search).get('q');
    document.querySelectorAll('[data-buscador]').forEach(function(i){
      if(qs&&/buscar\.html$/.test(location.pathname)&&!i.closest('[data-slot]'))i.value=qs;
      i.addEventListener('keydown',function(e){if(e.key==='Enter')irABuscar(i.value);});
    });
    document.querySelectorAll('[data-buscar-btn]').forEach(function(b){b.addEventListener('click',function(){irABuscar(b.parentNode.querySelector('input').value);});});
    var mg=document.querySelector('[data-migas]');
    if(mg&&!mg.innerHTML)mg.innerHTML=migas([['Inicio','index.html'],[mg.dataset.migas]]);
    document.querySelectorAll('[data-contacto]').forEach(function(e){
      var k=e.dataset.contacto;
      e.textContent=k==='empresa'?CONTACTO.nombreFormal+' · '+CONTACTO.direccion:CONTACTO[k];
    });
    if(document.querySelector('.fila-principal')&&!window.__cabReducida){
      window.__cabReducida=true;
      var ajustar=function(){
        var r=window.scrollY>140;
        if(r!==document.body.classList.contains('cab-reducida')){document.body.classList.toggle('cab-reducida',r);}
        var f=document.querySelector('.fila-principal');if(f)document.documentElement.style.setProperty('--alto-cab',f.offsetHeight+'px');
      };
      window.addEventListener('scroll',ajustar,{passive:true});window.addEventListener('resize',ajustar);ajustar();
    }
    var bm=document.querySelector('[data-menu]');
    if(bm)bm.addEventListener('click',function(){var m=document.getElementById('menu-prin');var ab=m.classList.toggle('abierto');bm.setAttribute('aria-expanded',ab);});
  }
  window.Onice={contacto:CONTACTO,iconos:I,esc:esc,migas:migas,contactoHtml:contactoHtml,telLink:telLink,mailLink:mailLink,iniciar:iniciar};
  document.addEventListener('DOMContentLoaded',iniciar);
})();
