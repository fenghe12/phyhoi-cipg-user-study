// Source-level event simulation only. This does not perform browser acceptance.
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),path=require('path');
const root=path.resolve(__dirname,'..');
const read=n=>fs.readFileSync(path.join(root,n),'utf8');
const cases=vm.runInNewContext(read('holistic_data.js')+';HOLISTIC_CASES');
const manifest=JSON.parse(read('data/samples.json')).samples;
const allocation=JSON.parse(read('data/holistic_allocation.json'));
assert.equal(cases.length,300);assert.equal(new Set(cases.map(x=>x.sample_id)).size,300);assert.equal(new Set(cases.map(x=>x.media_id)).size,300);
const forbidden=String.fromCodePoint(0x8bc1,0x636e);
for(let i=0;i<300;i++){
 const c=cases[i],m=manifest.find(x=>x.sample_id===c.sample_id);
 assert.equal(c.sample_id,`P${String(i+1).padStart(3,'0')}`);assert.equal(c.media_id,m.media_id);assert.equal(c.video,m.video);
 assert.ok(fs.existsSync(path.join(root,c.video)));assert.ok(fs.existsSync(path.join(root,'study_work/all_frames',c.media_id+'.jpg')));
 assert.deepEqual(Object.keys(c).sort(),['sample_id','media_id','source_task_id','video','content_version','languages','zh','en','ja'].sort());
 for(const l of ['zh','en','ja']){
  for(const k of ['title','question','body','contact','object','aftermath','unknown'])assert.ok(typeof c[l][k]==='string'&&c[l][k].trim(),`${c.sample_id} ${l} ${k}`);
  assert.ok(c[l].instruction1&&c[l].instruction1.includes(c[l].title));assert.equal(c[l].instructions.length,6);assert.equal(c[l].instructions[0].text,c[l].instruction1);assert.deepEqual(Array.from(c[l].instructions,x=>x.section),['task','body','contact','object','aftermath','decision']);assert.ok(c[l].instructions.every(x=>typeof x.text==='string'&&x.text.trim().length>0));assert.equal(c[l].scores.length,5);assert.ok(c[l].scores.every(s=>typeof s==='string'&&s.length>15));assert.equal(new Set(c[l].scores).size,5);
 }
 assert.ok(!JSON.stringify(c).includes(forbidden));
}
const sources=JSON.parse(read('study_work/内容来源记录.json'));assert.equal(sources.length,300);
for(const c of sources)assert.ok(c.source_prompt&&c.frame_sheet&&c.visual_review&&c.content_status);
assert.equal(Object.keys(allocation.participants).length,10);
for(const v of Object.values(allocation.participants)){assert.equal(v.length,150);assert.equal(new Set(v).size,150);}
for(const c of cases)assert.equal(Object.values(allocation.participants).filter(v=>v.includes(c.sample_id)).length,5);
class Element{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.attributes={};this.handlers={};this.style={};this.value='';this.checked=false;this.disabled=false;this.hidden=false;this.textContent='';this.paused=true;this.currentTime=0;this.duration=NaN;this._classes=new Set();this.classList={toggle:(name,on)=>on?this._classes.add(name):this._classes.delete(name)};}
 append(...v){this.children.push(...v);}replaceChildren(...v){this.children=v;}
 setAttribute(k,v){this.attributes[k]=v;}getAttribute(k){return k==='src'?this.src||null:this.attributes[k]??null;}
 addEventListener(k,f){(this.handlers[k]||=[]).push(f);}emit(k,v={}){for(const f of this.handlers[k]||[])f({target:this,...v});}
 pause(){this.paused=true;this.emit('pause');}play(){this.paused=false;this.emit('play');return Promise.resolve();}load(){}click(){this.onclick?.();}
}
function boot(storage=new Map(),search=''){
 const ids=[...read('holistic.html').matchAll(/id="([^"]+)"/g)].map(x=>x[1]);const els=Object.fromEntries(ids.map(x=>[x,new Element()]));let exported;
 const all=el=>el.children.flatMap(x=>x instanceof Element?[x,...all(x)]:[]);
 const doc={documentElement:{lang:''},getElementById:id=>{assert.ok(els[id],id);return els[id];},createElement:tag=>new Element(tag),createTextNode:s=>s,querySelectorAll:selector=>selector==='input[name=score]'?all(els.options).filter(x=>x.tagName==='input'):[]};
 const ctx={document:doc,location:{search},URLSearchParams,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},crypto:{randomUUID:()=> 'simulation-session'},Blob,URL:{createObjectURL:b=>{exported=b;return 'blob:simulation';},revokeObjectURL:()=>{}},setTimeout:()=>{},Date,Map,Set,Math,Number};
 vm.runInNewContext(read('holistic_data.js')+'\n'+read('holistic_allocation.js')+'\n'+read('holistic.js'),ctx);
 return {els,inputs:()=>doc.querySelectorAll('input[name=score]'),storage,key:[...storage.keys()].find(x=>x.startsWith('phyhoi-holistic')),export:async()=>{els.export.onclick();return JSON.parse(await exported.text());}};
}
(async()=>{
 const oldValue='original-node-storage-must-remain';const storage=new Map([['phyhoi-human-alignment',oldValue]]);let app=boot(storage);
 assert.equal(app.inputs().length,6);assert.ok(app.inputs().every(x=>!x.checked&&x.disabled));
 let result=await app.export();assert.equal(result.responses.length,300);assert.ok(result.responses.every(x=>!x.answered&&x.score===null));
 const video=app.els.video;video.duration=3.2333;video.emit('loadedmetadata');
 video.play();video.currentTime=3.2;video.emit('seeking');video.emit('seeked');video.emit('timeupdate');assert.ok(app.inputs().every(x=>x.disabled),'seeking must not unlock');
 video.pause();video.currentTime=0;video.play();for(let i=1;i<=16;i++){video.currentTime=i*.2;video.emit('timeupdate');}
 assert.ok(app.inputs().every(x=>!x.disabled),'continuous 95% playback should unlock');
 app.inputs().find(x=>x.value==='5').emit('change');app.els.reason.value='simulation only';app.els.reason.emit('input');
 const sid=JSON.parse(storage.get(app.key)).order[0];app.els.languageEn.onclick();assert.equal(app.els.title.textContent,cases.find(x=>x.sample_id===sid).en.title);assert.ok(app.inputs().find(x=>x.value==='5').checked);
 app.els.languageJa.onclick();assert.equal(app.els.title.textContent,cases.find(x=>x.sample_id===sid).ja.title);assert.equal(app.els.guidance.children.length,6);assert.ok(app.inputs().find(x=>x.value==='5').checked);
 app=boot(storage);assert.ok(app.inputs().find(x=>x.value==='5').checked);assert.equal(app.els.reason.value,'simulation only');
 app.inputs().find(x=>x.value==='null').emit('change');result=await app.export();const r=result.responses[0];assert.equal(r.answered,true);assert.equal(r.score,null);assert.equal(r.reason,'simulation only');assert.equal(r.language,'ja');assert.equal(r.content_version,'holistic-20261030-v3');assert.equal(r.media_id,cases.find(x=>x.sample_id===sid).media_id);assert.ok(r.submitted_at);assert.ok(r.watch.threshold_met);
 app.els.next.onclick();assert.ok(app.inputs().every(x=>!x.checked));app.els.prev.onclick();assert.ok(app.inputs().find(x=>x.value==='null').checked);assert.equal(storage.get('phyhoi-human-alignment'),oldValue);
 const assigned=boot(new Map(),'?participant=H01');result=await assigned.export();assert.equal(result.responses.length,150);assert.deepEqual(result.responses.map(r=>r.sample_id),allocation.participants.H01);assert.equal(new Set(result.responses.map(r=>r.segment)).size,3);
 console.log('PASS: 300 trilingual records with six detailed instructions each, media and frame paths, internal sources, 10×150 allocation, 5 assignments per video.');
 console.log('PASS: source-level simulation of no default score, watch threshold, seek prevention, score/null distinction, reason, language, reload, navigation, export, and old-storage isolation.');
 const renderApp=boot();for(const c of cases){renderApp.els.caseSelect.value=c.sample_id;renderApp.els.caseSelect.onchange({target:renderApp.els.caseSelect});for(const l of ['Zh','En','Ja']){renderApp.els['language'+l].onclick();assert.equal(renderApp.els.title.textContent,c[l.toLowerCase()].title);assert.equal(renderApp.els.guidance.children.length,6);assert.equal(renderApp.inputs().length,6);}}
 console.log('PASS: source-level rendering of all 300 cases in all three languages, without missing instructions or rating descriptions.');
 console.log('NOT RUN: browser rendering, actual browser video playback, downloads, refresh and narrow-screen acceptance.');
})().catch(e=>{console.error(e);process.exitCode=1;});
