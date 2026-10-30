import json
from pathlib import Path
from write_batch_01 import add,rows
rows.clear()
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
case('P198','A_03152',[
'推动壁床下方的沙发底座','观察弯腰、双手推压与脚部支撑。','手与底座的接触应与推动方向对应，底座与地面及柜体关系应连续。','底座可移动，织物可局部受压，不要求整个壁床同时展开。','若底座停止或进入柜下，观察碰撞限制与支撑。','只有就位准备，实际推压或底座响应不足以评价时选择无法判断。','人体推压、沙发底座移动和地面支撑'],[
'Push the sofa base beneath a wall bed','Consider leaning, two-hand pressure, and foot support.','Hand contact should correspond to the push, with continuous relations to the floor and cabinet.','The base may move and upholstery may compress locally. Unfolding the whole bed is not required.','If the base stops or enters beneath the cabinet, consider contact limits and support.','Choose unable to judge if only setup is shown or actual pushing and base response cannot be assessed.','Body pressure, sofa-base motion, and floor support'])
case('P199','A_01511',[
'打开窗台上的工具箱盖','观察蹲姿、扶箱和抬盖的双手协调。','盖与箱体应保持合理连接，手的抬动应对应盖的转动。','箱盖可开启到不同角度，不要求工具全部露出或箱体变形。','若松手或合盖，观察盖的承托、停止及箱体在窗台上的支撑。','只有持箱准备，实际开盖过程不足以评价时选择无法判断。','人体控盖、箱盖转动和窗台承托'],[
'Open the toolbox lid on a windowsill','Consider crouching, steadying the box, and lifting the lid.','Lid–box connection should remain plausible, with lid rotation related to hand lifting.','The lid may open through different angles. Exposing every tool or deforming the case is not required.','On release or closing, consider lid support, stopping, and box support on the sill.','Choose unable to judge if only holding is shown or actual lid opening cannot be assessed.','Hand control, lid rotation, and windowsill support'])
case('P201','A_00731',[
'从金属架中拉出塑料抽屉盒','观察拉动与逐步承托盒体的双手协调。','抽屉与架体的导向、手柄或盒缘接触应连续。','盒体应随拉力移出，不要求塑料被切断或明显变形。','若完全离架，观察承托转换，若停留在架内，观察导向支撑。','只有抓握准备，实际抽拉不足以评价时选择无法判断。','人体抽拉、塑料盒移动与架体导向支撑'],[
'Pull a plastic drawer box from a metal rack','Consider coordination of pulling and progressively supporting the box.','Drawer guidance and hand contact with the handle or rim should remain continuous.','The box should move with pulling. Cutting or visibly deforming plastic is not required.','If fully removed, consider support transfer. If partly retained, consider rack guidance and support.','Choose unable to judge if only gripping is shown or actual extraction cannot be assessed.','Hand pulling, plastic-box motion, and rack guidance and support'])
case('P202','A_00506',[
'展开并放置折叠桌','观察扶持桌面、展开桌腿和降低桌面的双手及躯干协调。','桌腿转动应与铰接位置及手部操作相关，桌面应有连续承托。','桌腿可展开形成支撑，不要求看到隐藏的锁扣。','若桌脚着地或手松开，观察重力下的承托转换与稳定。','仅搬持桌面，实际展开或放置不足以评价时选择无法判断。','人体扶持、桌腿展开与桌脚承重'],[
'Unfold and set down a folding table','Consider coordination while supporting the top, unfolding legs, and lowering the table.','Leg rotation should relate to hinges and hand action, with continuous top support.','Legs may unfold into supporting positions. Hidden latches need not be visible.','On foot contact or hand release, consider load transfer and stability under gravity.','Choose unable to judge if only carrying is shown or actual unfolding or placement cannot be assessed.','Body support, leg unfolding, and table-foot load bearing'])
case('P203','A_00448',[
'拉开金属工具柜的中层抽屉','观察握住银色把手、后拉手臂与站姿配合。','把手、抽屉和柜体的连接应连续，抽屉沿合理导向移动。','抽屉可部分拉开，不要求完全取出、柜体移动或金属变形。','若抽屉停止或回推，观察导轨限制及箱体支撑。','只有握柄准备，实际抽拉不足以评价时选择无法判断。','人体拉动、把手连接与抽屉导轨运动'],[
'Pull open the middle drawer of a metal tool cabinet','Consider silver-handle grip, arm withdrawal, and stance.','Handle, drawer, and cabinet connections should remain continuous, with guided drawer motion.','Partial opening is sufficient. Complete removal, cabinet motion, or metal deformation is not required.','On stopping or returning, consider guide limits and cabinet support.','Choose unable to judge if only handle preparation is shown or actual pulling cannot be assessed.','Hand pulling, handle connection, and drawer-guide motion'])
case('P204','A_00375',[
'拉开小型木质收纳盒的抽屉','观察手对前面板把手的抓握和盒体的扶持。','前面板应随抽屉共同移动，抽屉与盒体应保持合理导向。','抽屉可以部分打开，不要求装饰面板脱落或整个收纳盒移动。','若停止、回推或松手，观察抽屉与桌面盒体支撑。','实际抽拉被遮挡或只有展示收纳盒时选择无法判断。','手部抽拉、木抽屉连续性与盒体支撑'],[
'Open a drawer in a small wooden storage box','Consider gripping the front handle and steadying the box.','The front panel should move with the drawer, maintaining plausible guidance in the box.','Partial opening is sufficient. Detaching the decorative panel or moving the whole box is not required.','On stopping, returning, or release, consider drawer and tabletop box support.','Choose unable to judge if actual pulling is obscured or only the box is displayed.','Hand pulling, wooden-drawer continuity, and box support'])
case('P205','A_03057',[
'打开桌上的塑料工具箱盖','观察戴手套的手抬盖与另一只手或桌面对箱体的支撑。','盖与箱体的铰接关系和手的接触应连续。','刚性塑料盖应随抬动开启，不要求大幅弯曲或看见锁扣解锁。','若松手或关闭，观察盖的转动停止及箱体承托。','只有扶箱或抓盖准备，实际开盖不足以评价时选择无法判断。','手部抬盖、塑料箱铰接与桌面承托'],[
'Open a plastic toolbox lid on a table','Consider gloved-hand lifting and support from the other hand or table.','Lid hinges and hand contact should remain continuous.','The rigid plastic lid should open with lifting. Large bending or visible latch release is not required.','On release or closing, consider rotation stopping and box support.','Choose unable to judge if only steadying or preparatory gripping is shown and opening cannot be assessed.','Hand lifting, plastic-case hinging, and tabletop support'])
case('P206','A_02414',[
'用双手拉开熟龙虾','观察双手分别握住龙虾部位并相向或背向用力的协调。','手与虾壳接触、关节或壳体分离位置应与拉力相关。','龙虾可在关节或壳体处逐渐分离，不要求重新烹煮或变色。','若部位分开、放下或小块掉落，观察持续承托与桌面接触。','仅展示龙虾，实际拉动和分离响应不足以评价时选择无法判断。','双手拉力、龙虾壳体分离与部位承托'],[
'Pull apart a cooked lobster with both hands','Consider coordination while gripping different lobster parts and applying opposing forces.','Hand–shell contact and joint or shell separation should relate to pulling.','Separation may develop at joints or shell sections. Further cooking or color change is not required.','If parts separate, are set down, or small pieces fall, consider continued support and table contact.','Choose unable to judge if only display is shown or actual pulling and separation cannot be assessed.','Two-hand pulling, lobster separation, and support of parts'])
case('P207','A_03153',[
'拉开隐藏床铺的壁柜面板','观察握住面板、后拉与身体平衡的配合。','面板与柜体应通过合理的铰接或导向运动，手的作用位置应连续。','面板可开启，不要求片段内床铺完整显露或展开。','若面板停止或松手，观察柜体连接、重力和承托关系。','只有握持准备，实际开启动作不足以评价时选择无法判断。','人体拉动、壁柜面板运动与柜体连接'],[
'Pull open a wall-cabinet panel concealing beds','Consider panel grip, pulling, and balance.','Panel motion should follow plausible hinges or guidance, with continuous hand action.','The panel may open. Full bed exposure or unfolding within the clip is not required.','On stopping or release, consider cabinet connection, gravity, and support.','Choose unable to judge if only gripping is shown or actual opening cannot be assessed.','Body pulling, wall-panel motion, and cabinet connection'])
case('P208','A_02471',[
'安装抽屉前面板和把手','观察扶持面板、对齐柜体开口与手指定位的协调。','面板、把手与安装位置的接触应与手部动作对应。','部件可以对齐和固定，不要求塑料或木板发生永久变形。','若松手，观察部件是否有合理支撑，不推断不可见螺钉是否拧紧。','只有展示或对位准备，实际安装接触不足以评价时选择无法判断。','手部定位、面板把手连接与安装后支撑'],[
'Fit a drawer front panel and handle','Consider supporting the panel, aligning the cabinet opening, and finger positioning.','Panel and handle contact at the fitting location should correspond to hand action.','Parts may align and attach. Permanent deformation of plastic or wood is not required.','On release, consider plausible part support. Do not infer tightening of unseen screws.','Choose unable to judge if only display or preparatory alignment is shown and actual fitting cannot be assessed.','Hand positioning, panel–handle attachment, and post-fitting support'])
case('P209','A_03264',[
'操作橡皮筋和塑料勺组成的弹射模型','观察手指按动勺臂、扶持铅笔支架与释放的协调。','按压与橡皮筋拉伸、勺臂约束应对应，底座应有合理支撑。','勺臂可弹性回动，不要求一定装有或发射弹丸。','若释放或有物体飞出，观察储能释放、离臂时刻及随后重力运动。','只有展示模型或准备按动，实际机构作用不足以评价时选择无法判断。','手指按动、橡皮筋勺臂响应与支架支撑'],[
'Operate a rubber-band and plastic-spoon launcher model','Consider pressing the spoon arm, steadying the pencil frame, and release.','Pressing should relate to band stretch and arm constraints, with plausible base support.','The arm may spring back. A loaded or launched projectile is not required.','If released or an object leaves, consider energy release, separation timing, and subsequent gravity.','Choose unable to judge if only display or preparation is shown and actual mechanism action cannot be assessed.','Finger pressure, band–spoon response, and frame support'])
case('P210','A_03148',[
'操作小型木制投掷机构','观察手部压动或转动木臂及扶持底架的协调。','木臂应围绕合理连接运动，手、支架和橙色球的关系应连续。','机构可转动或摆动，不强制要求橡皮筋弹性或球离开连接。','若臂停止、球摆动或实际释放，观察约束、重力和底架支撑。','仅展示机构，实际压动或转动不足以评价时选择无法判断。','手部操作、木臂球体约束与底架支撑'],[
'Operate a small wooden throwing mechanism','Consider pressing or rotating the arm and steadying the frame.','Arm motion should follow plausible connections, with continuous hand, frame, and orange-ball relations.','The mechanism may rotate or swing. Rubber-band elasticity or ball detachment is not required.','If the arm stops, the ball swings, or release occurs, consider constraints, gravity, and frame support.','Choose unable to judge if only display is shown or actual pressing or rotation cannot be assessed.','Hand operation, arm–ball constraints, and frame support'])
case('P211','A_00995',[
'晃动平底锅翻动意大利面','观察握柄、手腕提拉与躯干平衡，不要求固定翻锅幅度。','锅的加速应与手臂动作相关，面条与锅面承托或离开时刻应可解释。','湿面条可滑动、弯曲或部分腾空，不要求每根同时离锅。','若面条回落或蒸汽上升，观察重力、重新接触及气体扩散。','只有端锅准备，实际锅内食物运动不足以评价时选择无法判断。','人体控锅、面条柔性运动与回落接触'],[
'Shake a frying pan to toss spaghetti','Consider handle grip, wrist lifting, and balance without a prescribed toss amplitude.','Pan acceleration should relate to arm action, with interpretable noodle support or separation.','Wet noodles may slide, bend, or partly lift. All strands need not leave together.','If noodles return or steam rises, consider gravity, renewed contact, and gas dispersal.','Choose unable to judge if only holding is shown and actual food motion cannot be assessed.','Pan control, flexible-noodle motion, and returning contact'])
case('P212','A_00357',[
'倾倒平底锅中的绿色黏稠液体','观察握柄、倾锅和手臂对锅体重量的控制。','锅的倾角、锅缘与液体开始流动的位置应相关。','黏液可缓慢流动、拉成液束或聚集，不应按固体翻饼要求评价。','若液体离锅或落到可见表面，观察连续流动、重力及积聚，不要求指定容器。','只有持锅准备，实际倾倒和流动不足以评价时选择无法判断。','人体倾锅、黏液流出与可见落点积聚'],[
'Pour green viscous liquid from a frying pan','Consider handle grip, tilting, and control of pan weight.','Pan angle, rim, and flow onset should correspond.','Viscous liquid may flow slowly, form a strand, or pool. Do not evaluate it as a solid pancake flip.','If liquid leaves or reaches a visible surface, consider flow continuity, gravity, and accumulation without requiring a specific receiver.','Choose unable to judge if only holding is shown and actual pouring and flow cannot be assessed.','Pan tilting, viscous outflow, and accumulation at visible landing surfaces'])
Path(__file__).with_name('batch_28.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
