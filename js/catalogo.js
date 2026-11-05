/* Páginas de catálogo: portada, familia y listado/buscador. Todo sale de datos.js. */
(function(){
  var O=window.Onice,D=window.Datos,PAG=25;
  var $=function(s){return document.querySelector(s);};
  function params(){var u=new URLSearchParams(location.search),p={};['f','s','m','q','o','p'].forEach(function(k){p[k]=u.get(k)||'';});return p;}
  function url(base,p){var u=new URLSearchParams();Object.keys(p).forEach(function(k){if(p[k]&&!(k==='p'&&p[k]==1)&&!(k==='o'&&p[k]==='ref-asc'))u.set(k,p[k]);});var s=u.toString();return base+(s?'?'+s:'');}
  function copia(p,c){var n={};Object.keys(p).forEach(function(k){n[k]=p[k];});Object.keys(c||{}).forEach(function(k){n[k]=c[k];});return n;}
  function titulo(t,desc){document.title=t+' · Onice (maqueta)';var m=document.querySelector('meta[name=description]');if(m&&desc)m.setAttribute('content',desc);}
  function error(el){el.innerHTML='<div class="estado estado--error"><h2>No hemos podido cargar el catálogo</h2><p>Prueba a recargar la página. Mientras tanto, puedes llamarnos o escribirnos.</p><div class="acciones">'+O.telLink().replace('<a ','<a class="btn" ')+O.mailLink().replace('<a ','<a class="btn btn--sec" ')+'</div></div>';}
  function noExiste(el,que){el.innerHTML='<div class="estado"><h2>'+que+' no existe</h2><p>Puede que el enlace esté mal o que ya no esté en el catálogo. Busca por referencia o llámanos.</p><div class="acciones"><a class="btn" href="categorias.html">Ver categorías</a>'+O.telLink().replace('<a ','<a class="btn btn--sec" ')+'</div></div>';}
  function resaltar(t,q){
    var s=O.esc(t);if(!q)return s;
    D.norm(q).split(/\s+/).filter(function(w){return w.length>1;}).forEach(function(w){
      var n=D.norm(s),i=n.indexOf(w);if(i<0)return;
      if(D.norm(s).length!==s.length)return; /* si la normalización cambia longitud, no resaltar */
      s=s.slice(0,i)+'<mark>'+s.slice(i,i+w.length)+'</mark>'+s.slice(i+w.length);});
    return s;
  }
  function sinDatos(){return '<p class="cargando" role="status">Cargando…</p>';}

  /* ---------- Portada ---------- */
  function portada(){
    var f=$('#familias'),c=$('#casos'),m=$('#fabricantes');
    [f,m].forEach(function(e){e.innerHTML=sinDatos();});
    D.cargar().then(function(d){
      window.Mecanismo.pintar(f,d);
      if(c)pintarCasos(c,d);pintarFabricantes(m,d);
    }).catch(function(){[f,m].forEach(error);});
  }
  function pintarCasos(c,d){
    c.className='rejilla rejilla--3';
    c.innerHTML=d.casos.map(function(x){return '<article class="tarjeta tarjeta--caso"><div class="cuerpo"><h3>'+O.esc(x.titulo)+'</h3><dl><dt>Problema</dt><dd>'+O.esc(x.problema)+'</dd><dt>Opciones</dt><dd>'+O.esc(x.opciones)+'</dd></dl><p class="resultado">'+O.esc(x.resultado)+'</p></div></article>';}).join('');
  }
  function pintarFabricantes(m,d){
    m.className='fabricantes';
    m.innerHTML=d.fabricantes.map(function(x){return '<a class="fabricante" href="listado.html?m='+x.id+'">'+O.esc(x.nombre)+'</a>';}).join('');
  }
  function simple(id,fn){
    var el=$(id);el.innerHTML=sinDatos();
    D.cargar().then(function(d){fn(el,d);}).catch(function(){error(el);});
  }
  function categorias(){
    simple('#categorias',function(el,d){
      el.innerHTML=d.familias.map(function(f){return '<section class="seccion-fam"><div class="titulo-seccion"><h2><a href="familia.html?f='+f.id+'">'+O.esc(f.nombre)+'</a></h2><a href="listado.html?f='+f.id+'">Ver todos los artículos →</a></div><p class="texto-largo">'+O.esc(f.resumen)+'</p><div class="chips">'+f.subfamilias.map(function(s){return '<a class="chip" href="listado.html?f='+f.id+'&amp;s='+s.id+'">'+O.esc(s.nombre)+'</a>';}).join('')+'</div></section>';}).join('');
    });
  }
  function casos(){simple('#casos',pintarCasos);}
  function fabricantes(){simple('#fabricantes',pintarFabricantes);}

  /* ---------- Familia ---------- */
  function familia(){
    var p=params(),cont=$('#contenido-dinamico');cont.innerHTML=sinDatos();
    D.cargar().then(function(d){
      var fam=D.familia(d,p.f);
      if(!fam){titulo('Familia no encontrada');$('#migas').innerHTML=O.migas([['Inicio','index.html'],['Familia no encontrada']]);noExiste(cont,'Esa familia');return;}
      titulo(fam.nombre,fam.resumen);
      $('#migas').innerHTML=O.migas([['Inicio','index.html'],['Categorías','categorias.html'],[fam.nombre]]);
      $('#banda').innerHTML='<div class="contenedor"><h1>'+O.esc(fam.nombre)+'</h1><p>'+O.esc(fam.resumen)+'</p></div>';
      var fabs=d.fabricantes.filter(function(x){return x.familias.indexOf(fam.id)>=0;});
      cont.innerHTML='<section class="seccion"><div class="contenedor"><div class="titulo-seccion"><h2>Subfamilias</h2><a href="'+url('listado.html',{f:fam.id})+'">Ver todos los artículos de '+O.esc(fam.nombre)+' →</a></div>'+
        '<div class="rejilla rejilla--3">'+fam.subfamilias.map(function(s){return '<a class="tarjeta" href="'+url('listado.html',{f:fam.id,s:s.id})+'"><div class="marcador" role="img" aria-label="Imagen de ejemplo: '+O.esc(s.nombre)+'">Imagen: '+O.esc(s.nombre)+'</div><div class="cuerpo"><h3>'+O.esc(s.nombre)+'</h3><p>'+O.esc(s.resumen)+'</p><span class="mas">Ver artículos →</span></div></a>';}).join('')+'</div></div></section>'+
        (fabs.length?'<section class="seccion seccion--clara"><div class="contenedor"><div class="titulo-seccion"><h2>Por fabricante</h2><a href="fabricantes.html">Ver todos</a></div><div class="fabricantes">'+fabs.map(function(x){return '<a class="fabricante" href="'+url('listado.html',{f:fam.id,m:x.id})+'">'+O.esc(x.nombre)+'</a>';}).join('')+'</div></div></section>':'')+
        '<section class="seccion"><div class="contenedor"><div data-slot="contacto"></div></div></section>';
      O.iniciar();
    }).catch(function(){error(cont);});
  }

  /* ---------- Listado y buscador ---------- */
  function listado(modoBuscar){
    var cont=$('#resultados'),filt=$('#filtros'),chips=$('#chips'),base=modoBuscar?'buscar.html':'listado.html';
    var p=params(),datos;
    var bf=document.createElement('button');bf.type='button';bf.className='btn-filtros';bf.setAttribute('aria-expanded','false');bf.setAttribute('aria-controls','filtros');bf.textContent='Filtros';
    filt.parentNode.insertBefore(bf,filt);
    bf.addEventListener('click',function(){var ab=filt.classList.toggle('abierto');bf.setAttribute('aria-expanded',ab);});
    cont.innerHTML=sinDatos();
    function pintar(){
      var fam=p.f?D.familia(datos,p.f):null;
      if(p.f&&!fam){$('#migas').innerHTML=O.migas([['Inicio','index.html'],['Familia no encontrada']]);titulo('Familia no encontrada');$('#intro').innerHTML='';filt.innerHTML='';chips.innerHTML='';noExiste(cont,'Esa familia');return;}
      var sub=fam&&p.s?fam.subfamilias.filter(function(x){return x.id===p.s;})[0]:null;
      if(p.s&&!sub){$('#migas').innerHTML=O.migas([['Inicio','index.html'],[fam.nombre,'familia.html?f='+fam.id],['Subfamilia no encontrada']]);titulo('Subfamilia no encontrada');$('#intro').innerHTML='';filt.innerHTML='';chips.innerHTML='';noExiste(cont,'Esa subfamilia');return;}
      var fabr=p.m?D.fabricante(datos,p.m):null;
      /* migas, título y texto */
      var mi=[['Inicio','index.html']];
      if(modoBuscar)mi.push(['Buscar']);
      else{mi.push(['Categorías','categorias.html']);
        if(fam){mi.push(sub?[fam.nombre,'familia.html?f='+fam.id]:[fam.nombre]);if(sub)mi.push([sub.nombre]);}
        else if(fabr)mi.push(['Fabricantes','fabricantes.html'],[fabr.nombre]);else mi.push(['Todos los artículos']);}
      $('#migas').innerHTML=O.migas(mi);
      var tit=modoBuscar?(p.q?'Resultados para «'+p.q+'»':'Buscar'):(sub?sub.nombre:fam?fam.nombre:fabr?'Artículos de '+fabr.nombre:'Todos los artículos');
      var txt=sub?sub.resumen:fam?fam.resumen:fabr?'Artículos de ejemplo del fabricante '+fabr.nombre+'.':'Busca por referencia, nombre, fabricante o familia.';
      titulo(tit,txt);
      $('#intro').innerHTML='<h1>'+O.esc(tit)+'</h1><p>'+O.esc(txt)+'</p>';
      /* filtros */
      var fams=datos.familias.map(function(x){return '<option value="'+x.id+'"'+(x.id===p.f?' selected':'')+'>'+O.esc(x.nombre)+'</option>';}).join('');
      var subs=fam?fam.subfamilias.map(function(x){return '<option value="'+x.id+'"'+(x.id===p.s?' selected':'')+'>'+O.esc(x.nombre)+'</option>';}).join(''):'';
      var fbs=datos.fabricantes.filter(function(x){return !p.f||x.familias.indexOf(p.f)>=0;}).map(function(x){return '<option value="'+x.id+'"'+(x.id===p.m?' selected':'')+'>'+O.esc(x.nombre)+'</option>';}).join('');
      if(!filt.dataset.listo||filt.dataset.clave!==p.f){
        filt.dataset.listo=1;filt.dataset.clave=p.f;
        filt.innerHTML='<h2>Filtros</h2>'+
          '<label class="campo">Palabra clave<input type="search" id="f-q" value="'+O.esc(p.q)+'" autocomplete="off"></label>'+
          '<label class="campo">Familia<select id="f-f"><option value="">Todas</option>'+fams+'</select></label>'+
          '<label class="campo">Subfamilia<select id="f-s"'+(fam?'':' disabled')+'><option value="">'+(fam?'Todas':'Elige una familia')+'</option>'+subs+'</select></label>'+
          '<label class="campo">Fabricante<select id="f-m"><option value="">Todos</option>'+fbs+'</select></label>'+
          '<a class="btn btn--sec" href="'+base+'" id="f-limpiar">Limpiar filtros</a>';
        var ir=function(c){p=copia(p,c);p.p='';history.pushState(null,'',url(base,p));pintar();};
        $('#f-q').addEventListener('input',function(e){clearTimeout(ir.t);var v=e.target.value;ir.t=setTimeout(function(){ir({q:v});},250);});
        $('#f-f').addEventListener('change',function(e){ir({f:e.target.value,s:'',m:''});});
        $('#f-s').addEventListener('change',function(e){ir({s:e.target.value});});
        $('#f-m').addEventListener('change',function(e){ir({m:e.target.value});});
        $('#f-limpiar').addEventListener('click',function(e){e.preventDefault();p={f:'',s:'',m:'',q:'',o:'',p:''};filt.dataset.listo='';history.pushState(null,'',base);pintar();});
      } else {
        $('#f-s').value=p.s;$('#f-m').value=p.m;
      }
      /* botones de subfamilia */
      chips.innerHTML=fam?fam.subfamilias.map(function(x){return '<a class="chip" href="'+url(base,copia(p,{s:x.id,p:''}))+'"'+(x.id===p.s?' aria-current="true"':'')+'>'+O.esc(x.nombre)+'</a>';}).join(''):'';
      /* datos */
      var r=D.buscar(datos,p),total=r.length,paginas=Math.max(1,Math.ceil(total/PAG));
      var pg=Math.min(Math.max(parseInt(p.p,10)||1,1),paginas),ini=(pg-1)*PAG,vis=r.slice(ini,ini+PAG);
      if(!total){
        cont.innerHTML='<div class="estado"><h2>Muchas piezas no salen en el catálogo. Llámanos o escríbenos</h2><p>No hay artículos que coincidan con tu búsqueda. Dinos qué necesitas y lo buscamos.</p><div class="acciones">'+O.telLink().replace('<a ','<a class="btn" ')+O.mailLink().replace('<a ','<a class="btn btn--sec" ')+'<a class="btn btn--sec" href="'+base+'" data-limpiar>Limpiar filtros</a></div></div>';
        cont.querySelector('[data-limpiar]').addEventListener('click',function(e){e.preventDefault();p={f:'',s:'',m:'',q:'',o:'',p:''};filt.dataset.listo='';history.pushState(null,'',base);pintar();});
        return;
      }
      var ord=p.o||'ref-asc',opts=[['ref-asc','Referencia (A-Z)'],['ref-desc','Referencia (Z-A)'],['nombre-asc','Artículo (A-Z)'],['nombre-desc','Artículo (Z-A)'],['fabricante-asc','Fabricante (A-Z)'],['fabricante-desc','Fabricante (Z-A)']];
      var filas=vis.map(function(a){var h='articulo.html?ref='+encodeURIComponent(a.ref);
        return '<tr data-href="'+h+'"><td class="ref"><a href="'+h+'">'+resaltar(a.ref,p.q)+'</a></td><td data-label="Artículo">'+resaltar(a.nombre,p.q)+'</td><td data-label="Fabricante">'+O.esc(a._fabricante)+'</td><td data-label="Familia">'+O.esc(a._familia)+'</td><td class="ver"><a href="'+h+'" aria-label="Ver ficha de '+O.esc(a.ref)+'">Ver ficha →</a></td></tr>';}).join('');
      var nav='';
      if(paginas>1){nav='<nav class="paginacion" aria-label="Paginación">';
        if(pg>1)nav+='<a href="'+url(base,copia(p,{p:pg-1}))+'" data-p="'+(pg-1)+'" aria-label="Página anterior">‹</a>';
        for(var i=1;i<=paginas;i++)nav+=i===pg?'<span aria-current="page">'+i+'</span>':'<a href="'+url(base,copia(p,{p:i}))+'" data-p="'+i+'">'+i+'</a>';
        if(pg<paginas)nav+='<a href="'+url(base,copia(p,{p:pg+1}))+'" data-p="'+(pg+1)+'" aria-label="Página siguiente">›</a>';
        nav+='</nav>';}
      cont.innerHTML='<div class="barra-res"><span role="status">Mostrando '+(ini+1)+'-'+(ini+vis.length)+' de '+total+'</span><label class="campo">Ordenar por <select id="f-o">'+opts.map(function(o){return '<option value="'+o[0]+'"'+(o[0]===ord?' selected':'')+'>'+o[1]+'</option>';}).join('')+'</select></label></div>'+
        '<div class="tabla-caja"><table class="tabla-art"><thead><tr><th scope="col">Referencia</th><th scope="col">Artículo</th><th scope="col">Fabricante</th><th scope="col">Familia</th><th scope="col"><span class="solo-lectores">Ficha</span></th></tr></thead><tbody>'+filas+'</tbody></table></div>'+nav;
      $('#f-o').addEventListener('change',function(e){p.o=e.target.value;p.p='';history.pushState(null,'',url(base,p));pintar();});
      cont.querySelectorAll('tbody tr').forEach(function(tr){tr.addEventListener('click',function(e){if(e.target.closest('a'))return;location.href=tr.dataset.href;});});
      cont.querySelectorAll('.paginacion a').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();p.p=a.dataset.p;history.pushState(null,'',url(base,p));pintar();window.scrollTo(0,0);});});
    }
    D.cargar().then(function(d){datos=d;pintar();window.addEventListener('popstate',function(){p=params();filt.dataset.listo='';pintar();});}).catch(function(){filt.innerHTML='';error(cont);});
  }
  window.Catalogo={categorias:categorias,casos:casos,fabricantes:fabricantes,portada:portada,familia:familia,listado:function(){listado(false);},buscar:function(){listado(true);}};
})();
