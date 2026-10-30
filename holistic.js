(() => {
'use strict';
const requested = new URLSearchParams(location.search).get('participant');
const allocation = requested && HOLISTIC_ALLOCATION.participants[requested];
const KEY = allocation ? `phyhoi-holistic-review-${requested}-v1` : 'phyhoi-holistic-demo-v1';
const t = {
  zh: {
    demo: '整体物理合理性评分 · 300 条验收预览', assigned: '分配预览', scope: '观看当前交互，直接选择一个整体评分。',
    intro: '这是作者验收页面，尚未开始正式采集。请评价人体动作、实际接触、物体变化与适用后果的整体物理合理性。观看覆盖达到 95%，且包含开头和结尾后可作答。记录不能确认注意力或每帧均被观看。',
    export:'导出验收 JSON', prev:'上一条', next:'下一条', replay:'重新播放', caseLabel:'查看条目',
    task:'确认当前任务', decision:'综合评分与信息不足', instructionHeading:'详细评分说明', body:'人体动作与发力', contact:'接触与执行', object:'物体变化', aftermath:'可能后果',
    visibility:'未知内容不推断，也不因未知扣分。已呈现实际交互而后续不可见时，只评价可见部分。只有准备动作或关键交互不可见时选择无法判断。高分仅表示可评价部分合理。',
    legend:'请选择一个整体评分', unknown:'无法判断', reason:'理由（选填）', watch:'观看覆盖', ready:'可以作答', wait:'请观看至少 95%，并包含开头和结尾后作答',
    answered:'已回答', saved:'已保存', storageError:'浏览器未能自动保存。请导出当前 JSON，避免关闭页面后丢失记录。',
    complete:'当前清单已全部作答，可以导出验收记录。此记录不作为正式参与者结果。', mediaError:'视频读取失败，请检查本地媒体文件并重新打开页面。',
    blind:'生成方法与自动分数隐藏', ratingMode:'单项整体评分', segment:'分段'
  },
  en: {
    demo:'Overall physical plausibility · 300-case review', assigned:'Assignment preview', scope:'Watch the interaction and choose one overall rating.',
    intro:'This is an author review page; formal collection has not started. Judge physical plausibility across body action, actual contact, object changes, and applicable consequences. Answering requires 95% playback coverage including the beginning and end. The record cannot establish attention or that every frame was watched.',
    export:'Export review JSON', prev:'Previous', next:'Next', replay:'Replay', caseLabel:'View case',
    task:'Identify the task', decision:'Overall decision and insufficient information', instructionHeading:'Detailed rating instructions', body:'Body and effort', contact:'Contact and execution', object:'Object changes', aftermath:'Possible aftermath',
    visibility:'Do not infer unseen events or deduct points for unknown information. If actual interaction is shown and the aftermath is hidden, rate only what is visible. Choose unable to judge if only preparation or no crucial interaction is visible. A high score applies only to the assessable portion.',
    legend:'Choose one overall rating', unknown:'Unable to judge', reason:'Reason (optional)', watch:'Playback coverage', ready:'Ready to answer', wait:'Watch at least 95%, including the beginning and end, before answering',
    answered:'answered', saved:'Saved', storageError:'The browser could not save automatically. Export the current JSON before closing the page to avoid losing records.',
    complete:'Every assigned case has a response. You can export this review record; it is not a formal participant result.', mediaError:'The video could not be loaded. Check the local media file and reopen the page.',
    blind:'Methods and automatic scores hidden', ratingMode:'One overall rating', segment:'Segment'
  },
  ja: {
    demo:'全体の物理的妥当性 · 300件の確認ページ', assigned:'割当の確認', scope:'実際の相互作用を見て、全体の評価を一つ選んでください。',
    intro:'著者確認用のページです。正式な収集は開始していません。身体動作、実際の接触、対象物の変化、該当する結果を総合して物理的妥当性を評価してください。冒頭と末尾を含む95%以上の再生範囲を記録すると回答できます。この記録は注意や全フレームの視聴を確認するものではありません。',
    export:'確認用JSONを出力', prev:'前へ', next:'次へ', replay:'もう一度再生', caseLabel:'項目を選択',
    task:'課題を確認', body:'身体動作と力の協調', contact:'接触と実行', object:'対象物の変化', aftermath:'起こり得る後続結果', decision:'総合評価と情報不足', instructionHeading:'詳しい評価手順',
    visibility:'見えない事象を推測したり、未知を理由に減点したりしないでください。実際の作用が見え、後続が隠れる場合は見える部分だけを評価します。準備だけ、または重要な作用が見えない場合は「判断できない」を選びます。高得点は評価可能な範囲だけを指します。',
    legend:'全体の評価を一つ選択', unknown:'判断できない', reason:'理由（任意）', watch:'再生範囲', ready:'回答できます', wait:'冒頭と末尾を含む95%以上を視聴してから回答してください',
    answered:'回答済み', saved:'保存済み', storageError:'ブラウザーに自動保存できませんでした。閉じる前に現在のJSONを出力してください。',
    complete:'割当項目への回答が完了しました。確認記録を出力できます。この記録は正式な参加者の結果には使用しません。', mediaError:'動画を読み込めません。ローカルの動画ファイルを確認してページを開き直してください。',
    blind:'生成手法と自動スコアは非表示', ratingMode:'一つの全体評価', segment:'区分'
  }
};
const $ = id => document.getElementById(id);
const byId = new Map(HOLISTIC_CASES.map(c => [c.sample_id,c]));
const allowed = allocation || HOLISTIC_CASES.map(c => c.sample_id);
function shuffled(items) {
  const out = [...items];
  for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
  return out;
}
let state, storageFailed = false;
try { state = JSON.parse(localStorage.getItem(KEY)); } catch(e) { storageFailed = true; }
if(!state || !Array.isArray(state.order)) {
  state = {participant_id:allocation?requested:'review-'+(crypto.randomUUID?crypto.randomUUID():Date.now()),language:'zh',order:allocation?[...allocation]:shuffled(allowed),index:0,answers:{}};
}
state.order = [...new Set(state.order.filter(id => allowed.includes(id)))];
const added = allowed.filter(id => !state.order.includes(id));
state.order.push(...(allocation?added:shuffled(added)));
state.answers ||= {};
state.language = ['zh','en','ja'].includes(state.language)?state.language:'zh';
state.index = Math.max(0,Math.min(state.order.length-1,Number(state.index)||0));
const video = $('video');
let last = null;
function save() {
  try { localStorage.setItem(KEY,JSON.stringify(state)); storageFailed=false; } catch(e) { storageFailed=true; }
  $('storageError').hidden = !storageFailed;
  $('storageError').textContent = t[state.language].storageError;
  $('saveState').textContent = storageFailed?'':t[state.language].saved;
}
function current() { return byId.get(state.order[state.index]); }
function emptyRecord() { return {answered:false,score:null,reason:'',ranges:[],duration:null,submitted_at:null,content_version:null,language:null}; }
function record() { return state.answers[current().sample_id] ||= emptyRecord(); }
function merge(ranges) {
  const sorted = ranges.slice().sort((a,b)=>a[0]-b[0]), out=[];
  for(const r of sorted){const p=out[out.length-1];if(p&&r[0]<=p[1]+0.05)p[1]=Math.max(p[1],r[1]);else out.push(r.slice());}
  return out;
}
function coverage(r) { return r.ranges.reduce((n,x)=>n+x[1]-x[0],0); }
function ready(r) {
  const d=r.duration;
  return Number.isFinite(d)&&d>0&&coverage(r)>=d*.95&&r.ranges.some(x=>x[0]<=.25)&&r.ranges.some(x=>x[1]>=d-.25);
}
function watchText() {
  const r=record(), s=t[state.language], pct=r.duration?Math.min(100,100*coverage(r)/r.duration):0;
  $('watch').textContent=`${s.watch}: ${pct.toFixed(1)}% · ${ready(r)?s.ready:s.wait}`;
  document.querySelectorAll('input[name=score]').forEach(x=>x.disabled=!ready(r));
}
function renderProgress() {
  const s=t[state.language], n=state.order.filter(id=>state.answers[id]?.answered).length;
  $('progress').textContent=`${n} / ${state.order.length} ${s.answered}`;
  $('progressFill').style.width=`${n/state.order.length*100}%`;
  $('complete').hidden=n!==state.order.length;
  $('complete').textContent=s.complete;
}
function render() {
  const c=current(),r=record(),l=state.language,s=t[l],d=c[l];
  document.documentElement.lang=l==='zh'?'zh-CN':l;
  document.title=`PhyHOI-Bench · ${{zh:'整体评分验收',en:'Overall rating review',ja:'全体評価の確認'}[l]}`;
  $('demo').textContent=allocation?`${s.assigned} · ${requested} · 150` : s.demo;
  for(const id of ['scope','intro','export','prev','next','replay','caseLabel','legend','blind','ratingMode','instructionHeading'])$(id).textContent=s[id];
  for(const lang of ['en','zh','ja']){const button=$('language'+lang[0].toUpperCase()+lang.slice(1));button.classList.toggle('selected',l===lang);button.setAttribute('aria-pressed',String(l===lang));}
  $('prev').disabled=state.index===0;$('next').disabled=state.index===state.order.length-1;
  $('sampleIndex').textContent=`${c.sample_id} · ${state.index+1}/${state.order.length} · ${s.segment} ${Math.floor(state.index/50)+1}`;
  $('caseSelect').replaceChildren(...state.order.map(id=>{const x=byId.get(id),o=document.createElement('option');o.value=id;o.textContent=`${id} — ${x[l].title}`;return o;}));
  $('caseSelect').value=c.sample_id;
  $('title').textContent=d.title;$('question').textContent=d.question;
  $('guidance').replaceChildren(...d.instructions.map(step=>{const item=document.createElement('li'),heading=document.createElement('strong'),p=document.createElement('p');heading.textContent=s[step.section];p.textContent=step.text;item.append(heading,p);return item;}));
  $('visibility').textContent=s.visibility;$('reasonLabel').textContent=s.reason;$('reason').value=r.reason;
  $('options').replaceChildren();
  [5,4,3,2,1,null].forEach(score=>{
    const label=document.createElement('label'),input=document.createElement('input'),span=document.createElement('span');
    label.className='option';input.type='radio';input.name='score';input.value=score===null?'null':String(score);input.checked=r.answered&&r.score===score;
    input.addEventListener('change',()=>{
      if(!ready(r))return;
      r.answered=true;r.score=score;r.submitted_at=new Date().toISOString();r.content_version=HOLISTIC_VERSION;r.language=state.language;
      save();renderProgress();
    });
    span.textContent=score===null?`${s.unknown}${l==='en'?': ':'：'}${d.unknown}`:`${score} — ${d.scores[score-1]}`;
    label.append(input,span);$('options').append(label);
  });
  if(video.getAttribute('src')!==c.video){last=null;video.pause();$('mediaError').hidden=true;video.src=c.video;video.load();}
  $('mediaError').textContent=s.mediaError;
  watchText();renderProgress();save();
}
video.addEventListener('loadedmetadata',()=>{record().duration=video.duration;watchText();save();});
video.addEventListener('play',()=>{last=video.currentTime;});
video.addEventListener('seeking',()=>{last=null;});
video.addEventListener('seeked',()=>{last=video.paused?null:video.currentTime;});
video.addEventListener('pause',()=>{last=null;save();});
video.addEventListener('timeupdate',()=>{
  const now=video.currentTime,r=record();
  if(!video.paused&&last!==null&&now>=last&&now-last<1)r.ranges=merge([...r.ranges,[last,now]]);
  last=video.paused?null:now;r.duration=video.duration;watchText();save();
});
video.addEventListener('ended',()=>{last=null;watchText();save();});
video.addEventListener('error',()=>{$('mediaError').hidden=false;});
$('reason').addEventListener('input',e=>{record().reason=e.target.value;save();});
$('languageEn').onclick=()=>{state.language='en';render();};$('languageZh').onclick=()=>{state.language='zh';render();};$('languageJa').onclick=()=>{state.language='ja';render();};
function navigate(index){state.index=index;render();}
$('prev').onclick=()=>{if(state.index>0)navigate(state.index-1);};
$('next').onclick=()=>{if(state.index<state.order.length-1)navigate(state.index+1);};
$('caseSelect').onchange=e=>navigate(state.order.indexOf(e.target.value));
$('replay').onclick=()=>{video.currentTime=0;video.play().catch(()=>{});};
$('export').onclick=()=>{
  const data={kind:'author_acceptance_not_formal_collection',content_version:HOLISTIC_VERSION,allocation_version:allocation?HOLISTIC_ALLOCATION.version:null,participant_id:state.participant_id,exported_at:new Date().toISOString(),responses:state.order.map((id,i)=>{
    const c=byId.get(id),r=state.answers[id]||emptyRecord();
    return {participant_id:state.participant_id,sample_id:id,media_id:c.media_id,source_task_id:c.source_task_id,content_version:r.answered?(r.content_version||'legacy-preview-version-unrecorded'):HOLISTIC_VERSION,presentation_order:i+1,segment:Math.floor(i/50)+1,answered:r.answered,score:r.score,reason:r.reason,language:r.language||null,watch:{ranges:r.ranges,duration:r.duration,coverage_seconds:coverage(r),threshold_met:ready(r)},submitted_at:r.submitted_at};
  })};
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.download=`phyhoi-holistic-review-${state.participant_id}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
};
render();
})();
