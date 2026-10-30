import csv,json,os,subprocess
from pathlib import Path
root=Path(__file__).resolve().parent.parent
work=root/'study_work'
frames=work/'all_frames'
frames.mkdir(exist_ok=True)
env=os.environ.copy()
for k in ('TMPDIR','TEMP','TMP'): env[k]=str(work/'tmp')
env['XDG_CACHE_HOME']=str(work/'cache')
manifest=json.loads((root/'data/samples.json').read_text())['samples']
tasks={x['study_id']:x for x in json.loads((root/'data/selected_300.json').read_text())['samples']}
previous={}
if (work/'逐条工作清单.csv').exists():
 with (work/'逐条工作清单.csv').open(encoding='utf-8-sig',newline='') as f: previous={r['sample_id']:r for r in csv.DictReader(f)}
completed={'P008','P068','P200','P157','P213','P226'}
rows=[]
for sample in manifest:
 sid=sample['sample_id']; task=tasks[sid]; media=sample['media_id']; src=root/sample['video']; out=frames/(media+'.jpg')
 if not out.exists():
  cmd=['ffmpeg','-v','error','-i',str(src),'-vf','scale=150:-1,tile=12x12','-frames:v','1','-y',str(out)]
  result=subprocess.run(cmd,env=env,capture_output=True,text=True)
  status='已生成' if result.returncode==0 else '生成失败'
 else: status='已生成'
 rows.append({'sample_id':sid,'media_id':media,'category':sample['category'],'video':sample['video'],'source_task_id':task['sample_id'],'source_prompt':task['prompt'],'frame_sheet':str(out.relative_to(root)),'frame_status':status,'visual_review':'首批已查看' if sid in completed else '待查看','content_status':'首批已编写，浏览器验收待完成' if sid in completed else '待编写'})
for row in rows:
 if row['sample_id'] in previous:
  for key in ['visual_review','content_status']: row[key]=previous[row['sample_id']][key]
with (work/'逐条工作清单.csv').open('w',encoding='utf-8-sig',newline='') as f:
 writer=csv.DictWriter(f,fieldnames=rows[0].keys(),lineterminator='\n');writer.writeheader();writer.writerows(rows)
print('记录:',len(rows),'帧图生成失败:',sum(r['frame_status']=='生成失败' for r in rows),'待逐条查看:',sum(r['visual_review']=='待查看' for r in rows))
