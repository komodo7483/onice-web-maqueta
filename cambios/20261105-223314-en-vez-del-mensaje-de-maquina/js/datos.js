/* Único punto de acceso a los datos. Para pasar a la base de datos real, se cambia solo este módulo. */
(function(){
  var ficheros=['familias','fabricantes','articulos','casos'];
  var promesa=null;
  function norm(t){return String(t==null?'':t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');}
  function compacto(t){return norm(t).replace(/[^a-z0-9]/g,'');}
  function cargar(){
    if(!promesa){
      promesa=Promise.all(ficheros.map(function(n){
        return fetch('datos/'+n+'.json').then(function(r){if(!r.ok)throw new Error(n+' '+r.status);return r.json();});
      })).then(function(v){
        var d={familias:v[0],fabricantes:v[1],articulos:v[2],casos:v[3]};
        d.articulos.forEach(function(a){
          var f=d.familias.filter(function(x){return x.id===a.familia;})[0]||{};
          var s=(f.subfamilias||[]).filter(function(x){return x.id===a.subfamilia;})[0]||{};
          var m=d.fabricantes.filter(function(x){return x.id===a.fabricante;})[0]||{};
          a._familia=f.nombre||'';a._subfamilia=s.nombre||'';a._fabricante=m.nombre||'';
          a._texto=norm([a.ref,a.nombre,a._fabricante,a._familia,a._subfamilia].join(' '));
          a._ref=compacto(a.ref);
        });
        return d;
      });
    }
    return promesa;
  }
  function buscar(d,p){
    var q=norm(p.q||'').trim(),qc=compacto(p.q||''),palabras=q?q.split(/\s+/):[];
    var r=d.articulos.filter(function(a){
      if(p.f&&a.familia!==p.f)return false;
      if(p.s&&a.subfamilia!==p.s)return false;
      if(p.m&&a.fabricante!==p.m)return false;
      if(!palabras.length)return true;
      return palabras.every(function(w){return a._texto.indexOf(w)>=0||(compacto(w)&&a._ref.indexOf(compacto(w))>=0);})
        ||(qc.length>=2&&a._ref.indexOf(qc)>=0);
    });
    var campo={ref:'ref',nombre:'nombre',fabricante:'_fabricante'}[(p.o||'ref-asc').split('-')[0]]||'ref';
    var dir=(p.o||'').split('-')[1]==='desc'?-1:1;
    r.sort(function(a,b){return dir*String(a[campo]).localeCompare(String(b[campo]),'es',{numeric:true});});
    return r;
  }
  window.Datos={cargar:cargar,buscar:buscar,norm:norm,
    familia:function(d,id){return d.familias.filter(function(f){return f.id===id;})[0];},
    fabricante:function(d,id){return d.fabricantes.filter(function(f){return f.id===id;})[0];}};
})();
