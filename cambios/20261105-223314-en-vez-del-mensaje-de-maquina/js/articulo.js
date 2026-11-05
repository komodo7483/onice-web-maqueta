/* Ficha de artículo (articulo.html?ref=). Todo sale de datos.js. */
(function(){
  var O=window.Onice,D=window.Datos;
  var $=function(s){return document.querySelector(s);};
  function titulo(t,desc){document.title=t+' · Onice (maqueta)';var m=document.querySelector('meta[name=description]');if(m&&desc)m.setAttribute('content',desc);}
  function acc(){return O.telLink().replace('<a ','<a class="btn" ');}
  function error(el){el.innerHTML='<div class="estado estado--error"><h2>No hemos podido cargar el catálogo</h2><p>Prueba a recargar la página. Mientras tanto, puedes llamarnos o escribirnos.</p><div class="acciones">'+acc()+O.mailLink().replace('<a ','<a class="btn btn--sec" ')+'</div></div>';}
  function noExiste(el){
    el.innerHTML='<div class="estado"><h1>Ese artículo no existe</h1><p>Puede que la referencia esté mal escrita o que no esté en el catálogo. Búscala o llámanos.</p><div data-slot="buscador-grande"></div><div class="acciones"><a class="btn btn--sec" href="categorias.html">Ver categorías</a></div></div><div style="margin-top:28px" data-slot="contacto"></div>';
    O.iniciar();
  }
  function iniciar(){
    var el=$('#ficha'),ref=new URLSearchParams(location.search).get('ref')||'';
    D.cargar().then(function(d){
      var a=d.articulos.filter(function(x){return x.ref===ref;})[0];
      var fam=a&&D.familia(d,a.familia),sub=fam&&fam.subfamilias.filter(function(s){return s.id===a.subfamilia;})[0];
      if(!a){titulo('Artículo no encontrado');$('#migas').innerHTML=O.migas([['Inicio','index.html'],['Artículo no encontrado']]);noExiste(el);return;}
      titulo(a.ref+' · '+a.nombre,a.descripcion);
      $('#migas').innerHTML=O.migas([['Inicio','index.html'],[a._familia,'familia.html?f='+a.familia],[a._subfamilia,'listado.html?f='+a.familia+'&s='+a.subfamilia],[a.ref]]);
      var esp=Object.keys(a.especificaciones||{}).map(function(k){return '<tr><th scope="row">'+O.esc(k)+'</th><td>'+O.esc(a.especificaciones[k])+'</td></tr>';}).join('');
      var rel=d.articulos.filter(function(x){return x.subfamilia===a.subfamilia&&x.familia===a.familia&&x.ref!==a.ref;}).slice(0,4);
      var asunto='Consulta sobre la referencia '+a.ref;
      el.innerHTML='<div class="ficha"><div class="marcador" role="img" aria-label="Imagen de ejemplo: '+O.esc(a.nombre)+'">Imagen de ejemplo</div>'+
        '<div><h1>'+O.esc(a.nombre)+'</h1><p class="meta"><span>Fabricante: <strong>'+O.esc(a._fabricante)+'</strong></span><span>Referencia: <span class="mono">'+O.esc(a.ref)+'</span></span></p>'+
        (esp?'<table class="tabla-tec"><caption class="solo-lectores">Datos técnicos</caption><tbody>'+esp+'</tbody></table>':'')+'</div>'+
        '<aside class="caja-consulta" aria-labelledby="t-consulta"><h2 id="t-consulta">¿Es esta pieza o necesitas una alternativa?</h2><p>Cuéntanos qué máquina es y te decimos si te sirve o qué otras opciones hay.</p>'+acc()+O.mailLink('Enviar correo',asunto).replace('<a ','<a class="btn btn--sec" ')+'</aside></div>'+
        '<section class="seccion" style="padding-top:8px"><div class="texto-largo"><h2>Descripción</h2><p>'+O.esc(a.descripcion)+'</p></div></section>'+
        (rel.length?'<section class="seccion" style="padding-top:8px"><h2>Artículos relacionados</h2><div class="rejilla rejilla--4">'+rel.map(function(x){return '<a class="tarjeta" href="articulo.html?ref='+encodeURIComponent(x.ref)+'"><div class="cuerpo"><span class="mono">'+O.esc(x.ref)+'</span><h3>'+O.esc(x.nombre)+'</h3><p>'+O.esc(x._fabricante)+'</p><span class="mas">Ver ficha →</span></div></a>';}).join('')+'</div></section>':'')+
        '<div data-slot="contacto" style="margin-top:12px"></div>';
      O.iniciar();
    }).catch(function(){error(el);});
  }
  window.Articulo={iniciar:iniciar};
})();
