import json,re,csv
from build_localization import localize
from pathlib import Path
root=Path(__file__).resolve().parent.parent
work=root/'study_work'
cases=json.loads((work/'content/initial_six.json').read_text())
for filename in ['P004-P007_内容草稿.json','P009_内容草稿.json']:
 d=json.loads((work/filename).read_text());cases.extend(d if isinstance(d,list) else [d])
text=(work/'P003_内容草稿.md').read_text(); z,e=text.split('## 中文')[1].split('## English')
def parse(t,lang):
 labels={'zh':['问题','人体动作与发力','接触与执行','物体变化','可能后果'],'en':['Question','Body and effort','Contact and execution','Object changes','Possible aftermath']}[lang]
 out={'title':'用修枝剪剪竹竿' if lang=='zh' else 'Cut a bamboo pole with pruning shears'}
 for key,label in zip(['question','body','contact','object','aftermath'],labels):
  out[key]=re.search(r'\*\*'+re.escape(label)+r'[:：]\*\*(.*)',t).group(1).strip()
 out['scores']=[re.search(r'^'+str(i)+(r' 分：' if lang=='zh' else ': ')+r'(.*)',t,re.M).group(1) for i in range(1,6)]
 out['unknown']=re.search(r'^(?:无法判断：|Unable to judge: )(.*)',t,re.M).group(1)
 return out
cases.append({'sample_id':'P003','media_id':'A_02759','zh':parse(z,'zh'),'en':parse(e,'en')})
for path in sorted((work/'content').glob('batch_*.json')): cases.extend(json.loads(path.read_text()))
by={}
for c in cases:
 assert c['sample_id'] not in by,c['sample_id']
 c['source_task_id']=c['media_id'];c['video']='./media/'+c['media_id']+'.mp4';c['content_version']='holistic-20261030-v3';c['languages']=['zh','en']
 for lang in ['zh','en']:
  for field in ['title','question','body','contact','object','aftermath','unknown']:assert c[lang][field].strip(),(c['sample_id'],lang,field)
  assert len(c[lang]['scores'])==5
 by[c['sample_id']]=c
source={x['sample_id']:x for x in json.loads((root/'data/samples.json').read_text())['samples']}
for sid,c in by.items():
 assert c['media_id']==source[sid]['media_id'],sid
 assert (root/c['video']).is_file(),sid
 for lang in ['zh','en']:
  for k,v in c[lang].items():
   if isinstance(v,str):c[lang][k]=v.replace('；','。')
with (work/'content/score_refinements.tsv').open(newline='') as f:
 for row in csv.DictReader(f,delimiter='\t'):
  for lang in ['zh','en']:by[row['sample_id']][lang]['scores'][1]+=' '+row[lang]
for dst,src in {'P217':'P216','P297':'P216','P256':'P250','P289':'P288','P291':'P288','P300':'P218'}.items():
 for lang in ['zh','en']:by[dst][lang]['scores']=by[src][lang]['scores'].copy()
assert set(by)=={f'P{i:03d}' for i in range(1,301)}, '必须具备完整300条'
localize(list(by.values()),work)
source_tasks={x['study_id']:x for x in json.loads((root/'data/selected_300.json').read_text())['samples']}
review=[]
for sid,c in sorted(by.items()):
 task=source_tasks[sid]
 review.append({'sample_id':sid,'media_id':c['media_id'],'source_task_id':c['source_task_id'],'video':c['video'],'content_version':c['content_version'],'languages':c['languages'],'instruction_steps':6,'source_file':'data/selected_300.json','source_prompt':task['prompt'],'source_category':task['category'],'frame_sheet':'study_work/all_frames/'+c['media_id']+'.jpg','visual_review':'已查看完整时序帧图，浏览器播放未验收','content_status':'中英文内容已获作者认可，日文及详细说明已加入；浏览器验收未完成','shared_task_basis':c.pop('shared_task_basis',None)})
(work/'内容来源记录.json').write_text(json.dumps(review,ensure_ascii=False,indent=2))
out=sorted(by.values(),key=lambda c:c['sample_id'])
(root/'holistic_data.js').write_text("const HOLISTIC_VERSION = 'holistic-20261030-v3';\nconst HOLISTIC_CASES = "+json.dumps(out,ensure_ascii=False,indent=2)+';\n')
with (work/'逐条工作清单.csv').open(encoding='utf-8-sig',newline='') as f: rows=list(csv.DictReader(f));keys=list(rows[0])
for r in rows:
 if r['sample_id'] in by:
  r['content_status']='中英日三语完整内容与六步详细说明已集成，浏览器验收未完成'
  r['visual_review']='已查看完整时序帧图，浏览器播放未验收'
with (work/'逐条工作清单.csv').open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.DictWriter(f,fieldnames=keys,lineterminator='\n');w.writeheader();w.writerows(rows)
print('已集成中英日三语完整内容及详细说明:',len(out))
