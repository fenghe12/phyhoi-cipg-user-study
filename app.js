const NODE_DEFINITIONS = [
  {
    id: "D0",
    name: { en: "Object Integrity", zh: "对象完整性" },
    description: {
      en: "Do people and objects remain recognizable, intact, and consistent? Check for unexplained disappearance, duplication, merging, or structural change.",
      zh: "人物与物体是否始终可识别、完整并保持一致？检查是否出现无原因的消失、复制、融合或结构变化。",
    },
  },
  {
    id: "D1",
    name: { en: "Contact", zh: "接触有效性" },
    description: {
      en: "Does the required contact or support actually occur before the affected object reacts? The relation must be visible and spatially valid.",
      zh: "受作用物体产生反应前，动作所需的接触或支撑是否实际发生？该关系必须可见且空间位置合理。",
    },
  },
  {
    id: "D2",
    name: { en: "Contact Region", zh: "接触区域" },
    description: {
      en: "Does contact occur on the correct functional part or surface, rather than an adjacent surface, empty space, or an impossible side?",
      zh: "接触是否发生在正确的功能部位或表面，而不是相邻表面、空气或不可能接触的一侧？",
    },
  },
  {
    id: "D3",
    name: { en: "Kinematic Execution", zh: "运动学执行" },
    description: {
      en: "Is the action performed and completed with a possible mechanism, direction, speed, range of motion, and coordinated body-object movement?",
      zh: "动作是否以可行的机制、方向、速度和运动范围执行并完成，人体与物体运动是否协调？",
    },
  },
  {
    id: "D4",
    name: { en: "Causal Physical Effect", zh: "因果物理效应" },
    description: {
      en: "Does the action visibly produce the expected physical result at the correct location and with a magnitude consistent with the applied force?",
      zh: "动作是否在正确位置产生可见的预期物理结果，且结果强度与作用力相符？",
    },
  },
  {
    id: "D5",
    name: { en: "Temporal Persistence", zh: "时序与持续性" },
    description: {
      en: "Does the result begin after its cause and then persist, dissipate, rebound, or settle naturally without premature appearance or disappearance?",
      zh: "结果是否在原因之后出现，并自然持续、消退、回弹或稳定，而不提前出现或突然消失？",
    },
  },
  {
    id: "D6",
    name: { en: "Human Biomechanical Response", zh: "人体生物力学响应" },
    description: {
      en: "Do posture, joint motion, muscular effort, recoil, and balance match the direction and magnitude of the applied force and resistance?",
      zh: "人体姿态、关节运动、肌肉发力、反冲和平衡是否与作用力和阻力的方向及大小相符？",
    },
  },
];

const DESCENDANTS = {
  D0: ["D1", "D2", "D3", "D4", "D5", "D6"],
  D1: ["D2", "D3", "D4", "D5", "D6"],
  D2: ["D3", "D4", "D5", "D6"],
  D3: ["D4", "D5", "D6"],
  D4: ["D5"],
  D5: [],
  D6: [],
};

const PROMPT_ZH = {
  bamboo_cutting: "一名人物正在切割竹子或编织植物材料。",
  beer_pouring: "一名人物正在将啤酒倒入容器。",
  brick_smashing: "一名人物徒手击打或破坏砖块等砌体物体。",
  car_wash: "一名人物正在使用可见泡沫或水清洗车辆。",
  drawer_table: "一名人物正在打开抽屉、储物格或折叠台面。",
  fabric_folding: "一名人物正在折叠或整理织物。",
  foamy_beverage: "一名人物正在倾倒泡沫或碳酸饮料。",
  fried_food: "一名人物正在从热油中捞取油炸食物。",
  glass_breaking: "一名人物正在击打并破坏玻璃。",
  granular_material: "一名人物正在挖掘、切削或移动颗粒材料。",
  hair_styling: "一名人物正在整理、扎起或编织头发。",
  ignition: "一名人物正在点燃物体。",
  meat_cutting: "一名人物正在切割或锯开肉类。",
  plant_leaves: "一名人物正在摘取或食用植物叶片。",
  plant_watering: "一名人物正在给植物浇水或喷水。",
  smoke: "人体-物体交互过程中出现了可见烟雾。",
  smoke_diffusion: "烟雾正在周围空气中扩散。",
  smoke_emission: "人体-物体交互过程产生了可见烟雾。",
  sparks: "人体-物体交互过程产生了可见火花。",
  sports: "一名人物正在击打或推动运动器材。",
  throw_catch: "一名人物正在抛出并接住物体。",
  vegetable_cutting: "一名人物正在切割蔬菜或水果。",
  vehicle_opening: "一名人物正在打开车门或车辆储物空间。",
  watermelon_cutting: "一名人物正在切割西瓜。",
  writing_surface: "一名人物正在板面或玻璃表面书写或绘画。",
};

// Per-category criteria turn the generic dimensions into concrete VQA prompts
// without exposing a reference answer for an individual video.
const CATEGORY_RUBRICS = {
  bamboo_cutting: {
    en: [
      "the person, cutting tool, bamboo or mat, and any separated material",
      "the cutting edge touching the material before and while force is applied",
      "the blade acting on the intended cutting line rather than an unrelated surface",
      "a controlled cutting or sawing action that progresses through the material",
      "a cut, indentation, fraying, or separation that corresponds to the blade motion",
      "material change beginning after contact and remaining after the tool moves away",
      "grip, arm effort, resistance, and balance appropriate to cutting a rigid material",
    ],
    zh: [
      "人物、切割工具、竹子或竹席以及产生的分离材料",
      "切削刃在施力前和施力过程中确实接触材料",
      "刀刃作用于预定切割位置，而不是无关表面",
      "受控的切割或锯切动作逐步穿过材料",
      "切口、压痕、纤维破裂或分离与刀刃运动相对应",
      "材料变化发生在接触之后，并在工具移开后保持",
      "握持、手臂用力、阻力反馈和平衡与切割刚性材料相符",
    ],
  },
  beer_pouring: {
    en: [
      "the person, source container, receiving glass, liquid, and foam",
      "the source container being supported and positioned above the receiving glass",
      "the outlet being aligned with the glass opening",
      "a controlled tilt, pour, and recovery of the source container",
      "a continuous liquid stream entering the glass without passing through solid surfaces",
      "flow beginning after the tilt, liquid levels changing consistently, and foam settling naturally",
      "hand support and wrist adjustment appropriate to the changing weight of the container",
    ],
    zh: [
      "人物、倒液容器、接收杯、液体和泡沫",
      "倒液容器被稳定支撑并位于接收杯上方",
      "容器出口与杯口正确对齐",
      "容器以受控方式倾斜、倒液并恢复姿态",
      "连续液流进入杯中且不穿过任何固体表面",
      "液流在倾斜后开始，液面变化一致，泡沫自然形成并消退",
      "手部支撑和手腕调整与容器重量变化相符",
    ],
  },
  brick_smashing: {
    en: [
      "the person, hand or impact tool, intact blocks, fragments, and support surface",
      "the hand or tool reaching the block before the block reacts",
      "the impact landing on a physically plausible face or edge of the target block",
      "a possible striking motion with coherent acceleration, impact, and follow-through",
      "cracking, displacement, dust, and fragments proportional to the visible impact",
      "breakage occurring after impact, followed by plausible fragment motion and settling",
      "arm deceleration, recoil, resistance, and balance appropriate to the impact",
    ],
    zh: [
      "人物、手或冲击工具、完整砖块、碎片和支撑表面",
      "手或工具先到达砖块，砖块随后才产生反应",
      "冲击落在目标砖块合理的表面或边缘",
      "击打动作具有连贯的加速、碰撞和随动过程",
      "裂纹、位移、粉尘和碎片数量与可见冲击强度相符",
      "破坏发生在碰撞之后，碎片随后以合理方式运动并静止",
      "手臂减速、反冲、阻力反馈和平衡与冲击强度相符",
    ],
  },
  car_wash: {
    en: [
      "the person, washing tool, vehicle surface, water, and foam",
      "the spray, sponge, or brush visibly reaching the vehicle surface",
      "the washing action occurring on the intended exterior area",
      "a plausible wiping, spraying, or rinsing motion with continuous tool control",
      "water or foam appearing at the tool or spray path and changing the contacted area",
      "water and foam following the washing pass, then flowing, dripping, spreading, or dissipating naturally",
      "hand pressure, reach, and posture appropriate to wiping or spraying the vehicle",
    ],
    zh: [
      "人物、清洗工具、车辆表面、水和泡沫",
      "水流、海绵或刷子确实到达车辆表面",
      "清洗作用发生在预定的车辆外表面",
      "擦洗、喷水或冲洗动作连续且工具控制合理",
      "水或泡沫沿工具或喷射位置出现，并改变接触区域",
      "水和泡沫在清洗动作后自然流动、滴落、扩散或消退",
      "手部压力、伸展范围和身体姿态与擦洗或喷水动作相符",
    ],
  },
  drawer_table: {
    en: [
      "the person, handle, drawer or panel, hinges or rails, and surrounding furniture",
      "the hand grasping or pushing a valid handle, edge, or support point",
      "force being applied at the part designed to open, close, slide, or fold",
      "the rigid panel rotating or sliding around a fixed hinge or rail without stretching or changing shape",
      "the drawer, door, bed, or table opening or closing while remaining attached to its support",
      "movement beginning after the push or pull and ending in a stable open or closed state",
      "grip, pulling or pushing effort, and body position appropriate to the furniture's resistance",
    ],
    zh: [
      "人物、把手、抽屉或面板、铰链或导轨以及周围家具",
      "手握住或推动有效的把手、边缘或支撑位置",
      "作用力施加在用于开合、滑动或折叠的功能部件上",
      "刚性面板围绕固定铰链或导轨转动或滑动，不发生伸缩或形变",
      "抽屉、柜门、折叠床或桌面在保持连接的情况下正确开合",
      "运动在推拉后开始，并停留在稳定的打开或关闭状态",
      "握持、推拉用力和身体位置与家具阻力相符",
    ],
  },
  fabric_folding: {
    en: [
      "the person, hands, fabric, garment edges, folds, and support surface",
      "the hands visibly grasping or supporting the fabric before it moves",
      "contact occurring at fabric regions that can produce the intended fold",
      "a gradual gathering, alignment, and folding process without sudden topology or size changes",
      "the fabric adopting the intended folded arrangement where the hands manipulate it",
      "folds appearing after manipulation and remaining without spontaneous duplication or unfolding",
      "finger motion, arm reach, and support appropriate to the fabric's weight and flexibility",
    ],
    zh: [
      "人物、双手、织物、衣物边缘、折痕和支撑表面",
      "双手在织物移动前确实抓住或支撑织物",
      "接触发生在能够形成预定折叠的织物区域",
      "织物被逐步收拢、对齐和折叠，不突然改变拓扑或尺寸",
      "织物在手部操作位置形成预期的折叠状态",
      "折痕在操作后出现并保持，不发生凭空复制或自动展开",
      "手指运动、手臂范围和支撑方式与织物重量和柔软性相符",
    ],
  },
  foamy_beverage: {
    en: [
      "the person, pouring vessel, receiver, liquid stream, bubbles, and foam",
      "the vessel being held and its outlet being positioned to pour into the receiver",
      "the outlet and stream being aligned with the receiver opening",
      "a controlled tilt and pour without abrupt vessel or liquid discontinuities",
      "liquid entering the receiver and foam forming in an amount consistent with the pour",
      "flow beginning after tilting, liquid volume changing consistently, and bubbles or foam evolving naturally",
      "hand support and wrist control appropriate to the vessel's weight and pouring angle",
    ],
    zh: [
      "人物、倒液容器、接收容器、液流、气泡和泡沫",
      "容器被稳定握持，出口位于能够向接收容器倒液的位置",
      "容器出口和液流与接收容器开口正确对齐",
      "倾斜和倒液过程受控，容器与液体不发生突然跳变",
      "液体进入接收容器，泡沫量与倒液过程相符",
      "液流在倾斜后开始，液体体积一致变化，气泡和泡沫自然演化",
      "手部支撑和手腕控制与容器重量和倾斜角度相符",
    ],
  },
  fried_food: {
    en: [
      "the person, utensil, fried food, oil, fryer or pan, and receiving surface",
      "the utensil visibly supporting or gripping the food before lifting",
      "the utensil contacting the underside or graspable part of the food",
      "a controlled lifting and transfer action that keeps the food supported",
      "the food leaving the oil with plausible dripping rather than passing through the utensil or container",
      "lifting occurring before transfer, oil dripping downward, and the food settling on the destination",
      "grip, wrist angle, and arm effort appropriate to lifting hot, oil-coated food",
    ],
    zh: [
      "人物、捞取工具、油炸食物、油、炸锅或平底锅以及接收表面",
      "工具在抬起前确实托住或夹住食物",
      "工具接触食物底部或可夹持部位",
      "抬起和转移动作受控，食物始终获得有效支撑",
      "食物离开油面并合理滴油，而不是穿过工具或容器",
      "先发生抬起再发生转移，油滴向下落，食物最终稳定放置",
      "握持、手腕角度和手臂用力与捞取高温含油食物相符",
    ],
  },
  glass_breaking: {
    en: [
      "the person, impact tool, intact glass, cracks, shards, and frame or support",
      "the tool visibly contacting the glass before any fracture response",
      "the impact landing on the intended glass surface rather than empty space or the frame",
      "a possible striking action with coherent acceleration, impact, and follow-through",
      "cracks or shards originating near the impact and matching the visible force",
      "fracture beginning after impact, shards then moving under gravity, and broken regions remaining broken",
      "arm deceleration, recoil, protective posture, and balance appropriate to striking glass",
    ],
    zh: [
      "人物、冲击工具、完整玻璃、裂纹、碎片和玻璃框架或支撑",
      "工具在玻璃破裂前确实接触玻璃",
      "冲击落在预定玻璃表面，而不是空气或边框上",
      "击打动作具有连贯的加速、碰撞和随动过程",
      "裂纹或碎片从碰撞附近产生，并与可见作用力相符",
      "玻璃在碰撞后破裂，碎片随后受重力运动，破裂区域保持破坏状态",
      "手臂减速、反冲、防护姿态和平衡与击打玻璃相符",
    ],
  },
  granular_material: {
    en: [
      "the person, tool, wood, soil or granular material, particles, and support surface",
      "the tool visibly engaging the material before particles or chips appear",
      "the working edge contacting the intended material region",
      "a plausible digging, scraping, sanding, drilling, or cutting action with continuous tool control",
      "particles, chips, dust, or displaced soil originating from the contacted area in a plausible amount",
      "particles appearing after tool action, moving under gravity or airflow, and then settling or dispersing",
      "grip, force, vibration response, and posture appropriate to the material resistance",
    ],
    zh: [
      "人物、工具、木材、土壤或颗粒材料、产生的颗粒和支撑表面",
      "工具先与材料接合，随后才出现颗粒、木屑或尘土",
      "工具工作边缘接触预定材料区域",
      "挖掘、刮削、打磨、钻孔或切削动作连续且工具控制合理",
      "颗粒、木屑、粉尘或土壤从接触区域产生，数量符合动作强度",
      "颗粒在工具作用后出现，随后受重力或气流运动并最终沉降或扩散",
      "握持、施力、振动反馈和身体姿态与材料阻力相符",
    ],
  },
  hair_styling: {
    en: [
      "the person, hands or styling tool, hair strands, hairstyle, and accessories",
      "the hand, comb, or accessory visibly contacting and controlling the hair",
      "contact occurring on the intended strands, scalp region, or hair section",
      "a gradual combing, gathering, tying, or braiding process without instantaneous hairstyle changes",
      "the hairstyle changing where and when the hair is manipulated",
      "the new arrangement appearing after manipulation and remaining without teleportation or spontaneous reconfiguration",
      "finger motion, arm position, and head response appropriate to handling the hair",
    ],
    zh: [
      "人物、手或造型工具、发丝、发型和发饰",
      "手、梳子或发饰确实接触并控制头发",
      "接触发生在预定发束、头皮区域或头发分区",
      "梳理、收拢、扎发或编发逐步进行，不瞬间改变发型",
      "发型变化发生在头发被操作的位置和时间",
      "新发型在操作后出现并保持，不发生瞬移或自动重组",
      "手指运动、手臂位置和头部反馈与整理头发相符",
    ],
  },
  ignition: {
    en: [
      "the person, ignition source, target object, flame, and surrounding support",
      "the ignition source visibly reaching the target before ignition",
      "heat, flame, or spark being applied to a plausible combustible area",
      "the ignition source being activated and handled with possible hand and body motion",
      "visible ignition or heat-induced change beginning at the affected area",
      "ignition following the trigger, then the flame burning, growing, moving, or extinguishing naturally",
      "hand control, protective posture, and withdrawal appropriate to heat and flame",
    ],
    zh: [
      "人物、点火源、目标物体、火焰和周围支撑",
      "点火源在燃烧开始前确实到达目标物体",
      "热量、火焰或火花作用于合理的可燃区域",
      "点火源被正确启动，并以物理上可能的手部和身体动作操作",
      "受作用区域出现可见点燃或受热变化",
      "点燃发生在触发动作之后，火焰随后自然燃烧、增长、移动或熄灭",
      "手部控制、防护姿态和撤离动作与热量和火焰相符",
    ],
  },
  meat_cutting: {
    en: [
      "the person, knife or saw, meat, bone, support surface, and separated portions",
      "the blade visibly contacting and loading the meat before a cut appears",
      "the cutting edge acting on the intended cut line while the meat is adequately supported",
      "a plausible slicing or sawing motion with pressure and progress through the material",
      "an incision, deformation, or separation occurring at the blade location",
      "the cut developing after blade passage and remaining, with fluids or pieces moving naturally",
      "grip, arm effort, resistance, and body position appropriate to cutting meat or bone",
    ],
    zh: [
      "人物、刀或锯、肉、骨骼、支撑表面和分离部分",
      "刀刃在切口出现前确实接触并压迫肉",
      "切削刃作用于预定切割线，同时肉获得充分支撑",
      "切片或锯切动作具有合理压力，并逐步穿过材料",
      "切口、形变或分离发生在刀刃所在位置",
      "刀刃经过后切口才形成并保持，液体或肉块以自然方式运动",
      "握持、手臂用力、阻力反馈和身体位置与切割肉或骨骼相符",
    ],
  },
  plant_leaves: {
    en: [
      "the person, hand or mouth, plant, target leaf or fruit, stem, and remaining foliage",
      "the hand, mouth, or tool visibly reaching and controlling the target plant part",
      "contact occurring on the leaf, fruit, or stem region relevant to picking or eating",
      "a plausible grasp, pull, pluck, or bite that progresses without abrupt disappearance",
      "the target part detaching, deforming, or losing material where it is grasped or bitten",
      "the change occurring after contact and remaining, while the plant and removed part move naturally",
      "finger or jaw effort, arm motion, and body response appropriate to the plant resistance",
    ],
    zh: [
      "人物、手或嘴、植物、目标叶片或果实、茎部和剩余枝叶",
      "手、嘴或工具确实到达并控制目标植物部位",
      "接触发生在与摘取或食用相关的叶片、果实或茎部",
      "抓握、拉扯、摘取或咬合动作合理进行，目标不突然消失",
      "目标部位在被抓住或咬住的位置发生脱离、形变或材料缺失",
      "变化发生在接触之后并保持，植物和移除部分以自然方式运动",
      "手指或下颌用力、手臂运动和身体反馈与植物阻力相符",
    ],
  },
  plant_watering: {
    en: [
      "the person, watering tool, plant, soil, water stream or droplets, and wet regions",
      "the water source being operated and the stream or spray visibly reaching the plant or soil",
      "the outlet being aimed at the intended plant or soil region",
      "a plausible trigger, tilt, pumping, or sweeping action that controls the water",
      "visible water or spray wetting the target and producing an appropriate leaf or soil response",
      "water beginning after tool activation, droplets falling naturally, and wetness persisting",
      "grip, finger operation, arm support, and posture appropriate to the watering tool",
    ],
    zh: [
      "人物、浇水工具、植物、土壤、水流或水滴以及湿润区域",
      "水源被实际启动，水流或水雾确实到达植物或土壤",
      "出水口朝向预定植物或土壤区域",
      "扳机、倾倒、泵压或扫动动作合理控制水流",
      "可见水流或水雾润湿目标，并引起合理的叶片或土壤反应",
      "水在工具启动后出现，水滴自然下落，湿润状态能够保持",
      "握持、手指操作、手臂支撑和姿态与浇水工具相符",
    ],
  },
  smoke: {
    en: [
      "the person, smoke-producing source, smoke plume, nearby objects, and background",
      "the visible action or heat source occurring before smoke is produced",
      "smoke originating from a physically plausible source location",
      "the triggering action being executed in a way that can produce smoke",
      "smoke being emitted with plausible direction, density, and interaction with nearby surfaces",
      "smoke appearing after its cause, then rising, spreading, thinning, and dissipating naturally",
      "posture, hand motion, and avoidance response appropriate to heat, smoke, or airflow",
    ],
    zh: [
      "人物、产烟源、烟雾团、附近物体和背景",
      "可见动作或热源发生在烟雾产生之前",
      "烟雾从物理上合理的源位置产生",
      "触发动作以能够产生烟雾的方式执行",
      "烟雾具有合理的方向、密度，并与附近表面正确交互",
      "烟雾在原因之后出现，随后自然上升、扩散、变淡和消散",
      "姿态、手部运动和回避反应与热量、烟雾或气流相符",
    ],
  },
  smoke_diffusion: {
    en: [
      "the person, smoke source, smoke plume, surrounding air, objects, and background",
      "the source process visibly occurring before smoke enters the air",
      "the plume beginning at the actual emission or heated region",
      "the source action and smoke release occurring without spatial discontinuities",
      "the plume moving and changing shape according to buoyancy, airflow, and obstacles",
      "smoke rising, spreading, thinning, and dissipating over time rather than remaining rigid or vanishing abruptly",
      "the person's posture and reaction matching the heat, smoke, and nearby airflow",
    ],
    zh: [
      "人物、烟雾源、烟雾团、周围空气、物体和背景",
      "产烟过程先发生，烟雾随后才进入空气",
      "烟雾团从真实排放点或受热区域开始",
      "产烟动作和烟雾释放在空间上连续，不发生位置跳变",
      "烟雾团根据浮力、气流和障碍物改变位置与形状",
      "烟雾随时间上升、扩散、变淡和消散，而不是保持刚性或突然消失",
      "人物姿态和反应与热量、烟雾和附近气流相符",
    ],
  },
  smoke_emission: {
    en: [
      "the person, emission source, smoke, nearby objects, and background",
      "the visible action or source state occurring before smoke emission",
      "smoke originating at the actual opening, contact point, or heated region",
      "the source being operated in a way that can physically emit smoke",
      "smoke emerging from the source rather than appearing elsewhere",
      "emission beginning after activation and evolving continuously while the source remains active",
      "the person's grip, posture, and reaction matching the active source and smoke",
    ],
    zh: [
      "人物、排烟源、烟雾、附近物体和背景",
      "可见动作或源状态先发生，随后才排出烟雾",
      "烟雾从真实开口、接触点或受热区域产生",
      "烟雾源以物理上能够排烟的方式被操作",
      "烟雾从源位置排出，而不是在其他位置凭空出现",
      "排烟在启动后开始，并在源保持工作时连续变化",
      "人物握持、姿态和反应与工作中的烟雾源相符",
    ],
  },
  sparks: {
    en: [
      "the person, powered tool, metal workpiece, contact point, sparks, and support",
      "the powered tool visibly contacting the metal while sparks are produced",
      "the abrasive or cutting edge acting on the intended metal region",
      "a plausible grinding or cutting orientation, pressure, and tool motion",
      "sparks originating at contact with direction and intensity consistent with friction or cutting",
      "sparks appearing only during effective contact, then cooling and disappearing after separation",
      "grip, vibration response, arm support, and protective posture appropriate to the tool",
    ],
    zh: [
      "人物、电动工具、金属工件、接触点、火花和支撑结构",
      "火花产生时电动工具确实接触金属",
      "磨削或切割边缘作用于预定金属区域",
      "磨削或切割的方向、压力和工具运动合理",
      "火花从接触点产生，方向和强度与摩擦或切割相符",
      "火花只在有效接触时出现，工具离开后逐渐冷却并消失",
      "握持、振动反馈、手臂支撑和防护姿态与工具工作状态相符",
    ],
  },
  sports: {
    en: [
      "the player, sports implement, ball or shuttle, playing surface, and nearby equipment",
      "the club, racket, cue, hand, or foot visibly contacting the ball or shuttle before it moves",
      "contact occurring on the correct striking surface and target region",
      "a possible swing, stroke, kick, or throw with coherent acceleration and follow-through",
      "the ball or shuttle moving after impact with plausible direction, speed, spin, and deformation",
      "motion beginning after contact and continuing through plausible flight, bounce, roll, or settling",
      "whole-body coordination, recoil, momentum transfer, and balance appropriate to the sports action",
    ],
    zh: [
      "运动者、运动器材、球或羽毛球、运动表面和附近设备",
      "球杆、球拍、球杆头、手或脚在球移动前确实接触目标",
      "接触发生在正确的击打面和目标部位",
      "挥击、推杆、踢球或投掷具有连贯的加速和随动过程",
      "球或羽毛球在碰撞后以合理的方向、速度、旋转和形变运动",
      "运动在接触后开始，并经历合理的飞行、反弹、滚动或静止",
      "全身协调、反冲、动量传递和平衡与运动动作相符",
    ],
  },
  throw_catch: {
    en: [
      "the person, hands, thrown object, surrounding space, and receiving position",
      "the hand supporting the object before release and establishing contact again at the catch",
      "the object being grasped or caught on a physically reachable surface",
      "a plausible arm acceleration, release, tracking movement, and catch",
      "the released object following a continuous ballistic path rather than teleporting or hovering",
      "release occurring after acceleration, flight preceding the catch, and the object becoming supported afterward",
      "arm motion, hand closure, impact absorption, and balance appropriate to throwing and catching",
    ],
    zh: [
      "人物、双手、被抛物体、周围空间和接取位置",
      "手在释放前支撑物体，并在接取时重新建立接触",
      "物体在人体可达到的表面被抓握或接住",
      "手臂加速、释放、跟随和接取过程合理",
      "物体释放后沿连续抛物线运动，而不是瞬移或悬浮",
      "先加速再释放，飞行发生在接取之前，接取后物体重新获得支撑",
      "手臂运动、手掌闭合、碰撞缓冲和平衡与抛接动作相符",
    ],
  },
  vegetable_cutting: {
    en: [
      "the person, knife, vegetable or fruit, cutting board, cut line, and resulting pieces",
      "the blade visibly contacting and loading the food before a cut appears",
      "the cutting edge acting on the intended line while the food is supported",
      "a plausible slicing or chopping motion with coherent downward or forward progress",
      "an incision or separation appearing at the blade location with a plausible number and shape of pieces",
      "the cut forming after blade passage and remaining, without extra pieces appearing or separated pieces rejoining",
      "grip, arm effort, finger clearance, and body posture appropriate to the cutting force",
    ],
    zh: [
      "人物、刀具、蔬菜或水果、砧板、切割线和产生的切块",
      "切口出现前刀刃确实接触并压迫食材",
      "食材获得支撑，切削刃作用于预定切割线",
      "切片或剁切动作具有连贯的向下或向前运动",
      "切口或分离发生在刀刃位置，切块数量和形状合理",
      "刀刃经过后切口才形成并保持，不凭空增加切块，也不自动重新连接",
      "握持、手臂用力、手指避让和身体姿态与切割力相符",
    ],
  },
  vehicle_opening: {
    en: [
      "the person, handle or latch, door or trunk panel, hinges, vehicle body, and interior",
      "the hand visibly grasping or operating the handle, latch, or panel before opening",
      "force being applied at the actual opening control or valid panel edge",
      "the rigid panel rotating or translating around its fixed hinge or mechanism without bending or changing size",
      "the door, trunk, or panel opening while remaining attached and revealing a consistent interior",
      "opening beginning after the pull or release and ending in a stable position without spontaneous reversal",
      "grip, pulling effort, arm motion, and body position appropriate to the panel's weight and resistance",
    ],
    zh: [
      "人物、把手或锁扣、车门或后备箱面板、铰链、车身和内部空间",
      "打开前手确实握住或操作把手、锁扣或面板",
      "作用力施加在真实开合控制件或有效面板边缘",
      "刚性面板围绕固定铰链或机构转动或平移，不弯曲也不改变尺寸",
      "车门、后备箱或面板在保持连接的情况下打开，并露出一致的内部空间",
      "开合在拉动或解锁后开始，最终停在稳定位置，不自动反向",
      "握持、拉动力、手臂运动和身体位置与面板重量和阻力相符",
    ],
  },
  watermelon_cutting: {
    en: [
      "the person, blade, watermelon, rind, flesh, support, and resulting portions",
      "the blade visibly contacting and loading the rind before separation",
      "the cutting edge acting on the intended line while the watermelon is supported",
      "a plausible cutting motion that progresses through rind and flesh",
      "rind and flesh separating along the blade path with plausible deformation and pieces",
      "separation occurring after blade passage and the resulting portions remaining separated and supported",
      "grip, arm effort, resistance, and balance appropriate to cutting a large dense fruit",
    ],
    zh: [
      "人物、刀刃、西瓜、瓜皮、果肉、支撑和产生的分块",
      "分离前刀刃确实接触并压迫瓜皮",
      "西瓜获得支撑，切削刃作用于预定切割线",
      "切割动作以合理方式逐步穿过瓜皮和果肉",
      "瓜皮和果肉沿刀刃路径分离，形变和分块合理",
      "刀刃经过后才发生分离，产生的分块保持分开并获得支撑",
      "握持、手臂用力、阻力反馈和平衡与切割大型致密水果相符",
    ],
  },
  writing_surface: {
    en: [
      "the person, hand, pen or marker, writing surface, existing marks, and new marks",
      "the pen or marker tip visibly contacting the surface while marks are created",
      "the tip acting on the intended writable region rather than empty space or the opposite side",
      "a controlled hand movement that keeps the tip aligned with the developing stroke",
      "new marks appearing directly at the moving tip rather than ahead of it or elsewhere",
      "marks appearing only after the tip passes and then remaining without spontaneous movement or erasure",
      "finger grip, wrist motion, arm support, and posture appropriate to writing on the surface",
    ],
    zh: [
      "人物、手、笔或马克笔、书写表面、已有笔迹和新增笔迹",
      "产生笔迹时笔尖确实接触书写表面",
      "笔尖作用于预定可书写区域，而不是空气或表面另一侧",
      "手部受控运动，笔尖始终与正在形成的笔画对齐",
      "新增笔迹直接出现在移动笔尖处，而不是提前或在其他位置出现",
      "笔迹只在笔尖经过后出现，并保持不动，不自动移动或消失",
      "手指握持、手腕运动、手臂支撑和姿态与书写动作相符",
    ],
  },
};

const TRANSLATIONS = {
  en: {
    languageLabel: "Language / 语言",
    studyTitle: "Human Physical-Plausibility Study",
    notStarted: "Not started",
    anonymousEvaluation: "Anonymous blinded evaluation",
    setupHeading: "Physical plausibility of generated human-object interactions",
    setupIntro: "You will evaluate 300 generated videos. The generating method, automatic scores, and reference answers are concealed. Video order is randomized.",
    protocolHeading: "Evaluation protocol",
    protocolScope: "Judge whether the human-object interaction obeys plausible contact, motion, cause-and-effect, timing, and body mechanics. Do not rate image quality, composition, aesthetics, or prompt alignment.",
    protocolWatch: "Watch the complete video at least once. Replay it whenever the relevant contact or physical result is unclear.",
    protocolLikert: "Rate the complete interaction from 1 to 5. A score of 1 means evidently physically implausible; a score of 5 means physically plausible.",
    protocolNodes: "Answer every displayed D0-D6 question independently using only visible video evidence. Select Unobservable only when the required event cannot be judged.",
    protocolSessions: "The 300 videos may be completed across multiple sessions. Progress is stored only in this browser until results are downloaded or submitted.",
    protocolExport: "After all 300 videos are complete, export the result JSON and return that file to the researcher. The filename contains an anonymous session identifier.",
    yes: "Yes",
    no: "No",
    unobservable: "Unobservable",
    unobservableShort: "U",
    yesDefinition: "physically valid",
    noDefinition: "visible physical violation",
    unobservableDefinition: "insufficient visible evidence",
    videos: "videos",
    categories: "interaction categories",
    dimensions: "CIPG dimensions",
    consent: "I consent to the anonymous research use of these ratings.",
    startEvaluation: "Start evaluation",
    continueEvaluation: "Continue evaluation",
    instructions: "Evaluation instructions",
    instructionScope: "Judge physical plausibility only, not visual quality, aesthetics, or prompt alignment. The guide defines all D0-D6 dimensions; the response form shows only dimensions relevant to this interaction.",
    instructionWatch: "Watch the complete video at least once before answering.",
    instructionRate: "Rate overall physical plausibility from 1 to 5: 1 means evidently implausible and 5 means physically plausible.",
    instructionLabel: "Then answer each case-specific D0-D6 question independently; one answer must not determine another.",
    instructionEvidence: "Yes = physically valid; No = a visible violation; Unobservable = insufficient visible evidence. Do not infer events that are not shown.",
    instructionNoGuess: "Use Unobservable only when the relevant event is hidden, outside the frame, or genuinely ambiguous. A visible abnormal event should be labeled No.",
    blinded: "Method and automatic results hidden",
    scenario: "Scenario",
    overallPlausibility: "Overall physical plausibility",
    likertPrompt: "How physically plausible is the complete interaction process?",
    evidentlyImplausible: "Evidently implausible",
    physicallyPlausible: "Physically plausible",
    cipgDimensions: "CIPG dimensions",
    nodeVerdicts: "Node-wise judgments",
    rateOverallFirst: "Select the overall rating first",
    replayVideo: "Replay video",
    previous: "Previous",
    saveContinue: "Save and continue",
    completeStudy: "Complete study",
    evaluationComplete: "Evaluation complete",
    downloadJson: "Export result JSON",
    submitResponses: "Submit responses",
    savedLocally: "Saved in this browser",
    autoSavedAt: (time) => `Auto-saved at ${time}`,
    restoredProgress: (completed, total, time) => `Restored ${completed} / ${total} · last saved ${time}`,
    saveFailed: "Automatic save failed",
    completeOverall: "Select an overall rating",
    completeNodes: "Label every listed node",
    videoOf: (current, total) => `Video ${current} of ${total}`,
    completionSummary: (total) => `${total} videos were evaluated. Export the result JSON and return it to the researcher before closing this page.`,
    submitting: "Submitting...",
    submitted: "Responses submitted.",
    submissionFailed: (message) => `Submission failed: ${message}`,
  },
  zh: {
    languageLabel: "语言 / Language",
    studyTitle: "人体-物体交互物理合理性人工评估",
    notStarted: "尚未开始",
    anonymousEvaluation: "匿名盲评",
    setupHeading: "生成式人体-物体交互视频的物理合理性评估",
    setupIntro: "你将评估 300 个生成视频。生成方法、自动评分结果和参考答案均被隐藏，视频顺序随机排列。",
    protocolHeading: "评估流程",
    protocolScope: "判断人体-物体交互中的接触、运动、因果结果、时序和人体受力是否符合物理规律。不要评价画质、构图、美观程度或提示词一致性。",
    protocolWatch: "作答前至少完整观看一次视频。接触过程或物理结果不清楚时，可以重复播放。",
    protocolLikert: "使用 1–5 分评价完整交互过程。1 分表示明显不符合物理规律，5 分表示符合物理规律。",
    protocolNodes: "仅依据视频中的可见证据，独立回答作答区显示的每个 D0–D6 问题。只有无法判断相关事件时才选择“不可观察”。",
    protocolSessions: "300 个视频可以分多次完成。下载或提交结果前，进度仅保存在当前浏览器中。",
    protocolExport: "完成全部 300 个视频后，导出结果 JSON 并将文件交给研究者。文件名包含匿名会话编号。",
    yes: "是",
    no: "否",
    unobservable: "不可观察",
    unobservableShort: "不可观察",
    yesDefinition: "符合物理规律",
    noDefinition: "存在可见物理违例",
    unobservableDefinition: "可见证据不足",
    videos: "个视频",
    categories: "类交互场景",
    dimensions: "个 CIPG 维度",
    consent: "我同意将这些匿名评分用于学术研究。",
    startEvaluation: "开始评估",
    continueEvaluation: "继续评估",
    instructions: "评估说明",
    instructionScope: "只判断物理合理性，不评价画质、美观程度或提示词一致性。下方定义完整 D0–D6；作答区只显示与当前交互相关的维度。",
    instructionWatch: "作答前至少完整观看一次视频。",
    instructionRate: "先评价整体物理合理性：1 分表示明显不合理，5 分表示符合物理规律。",
    instructionLabel: "再独立回答当前样本对应的每个 D0–D6 具体问题，一个维度的答案不能代替另一个维度。",
    instructionEvidence: "“是”表示符合物理规律；“否”表示存在可见违例；“不可观察”表示可见证据不足。不要推断视频未展示的事件。",
    instructionNoGuess: "只有相关事件被遮挡、位于画面外或确实无法判断时才选择“不可观察”；已经可见的异常应选择“否”。",
    blinded: "生成方法与自动评分结果已隐藏",
    scenario: "场景",
    overallPlausibility: "整体物理合理性",
    likertPrompt: "该视频中的完整交互过程在物理上是否合理？",
    evidentlyImplausible: "明显不符合物理规律",
    physicallyPlausible: "符合物理规律",
    cipgDimensions: "CIPG 评估维度",
    nodeVerdicts: "逐节点判断",
    rateOverallFirst: "请先完成整体评分",
    replayVideo: "重新播放视频",
    previous: "上一个",
    saveContinue: "保存并继续",
    completeStudy: "完成评估",
    evaluationComplete: "评估完成",
    downloadJson: "导出结果 JSON",
    submitResponses: "提交结果",
    savedLocally: "已保存在当前浏览器",
    autoSavedAt: (time) => `已自动保存 · ${time}`,
    restoredProgress: (completed, total, time) => `已恢复 ${completed} / ${total} · 上次保存 ${time}`,
    saveFailed: "自动保存失败",
    completeOverall: "请选择整体评分",
    completeNodes: "请标注页面列出的所有节点",
    videoOf: (current, total) => `第 ${current} / ${total} 个视频`,
    completionSummary: (total) => `已完成 ${total} 个视频的评估。关闭页面前，请导出结果 JSON 并将文件交给研究者。`,
    submitting: "正在提交……",
    submitted: "结果已提交。",
    submissionFailed: (message) => `提交失败：${message}`,
  },
};

const state = {
  manifest: null,
  assignment: [],
  ratings: {},
  sessionId: "",
  currentIndex: 0,
  startedAt: null,
  completedAt: null,
  consentedAt: null,
  lastSavedAt: null,
  language: localStorage.getItem("phyhoi-human-alignment:language") || "en",
};

const $ = (selector) => document.querySelector(selector);
const t = (key, ...args) => {
  const value = TRANSLATIONS[state.language]?.[key] ?? TRANSLATIONS.en[key] ?? key;
  return typeof value === "function" ? value(...args) : value;
};

function anonymousCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const values = crypto.getRandomValues(new Uint8Array(12));
  return Array.from(values, (value) => alphabet[value % alphabet.length]).join("");
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(items, random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function randomizedAssignment(samples, sessionId) {
  return shuffle(samples, seededRandom(hashString(sessionId)));
}

function recordKey() {
  return `phyhoi-human-alignment:v3:${state.sessionId}`;
}

function savedRecord() {
  try {
    return JSON.parse(localStorage.getItem(recordKey()) || "null");
  } catch {
    return null;
  }
}

function displayTime(isoValue) {
  const date = isoValue ? new Date(isoValue) : new Date();
  if (Number.isNaN(date.getTime())) return "--:--";
  return new Intl.DateTimeFormat(state.language === "zh" ? "zh-CN" : "en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function completedCount() {
  return state.assignment.filter((sample) => (
    ratingComplete(sample, state.ratings[sample.sample_id])
  )).length;
}

function persist() {
  if (!state.sessionId || !state.assignment.length) return;
  state.lastSavedAt = new Date().toISOString();
  try {
    localStorage.setItem(
      recordKey(),
      JSON.stringify({
        sessionId: state.sessionId,
        assignmentIds: state.assignment.map((sample) => sample.sample_id),
        ratings: state.ratings,
        currentIndex: state.currentIndex,
        startedAt: state.startedAt,
        completedAt: state.completedAt,
        consentedAt: state.consentedAt,
        lastSavedAt: state.lastSavedAt,
        language: state.language,
      }),
    );
    $("#saveState").textContent = t("autoSavedAt", displayTime(state.lastSavedAt));
  } catch {
    $("#saveState").textContent = t("saveFailed");
  }
}

function restoreSavedRecord(saved) {
  if (!saved?.assignmentIds?.length || !state.manifest?.samples?.length) return false;
  const byId = new Map(state.manifest.samples.map((sample) => [sample.sample_id, sample]));
  const assignment = saved.assignmentIds.map((id) => byId.get(id)).filter(Boolean);
  if (!assignment.length) return false;
  state.assignment = assignment;
  state.ratings = saved.ratings || {};
  state.currentIndex = Math.max(
    0,
    Math.min(Number(saved.currentIndex) || 0, assignment.length - 1),
  );
  state.startedAt = saved.startedAt || new Date().toISOString();
  state.completedAt = saved.completedAt || null;
  state.consentedAt = saved.consentedAt || null;
  state.lastSavedAt = saved.lastSavedAt || null;
  if (saved.language === "en" || saved.language === "zh") {
    state.language = saved.language;
    localStorage.setItem("phyhoi-human-alignment:language", state.language);
  }
  return true;
}

function activeMap(sample) {
  const activation = sample.activation || {};
  const hasExplicitActivation = Object.keys(activation).length > 0;
  return Object.fromEntries(
    NODE_DEFINITIONS.map(({ id }) => [id, hasExplicitActivation ? Boolean(activation[id]) : true]),
  );
}

function blockedNodes(verdicts, active) {
  const blocked = new Set();
  NODE_DEFINITIONS.forEach(({ id }) => {
    if (active[id] && verdicts[id] === "no") {
      DESCENDANTS[id].forEach((descendant) => {
        if (active[descendant]) blocked.add(descendant);
      });
    }
  });
  return blocked;
}

function currentRating() {
  const sample = state.assignment[state.currentIndex];
  if (!state.ratings[sample.sample_id]) {
    state.ratings[sample.sample_id] = {
      overallPlausibility: null,
      verdicts: {},
      viewedAt: new Date().toISOString(),
    };
  }
  return state.ratings[sample.sample_id];
}

function firstFailedNode(verdicts, active) {
  return NODE_DEFINITIONS.map(({ id }) => id).find(
    (node) => active[node] && verdicts[node] === "no",
  );
}

function renderLikert() {
  const rating = currentRating();
  const scale = $("#likertScale");
  scale.innerHTML = "";
  for (let value = 1; value <= 5; value += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "likert-button";
    button.textContent = String(value);
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(rating.overallPlausibility === value));
    if (rating.overallPlausibility === value) button.classList.add("selected");
    button.addEventListener("click", () => {
      rating.overallPlausibility = value;
      renderLikert();
      renderNodes();
      persist();
    });
    scale.appendChild(button);
  }
}

function caseSpecificQuestion(sample, nodeId) {
  const rubric = CATEGORY_RUBRICS[sample.category]?.[state.language];
  const generic = NODE_DEFINITIONS.find(({ id }) => id === nodeId)?.description[state.language] || "";
  if (!rubric) return generic;

  const index = Number(nodeId.slice(1));
  const focus = rubric[index];
  if (!focus) return generic;

  const templates = {
    en: {
      D0: `Throughout this video, do ${focus} remain recognizable, intact, and structurally consistent? Check for unexplained appearance, disappearance, duplication, merging, or material change.`,
      D1: `Is the required contact or support clearly visible and physically established? In this case, check for ${focus}.`,
      D2: `Is force applied at the correct functional location? In this case, check for ${focus}.`,
      D3: `Is the action executed and completed with physically possible motion? In this case, check for ${focus}.`,
      D4: `Does the action visibly produce the expected physical result? In this case, check for ${focus}.`,
      D5: `Are causal order, duration, and persistence physically plausible? In this case, check for ${focus}.`,
      D6: `Does the person's biomechanical response match the interaction? In this case, check for ${focus}.`,
    },
    zh: {
      D0: `在整个视频中，${focus}是否保持可识别、完整且结构一致？检查是否发生无原因的出现、消失、复制、融合或材料变化。`,
      D1: `动作所需的接触或支撑是否清晰可见并真实成立？本样本重点检查：${focus}。`,
      D2: `作用力是否施加在正确的功能位置？本样本重点检查：${focus}。`,
      D3: `动作是否通过物理上可能的运动执行并完成？本样本重点检查：${focus}。`,
      D4: `动作是否产生可见且符合预期的物理结果？本样本重点检查：${focus}。`,
      D5: `因果顺序、持续时间和结果保持是否符合物理规律？本样本重点检查：${focus}。`,
      D6: `人体生物力学反馈是否与当前交互相符？本样本重点检查：${focus}。`,
    },
  };
  return templates[state.language][nodeId] || generic;
}

function renderNodes() {
  const sample = state.assignment[state.currentIndex];
  const rating = currentRating();
  const active = activeMap(sample);
  const container = $("#nodeList");
  container.innerHTML = "";

  if (!rating.overallPlausibility) {
    const notice = document.createElement("div");
    notice.className = "rating-notice";
    notice.innerHTML = `<i data-lucide="arrow-up"></i><span>${t("rateOverallFirst")}</span>`;
    container.appendChild(notice);
  }

  NODE_DEFINITIONS.forEach(({ id, name, description }) => {
    if (!active[id]) return;
    const row = document.createElement("div");
    row.className = "node-row";
    if (!rating.overallPlausibility) row.classList.add("awaiting-overall");

    const copy = document.createElement("div");
    copy.innerHTML = `
      <div class="node-name"><b>${id}</b><span>${name[state.language]}</span></div>
      <div class="node-question">${caseSpecificQuestion(sample, id)}</div>
      <div class="node-description">${description[state.language]}</div>
    `;
    row.appendChild(copy);

    const control = document.createElement("div");
    control.className = "verdict-control";
    [
      ["yes", t("yes")],
      ["no", t("no")],
      ["unobservable", t("unobservableShort")],
    ].forEach(([value, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.value = value;
      button.textContent = label;
      if (value === "unobservable") {
        button.title = t("unobservable");
        button.setAttribute("aria-label", t("unobservable"));
      }
      button.disabled = !rating.overallPlausibility;
      if (rating.verdicts[id] === value) button.classList.add("selected");
      button.addEventListener("click", () => {
        rating.verdicts[id] = value;
        renderNodes();
        persist();
      });
      control.appendChild(button);
    });
    row.appendChild(control);
    container.appendChild(row);
  });

  if (window.lucide) lucide.createIcons();
}

function renderDimensionGuide() {
  const guide = $("#dimensionGuide");
  if (!guide) return;
  guide.innerHTML = "";
  NODE_DEFINITIONS.forEach(({ id, name, description }) => {
    const item = document.createElement("div");
    item.className = `dimension-guide-item dimension-${id.toLowerCase()}`;
    item.innerHTML = `
      <div class="dimension-guide-name"><b>${id}</b><span>${name[state.language]}</span></div>
      <p>${description[state.language]}</p>
    `;
    guide.appendChild(item);
  });
}

function promptForStudy(sample) {
  if (state.language === "zh" && PROMPT_ZH[sample.category]) {
    return PROMPT_ZH[sample.category];
  }
  return sample.study_prompt || sample.prompt || sample.category_label || "";
}

function renderCurrent() {
  const sample = state.assignment[state.currentIndex];
  $("#sampleIndex").textContent = t("videoOf", state.currentIndex + 1, state.assignment.length);
  $("#samplePrompt").textContent = promptForStudy(sample);
  $("#studyVideo").src = sample.video;
  $("#studyVideo").load();
  $("#previousButton").disabled = state.currentIndex === 0;
  $("#nextButton").innerHTML =
    state.currentIndex === state.assignment.length - 1
      ? `<span>${t("completeStudy")}</span><i data-lucide="check"></i>`
      : `<span>${t("saveContinue")}</span><i data-lucide="arrow-right"></i>`;
  renderLikert();
  renderNodes();
  updateProgress();
  applyTranslations();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function ratingComplete(sample, rating) {
  if (!rating?.overallPlausibility) return false;
  const active = activeMap(sample);
  return NODE_DEFINITIONS.every(({ id }) => !active[id] || Boolean(rating.verdicts[id]));
}

function validateCurrent() {
  const sample = state.assignment[state.currentIndex];
  const rating = currentRating();
  if (!rating.overallPlausibility) {
    $("#saveState").textContent = t("completeOverall");
    $(".likert-panel").scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }
  if (!ratingComplete(sample, rating)) {
    $("#saveState").textContent = t("completeNodes");
    $("#nodeList").scrollIntoView({ behavior: "smooth", block: "start" });
    return false;
  }
  return true;
}

function updateProgress() {
  const completed = completedCount();
  const total = state.assignment.length || state.manifest?.sample_total || 300;
  $("#progressLabel").textContent = `${completed} / ${total}`;
  $("#progressFill").style.width = `${total ? (completed / total) * 100 : 0}%`;
}

function resultPayload() {
  const assignments = state.assignment.map((sample, order) => {
    const rating = state.ratings[sample.sample_id] || {
      overallPlausibility: null,
      verdicts: {},
    };
    const active = activeMap(sample);
    const blocked = blockedNodes(rating.verdicts, active);
    const postGatedVerdicts = Object.fromEntries(
      NODE_DEFINITIONS.map(({ id }) => {
        if (!active[id]) return [id, "inactive"];
        if (blocked.has(id)) return [id, "gated_no"];
        return [id, rating.verdicts[id] || null];
      }),
    );
    return {
      order: order + 1,
      sample_id: sample.sample_id,
      media_id: sample.media_id,
      category: sample.category,
      overall_physical_plausibility: rating.overallPlausibility,
      raw_node_labels: rating.verdicts,
      post_gated_node_labels: postGatedVerdicts,
      first_failed_node: firstFailedNode(rating.verdicts, active) || null,
    };
  });
  const overallRatings = assignments
    .map((item) => item.overall_physical_plausibility)
    .filter((value) => Number.isInteger(value));
  return {
    schema_version: "phyhoi-human-alignment-v3",
    anonymous_session_id: state.sessionId,
    language: state.language,
    started_at: state.startedAt,
    completed_at: state.completedAt || new Date().toISOString(),
    summary: {
      completed_videos: assignments.filter((item) => item.overall_physical_plausibility).length,
      mean_overall_physical_plausibility: overallRatings.length
        ? Number((overallRatings.reduce((sum, value) => sum + value, 0) / overallRatings.length).toFixed(6))
        : null,
    },
    assignment: assignments,
  };
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function toCsv(payload) {
  const nodeColumns = NODE_DEFINITIONS.flatMap(({ id }) => [
    `${id}_raw`,
    `${id}_post_gated`,
  ]);
  const rows = [[
    "anonymous_session_id",
    "order",
    "sample_id",
    "media_id",
    "category",
    "overall_physical_plausibility",
    ...nodeColumns,
    "first_failed_node",
  ]];
  payload.assignment.forEach((item) => {
    rows.push([
      payload.anonymous_session_id,
      item.order,
      item.sample_id,
      item.media_id,
      item.category,
      item.overall_physical_plausibility ?? "",
      ...NODE_DEFINITIONS.flatMap(({ id }) => [
        item.raw_node_labels[id] || "",
        item.post_gated_node_labels[id] || "",
      ]),
      item.first_failed_node || "",
    ]);
  });
  return rows
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

function completeStudy() {
  state.completedAt = state.completedAt || new Date().toISOString();
  persist();
  $("#studyView").hidden = true;
  $("#completeView").hidden = false;
  $("#completionSummary").textContent = t("completionSummary", state.assignment.length);
  const endpoint = window.PHYHOI_CONFIG?.submissionEndpoint;
  $("#submitResults").hidden = !endpoint;
  updateProgress();
  applyTranslations();
}

async function submitResults() {
  const endpoint = window.PHYHOI_CONFIG?.submissionEndpoint;
  if (!endpoint) return;
  const button = $("#submitResults");
  button.disabled = true;
  $("#submitStatus").textContent = t("submitting");
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resultPayload()),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    $("#submitStatus").textContent = t("submitted");
  } catch (error) {
    $("#submitStatus").textContent = t("submissionFailed", error.message);
    button.disabled = false;
  }
}

function applyTranslations() {
  document.documentElement.lang = state.language === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    element.title = t(element.dataset.i18nTitle);
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.language === state.language);
  });
  renderDimensionGuide();
  const saved = state.sessionId ? savedRecord() : null;
  $("#startButtonLabel").textContent =
    saved?.assignmentIds?.length ? t("continueEvaluation") : t("startEvaluation");
  if (!$("#studyView").hidden && state.assignment.length) {
    $("#sampleIndex").textContent = t("videoOf", state.currentIndex + 1, state.assignment.length);
    $("#samplePrompt").textContent = promptForStudy(state.assignment[state.currentIndex]);
    $("#nextButton").innerHTML =
      state.currentIndex === state.assignment.length - 1
        ? `<span>${t("completeStudy")}</span><i data-lucide="check"></i>`
        : `<span>${t("saveContinue")}</span><i data-lucide="arrow-right"></i>`;
  }
  if (!$("#completeView").hidden && state.assignment.length) {
    $("#completionSummary").textContent = t("completionSummary", state.assignment.length);
  }
  if (state.assignment.length && state.lastSavedAt) {
    $("#saveState").textContent = t("autoSavedAt", displayTime(state.lastSavedAt));
  }
  if (window.lucide) lucide.createIcons();
}

async function initialize() {
  state.sessionId =
    localStorage.getItem("phyhoi-human-alignment:session-id") || anonymousCode();
  localStorage.setItem("phyhoi-human-alignment:session-id", state.sessionId);

  const manifestPath = window.PHYHOI_CONFIG?.sampleManifest || "./data/samples.json";
  const response = await fetch(manifestPath);
  if (!response.ok) throw new Error(`Unable to load sample manifest: ${response.status}`);
  state.manifest = await response.json();

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => {
      state.language = button.dataset.language;
      localStorage.setItem("phyhoi-human-alignment:language", state.language);
      applyTranslations();
      if (!$("#studyView").hidden && state.assignment.length) {
        renderLikert();
        renderNodes();
      }
      persist();
    });
  });

  $("#setupForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const saved = savedRecord();
    restoreSavedRecord(saved);
    if (!state.assignment.length) {
      state.assignment = randomizedAssignment(state.manifest.samples, state.sessionId);
      state.ratings = {};
      state.currentIndex = 0;
      state.startedAt = new Date().toISOString();
      state.consentedAt = new Date().toISOString();
      state.completedAt = null;
    }
    $("#setupView").hidden = true;
    $("#studyView").hidden = false;
    renderCurrent();
    persist();
  });

  $("#replayButton").addEventListener("click", () => {
    $("#studyVideo").currentTime = 0;
    $("#studyVideo").play();
  });
  $("#previousButton").addEventListener("click", () => {
    if (state.currentIndex > 0) {
      state.currentIndex -= 1;
      renderCurrent();
      persist();
    }
  });
  $("#ratingForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateCurrent()) return;
    if (state.currentIndex === state.assignment.length - 1) {
      completeStudy();
      return;
    }
    state.currentIndex += 1;
    renderCurrent();
    persist();
  });
  $("#downloadJson").addEventListener("click", () => {
    download(
      `phyhoi-response-${state.sessionId}.json`,
      JSON.stringify(resultPayload(), null, 2),
      "application/json",
    );
  });
  $("#submitResults").addEventListener("click", submitResults);
  applyTranslations();

  const saved = savedRecord();
  if (restoreSavedRecord(saved)) {
    $("#setupView").hidden = true;
    if (state.completedAt && completedCount() === state.assignment.length) {
      completeStudy();
    } else {
      $("#studyView").hidden = false;
      renderCurrent();
      $("#saveState").textContent = t(
        "restoredProgress",
        completedCount(),
        state.assignment.length,
        displayTime(state.lastSavedAt),
      );
    }
  } else {
    updateProgress();
  }

  window.addEventListener("pagehide", persist);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") persist();
  });
}

initialize().catch((error) => {
  document.body.innerHTML = `<main><h1>Study unavailable</h1><p>${error.message}</p></main>`;
});
