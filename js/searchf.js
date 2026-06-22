// Cliente JS para buscar en los JSON de partidos
// Busca por equipo, jugador, ciudad, estadio, árbitro o entrenador

const SEASONS = ['2526','2425','2324'];
const RESULTS_PER_PAGE = 10;

function pad(n){ return n.toString().padStart(2,'0'); }

async function fetchJsonSafe(path){
    try{
        const res = await fetch(path);
        if (!res.ok) return null;
        return await res.json();
    }catch(e){
        return null;
    }
}

function matchesQuery(json, q, field){
    // Si la consulta es vacía, considerar que coincide (para permitir listar todo)
    if(!q) return true;
    q = q.toLowerCase();
    function has(s){ return s && s.toString().toLowerCase().indexOf(q) !== -1; }

    // Comprobar campos solicitados
    if(field === 'equipo'){
        if(has(json.local && json.local.nombre) || has(json.visitante && json.visitante.nombre)) return true;
    }
    if(field === 'jugador'){
        const arr = [].concat(json.titularesLocal||[], json.suplentesLocal||[], json.titularesVisitante||[], json.suplentesVisitante||[]);
        for(const p of arr) if(has(p.nombre)) return true;
    }
    if(field === 'ciudad'){
        if(has(json.estadio && json.estadio.ciudad)) return true;
    }
    if(field === 'estadio'){
        if(has(json.estadio && json.estadio.nombre)) return true;
    }
    if(field === 'arbitro'){
        if(has(json.arbitro)) return true;
    }
    if(field === 'entrenador'){
        if(has(json.local && json.local.entrenador) || has(json.visitante && json.visitante.entrenador)) return true;
    }
    return false;
}

async function searchAll(query, field, seasonFilter){
    const found = [];
    const tried = new Set();
    const tasks = [];

    for(const s of SEASONS){
        if(seasonFilter && seasonFilter !== 'all' && s !== seasonFilter) continue;
        // archivos comunes por temporada
        const base = `partidos/${s}/`;
        const candidates = [];
        // archivos "paginas" de liga
        candidates.push(`${s}_liga.json`);
        for(let i=1;i<=38;i++) candidates.push(`${s}_ligaf_${pad(i)}.json`);
        // champions
        candidates.push(`${s}_cham.json`);
        for(let i=1;i<=14;i++) candidates.push(`${s}_chamf_${pad(i)}.json`);
        // copa
        candidates.push(`${s}_copa.json`);
        for(let i=1;i<=10;i++) candidates.push(`${s}_copaf_${i}.json`);        
        // supercopa
        candidates.push(`${s}_sces.json`);
        for(let i=1;i<=5;i++) candidates.push(`${s}_scesf_${i}.json`);        
        candidates.push(`${s}_indexf.json`);

        for(const fn of candidates){            
            if(tried.has(fn)) continue;
            tried.add(fn);
            const path = base + fn;
            tasks.push((async ()=>{
                const json = await fetchJsonSafe(path);
                if(json && matchesQuery(json, query, field)){
                    // construir objeto de resultado
                    const id = fn.replace('.json','');
                    found.push({
                        titulo: json.titulo,
                        resultado: (json.local && json.local.nombre + ' ' + json.local.goles + ' - ' + json.visitante.goles + ' ' + json.visitante.nombre),
                        estadio: (json.estadio && json.estadio.nombre) || '',
                        ciudad: (json.estadio && json.estadio.ciudad) || '',
                        enlace: `partido.html?cod=${s}_${fn.replace('.json','').split('_').slice(1).join('_')}` // fallback
                    });
                }
            })());
        }
    }

    // Limitar concurrencia: await all tasks but they are many; Promise.allSettled
    await Promise.allSettled(tasks);
    return found;
}

function renderResults(results, page){
    const body = document.getElementById('modalBody');
    const pag = document.getElementById('modalPagination');
    const title = document.getElementById('modalTitle');
    body.innerHTML = '';
    pag.innerHTML = '';
    const overlay = document.getElementById('searchModal');

    title.textContent = `Resultados de búsqueda (${results.length})`;

    if(results.length === 0){ body.innerHTML = '<p>No se encontraron partidos.</p>'; overlay.classList.add('show'); return; }

    const start = (page-1)*RESULTS_PER_PAGE;
    const end = Math.min(results.length, start + RESULTS_PER_PAGE);
    const list = document.createElement('ul');
    for(let i=start;i<end;i++){
        const r = results[i];
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = r.enlace || `partido.html?cod=${r.temporada}_${i}`;
        a.className = 'linkPartido';
        a.textContent = `${r.resultado}`;
        a.target = '_blank';
        li.appendChild(a);
        const meta = document.createElement('div');
        meta.className = 'modal-meta';
        meta.innerHTML = `<span class="azul">${r.titulo}</span> · ${r.estadio ? r.estadio + ' · ' : ''}${r.ciudad ? r.ciudad : ''}`;
        li.appendChild(meta);
        list.appendChild(li);
    }
    body.appendChild(list);

    // paginación
    const pages = Math.ceil(results.length/RESULTS_PER_PAGE);
    for(let p=1;p<=pages;p++){
        const btn = document.createElement('button');
        btn.textContent = p;
        btn.className = 'btn';
        if(p===page) { btn.classList.add('btn-primary'); btn.disabled = true; }
        btn.addEventListener('click', ()=> renderResults(results, p));
        pag.appendChild(btn);
    }

    overlay.classList.add('show');
}

// Inicialización UI
document.addEventListener('DOMContentLoaded', ()=>{
    const btn = document.getElementById('btnSearch');
    const input = document.getElementById('searchQuery');
    const field = document.getElementById('searchField');
    const season = document.getElementById('searchSeason');
    const overlay = document.getElementById('searchModal');
    const btnClose = document.getElementById('modalClose');

    btn.addEventListener('click', async ()=>{
        btn.disabled = true;
        btn.textContent = 'Buscando...';
        const q = input.value.trim();
        const f = field.value;
        const s = season.value;
        try{
            const results = await searchAll(q, f, s);
            // ordenar por fecha si existe
            renderResults(results, 1);
        }catch(e){
            const body = document.getElementById('modalBody');
            body.innerHTML = '<p>Error en la búsqueda.</p>';
            overlay.classList.add('show');
        }finally{
            btn.disabled = false;
            btn.textContent = 'Buscar';
        }
    });

    btnClose.addEventListener('click', ()=> overlay.classList.remove('show'));
    overlay.addEventListener('click', (ev)=>{
        if(ev.target === overlay) overlay.classList.remove('show');
    });

    // Enter key on input triggers search
    input.addEventListener('keydown', (e)=>{ if(e.key === 'Enter'){ e.preventDefault(); btn.click(); } });
});
