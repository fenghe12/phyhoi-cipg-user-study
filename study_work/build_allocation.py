import json,csv,random
from pathlib import Path
root=Path(__file__).resolve().parent.parent
samples=json.loads((root/'data/samples.json').read_text())['samples']
rng=random.Random(20261030)
ids=[x['sample_id'] for x in samples];rng.shuffle(ids)
participants=[f'H{i:02d}' for i in range(1,11)];rng.shuffle(participants)
assigned={p:[] for p in participants}
for i,sid in enumerate(ids):
 for j in range(5):assigned[participants[(i+j)%10]].append(sid)
for p in assigned:rng.shuffle(assigned[p])
assert all(len(set(v))==150 for v in assigned.values())
assert all(sum(sid in v for v in assigned.values())==5 for sid in ids)
data={'version':'holistic-allocation-20261030-v1','seed':20261030,'total_videos':300,'participant_count':10,'videos_per_participant':150,'assignments_per_video':5,'session_size':50,'participants':{p:assigned[p] for p in sorted(assigned)}}
(root/'data/holistic_allocation.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
(root/'holistic_allocation.js').write_text('const HOLISTIC_ALLOCATION = '+json.dumps(data,ensure_ascii=False,indent=2)+';\n')
with (root/'data/holistic_allocation.csv').open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.writer(f,lineterminator='\n');w.writerow(['participant_id','presentation_order','session','sample_id'])
 for p,v in sorted(assigned.items()):
  for i,sid in enumerate(v):w.writerow([p,i+1,i//50+1,sid])
print('分配表：10人，每人150条，每条5人，共1500次')
