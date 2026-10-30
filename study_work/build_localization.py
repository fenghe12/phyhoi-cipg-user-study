import copy,json
from pathlib import Path

def localize(cases,work):
 japanese={}
 for path in sorted((work/'content/ja').glob('*.psv')):
  for line in path.read_text().splitlines():
   v=line.split('|');assert len(v)==8,(path.name,v[0])
   sid,title,body,contact,obj,after,unknown,criterion=v
   assert sid not in japanese,sid
   japanese[sid]={'title':title,'question':f'人物が「{title}」という操作を行うとき、相互作用全体は物理的にどの程度妥当ですか。','body':body,'contact':contact,'object':obj,'aftermath':after,'unknown':unknown+'その場合は「判断できない」を選択してください。','scores':[
    f'身体、作用、対象物、可視の後続過程が全体として非常に不合理です。または、十分明瞭な映像から、この操作が実行されていないと確認できます。評価の対象は、{criterion}です。見えないことだけを理由に1点にはしません。',
    f'操作の試みは認識できますが、{criterion}という重要な関係に大きな矛盾があり、主要過程を物理的に説明することが困難です。',
    f'{criterion}という関係には妥当な部分と明瞭な異常が共存し、一部の重要な過程の妥当性に影響しています。',
    f'{criterion}という主要な関係は妥当です。局所に軽微な異常がありますが、主要な動作と応答の説明を変えるほどではありません。',
    f'実際の操作が提示され、可視の範囲で{criterion}を確認できます。身体と対象物の応答、見える後続過程に明瞭な物理異常はありません。'
   ]}
 by={c['sample_id']:c for c in cases}
 for sid,c in by.items():
  if sid not in japanese:
   same=[s for s in japanese if c['zh']==by[s]['zh'] and c['en']==by[s]['en']]
   assert same,('日文説明がありません',sid)
   japanese[sid]=copy.deepcopy(japanese[same[0]])
 for sid,c in by.items():
  c['ja']=japanese[sid];c['languages']=['zh','en','ja']
  for lang in c['languages']:
   d=c[lang]
   first={
    'zh':f'先观看完整时序，确认当前任务“{d["title"]}”中实际呈现的动作、接触和对象反应。不要仅凭已有终态认定本次操作完成。',
    'en':f'Watch the complete sequence and identify the actual action, contact, and object response in this task: {d["title"]}. An existing end state alone does not establish that the current operation was performed.',
    'ja':f'全時系列を見て、今回の課題「{d["title"]}」で実際に提示された動作、接触、対象物の応答を確認してください。既に存在する状態だけで、今回の操作の実行を判断しないでください。'
   }[lang]
   last={
    'zh':f'综合以上信息，直接选择一个整体分，不分别计算各部分分数。后续不可见时只评价此前实际可见部分，不推断，也不因未知扣分。高分只表示可评价部分合理。当前任务的信息不足条件：{d["unknown"]}',
    'en':f'Use all applicable observations to choose one overall rating directly; do not calculate separate component scores. Rate earlier actual visible interaction when later events are hidden. Do not infer or penalize unknown information. A high score applies only to the assessable portion. Task-specific insufficient-information condition: {d["unknown"]}',
    'ja':f'該当する観察を総合し、部分点を計算せず全体の点を一つ選んでください。後続が隠れる場合は、それ以前に実際に見える作用だけを評価します。未知を推測したり、そのために減点したりしません。高得点は評価可能な範囲だけを指します。今回の情報不足条件：{d["unknown"]}'
   }[lang]
   d['instruction1']=first
   d['instructions']=[{'section':'task','text':first}]+[{'section':k,'text':d[k]} for k in ['body','contact','object','aftermath']]+[{'section':'decision','text':last}]
 return cases
