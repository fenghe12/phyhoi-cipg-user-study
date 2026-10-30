from write_batch_01 import add,rows
def case(sid,mid,z,e):
 def expand(a,lang):
  title,body,contact,obj,after,unknown,axes=a
  if lang=='zh':
   q=f'人物{title}，整体交互有多合理？'
   scores=[f'{axes}整体严重不合理，或清楚可见的实际动作与任务相反。',f'操作尝试可辨认，但{axes}的关键关系严重不符。',f'{axes}部分合理，同时存在明显异常。',f'{axes}主要关系合理，仅有轻微局部异常。',f'实际操作可评价，{axes}及可见后续变化协调，没有明显异常。']
  else:
   q=f'How physically plausible is the interaction: {title.lower()}?'
   scores=[f'{axes} are severely implausible overall, or clearly visible actual action contradicts the task.',f'An attempt is recognizable, but key relationships among {axes.lower()} seriously disagree.',f'{axes} are partly plausible, alongside clear anomalies.',f'The main relationships among {axes.lower()} are plausible, with minor local anomalies.',f'Actual operation is assessable, and {axes.lower()} and visible subsequent changes are coherent without obvious anomalies.']
  return [title,q,body,contact,obj,after,unknown,*scores]
 add(sid,mid,expand(z,'zh'),expand(e,'en'))
