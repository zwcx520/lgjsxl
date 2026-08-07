/* =========================================================
 *  健身训练系统 - 数据库
 *  动作库 / 训练计划 / 饮食方案
 * ========================================================= */

// ---------------- 动作库 ----------------
const EXERCISE_DB = {
  // ===== 胸部 =====
  chest: {
    name: '胸部',
    icon: 'fa-heart-pulse',
    color: '#ef4444',
    exercises: [
      { id:'ch1', name:'杠铃卧推', en:'Barbell Bench Press', difficulty:'中级', muscle:'胸大肌', equipment:'杠铃', mechanic:'复合', desc:'经典上肢力量动作,全面发展胸大肌厚度与力量。', steps:['仰卧凳上,双脚踏实地面','双手握距略宽于肩,控制杠铃下放至胸口','发力推起至起始位置,全程肩胛后缩'], tips:['肩胛骨后缩下沉,保护肩关节','臀部不离开凳面,避免过度挺腰','控制下放速度(2-3秒)'], muscles:['胸大肌','三角肌前束','肱三头肌'] },
      { id:'ch2', name:'上斜哑铃卧推', en:'Incline Dumbbell Press', difficulty:'中级', muscle:'胸大肌上束', equipment:'哑铃', mechanic:'复合', desc:'针对胸大肌上束,塑造饱满上胸轮廓。', steps:['调整凳面角度30-45度','哑铃起始位于肩部外侧','垂直推起至哑铃相触'], tips:['角度不宜过大,避免三角肌主导','肘部约呈45度夹角','顶峰保持1秒收缩'], muscles:['胸大肌上束','三角肌前束','肱三头肌'] },
      { id:'ch3', name:'下斜卧推', en:'Decline Bench Press', difficulty:'中级', muscle:'胸大肌下束', equipment:'杠铃', mechanic:'复合', desc:'强化下胸线条,塑造清晰下沿。', steps:['调整凳面下斜15-30度','握距与平卧相同','推起控制轨迹'], tips:['使用安全架或保护者','下放位置在胸下沿','避免过度低头充血'], muscles:['胸大肌下束','肱三头肌'] },
      { id:'ch4', name:'哑铃飞鸟', en:'Dumbbell Fly', difficulty:'初级', muscle:'胸大肌', equipment:'哑铃', mechanic:'孤立', desc:'孤立胸肌拉伸,塑造胸肌外沿线条。', steps:['哑铃位于胸部上方,微屈肘','沿弧线下放至胸侧','弧线合拢至顶部'], tips:['肘部保持固定角度','感受胸肌拉伸感','重量不必过大'], muscles:['胸大肌'] },
      { id:'ch5', name:'俯卧撑', en:'Push-up', difficulty:'初级', muscle:'胸大肌', equipment:'自重', mechanic:'复合', desc:'经典自重动作,随时随地训练。', steps:['双手撑地略宽于肩','身体保持一条直线','下放至胸近地面后推起'], tips:['核心收紧不塌腰','肘部约45度夹角','下放控制2秒'], muscles:['胸大肌','三角肌前束','肱三头肌','核心'] },
      { id:'ch6', name:'双杠臂屈伸', en:'Dips', difficulty:'高级', muscle:'胸大肌下束', equipment:'双杠', mechanic:'复合', desc:'上肢力量之王,同时强化胸下沿与三头。', steps:['双杠支撑身体','微前倾刺激胸部','下放至上臂平行于地面'], tips:['前倾越多胸肌参与越多','避免过度下沉伤肩','初学可用弹力带辅助'], muscles:['胸大肌下束','肱三头肌','三角肌前束'] },
      { id:'ch7', name:'绳索夹胸', en:'Cable Fly', difficulty:'中级', muscle:'胸大肌', equipment:'绳索', mechanic:'孤立', desc:'持续张力夹胸,塑造胸肌中缝。', steps:['绳索调至合适高度','双手握柄前倾微屈膝','弧线夹拢至胸前'], tips:['顶峰收缩2秒','保持微屈肘','躯干略前倾'], muscles:['胸大肌'] },
      { id:'ch8', name:'器械推胸', en:'Machine Chest Press', difficulty:'初级', muscle:'胸大肌', equipment:'器械', mechanic:'复合', desc:'轨迹固定,适合新手建立力量。', steps:['调整座椅高度,把手位于胸部','握把发力前推','控制回放'], tips:['背部贴紧靠背','肩胛后缩','匀速控制'], muscles:['胸大肌','三角肌前束','肱三头肌'] }
    ]
  },

  // ===== 背部 =====
  back: {
    name: '背部',
    icon: 'fa-person-rays',
    color: '#3b82f6',
    exercises: [
      { id:'bk1', name:'硬拉', en:'Deadlift', difficulty:'高级', muscle:'背部/后链', equipment:'杠铃', mechanic:'复合', desc:'力量之王,全面发展后链与核心。', steps:['杠铃位于脚掌中部','握杠屈髋下沉肩胛','伸髋伸膝拉起至中立位'], tips:['背部保持中立不圆肩','杠铃贴近身体','全程核心收紧'], muscles:['竖脊肌','臀大肌','腘绳肌','背阔肌','斜方肌'] },
      { id:'bk2', name:'引体向上', en:'Pull-up', difficulty:'高级', muscle:'背阔肌', equipment:'自重', mechanic:'复合', desc:'背阔肌王牌动作,塑造倒三角体型。', steps:['双手宽握悬挂','肩胛下沉启动','拉至下巴过杠'], tips:['避免借力摆动','顶峰收缩1秒','下放完全伸展'], muscles:['背阔肌','肱二头肌','斜方肌中下束'] },
      { id:'bk3', name:'杠铃划船', en:'Barbell Row', difficulty:'中级', muscle:'背阔肌', equipment:'杠铃', mechanic:'复合', desc:'增加背部厚度的基础复合动作。', steps:['屈髋微屈膝,背部中立','握杠拉至下腹位置','控制下放'], tips:['避免圆背','肘部贴近身体','顶峰肩胛后缩'], muscles:['背阔肌','斜方肌','菱形肌','肱二头肌'] },
      { id:'bk4', name:'高位下拉', en:'Lat Pulldown', difficulty:'初级', muscle:'背阔肌', equipment:'绳索', mechanic:'复合', desc:'引体向上的替代动作,适合新手。', steps:['坐稳固定双腿','宽握把手下拉至上胸','控制回放'], tips:['避免后仰借力','肩胛下沉启动','肘部向下向后'], muscles:['背阔肌','肱二头肌'] },
      { id:'bk5', name:'坐姿划船', en:'Seated Cable Row', difficulty:'初级', muscle:'背阔肌', equipment:'绳索', mechanic:'复合', desc:'水平拉背,强化背部厚度。', steps:['双脚踏实踏板','膝微屈保持稳定','拉至腹部肩胛后缩'], tips:['背部保持中立','避免过度后仰','顶峰收缩2秒'], muscles:['背阔肌','斜方肌','菱形肌'] },
      { id:'bk6', name:'T杠划船', en:'T-Bar Row', difficulty:'中级', muscle:'背阔肌', equipment:'杠铃', mechanic:'复合', desc:'稳定支撑下的厚度拉背动作。', steps:['站于杠铃一侧','双手拉起杠铃至胸腹','控制下放'], tips:['躯干约45度','肩胛后缩发力','避免圆背'], muscles:['背阔肌','斜方肌','菱形肌'] },
      { id:'bk7', name:'直臂下拉', en:'Straight Arm Pulldown', difficulty:'初级', muscle:'背阔肌', equipment:'绳索', mechanic:'孤立', desc:'孤立背阔肌,无肱二头肌参与。', steps:['站于绳索前,微屈肘','直臂下压至大腿前','控制回放'], tips:['肘部保持固定','肩胛下沉','感受背阔发力'], muscles:['背阔肌'] },
      { id:'bk8', name:'面拉', en:'Face Pull', difficulty:'初级', muscle:'三角肌后束', equipment:'绳索', mechanic:'孤立', desc:'肩部健康与后束塑形必备动作。', steps:['绳索调至面部高度','拉向额头两侧','外旋至结束位置'], tips:['轻重量高次数','外旋充分','肩胛后缩'], muscles:['三角肌后束','斜方肌中下束','菱形肌'] }
    ]
  },

  // ===== 肩部 =====
  shoulders: {
    name: '肩部',
    icon: 'fa-up-down',
    color: '#f59e0b',
    exercises: [
      { id:'sh1', name:'杠铃推举', en:'Overhead Press', difficulty:'中级', muscle:'三角肌前束', equipment:'杠铃', mechanic:'复合', desc:'上肢力量核心动作,塑造饱满肩部。', steps:['杠铃位于锁骨前','握距略宽于肩','垂直推至头顶锁定'], tips:['收紧臀部核心防过度挺腰','肘部稍前于躯干','避免完全锁死'], muscles:['三角肌前束','三角肌中束','肱三头肌','斜方肌上束'] },
      { id:'sh2', name:'哑铃侧平举', en:'Lateral Raise', difficulty:'初级', muscle:'三角肌中束', equipment:'哑铃', mechanic:'孤立', desc:'肩部宽度的关键动作,塑造球形肩。', steps:['哑铃位于身体两侧','肘微屈沿弧线上抬至肩平','控制下放'], tips:['避免借力耸肩','小指略高于拇指','小重量多次数'], muscles:['三角肌中束'] },
      { id:'sh3', name:'前平举', en:'Front Raise', difficulty:'初级', muscle:'三角肌前束', equipment:'哑铃', mechanic:'孤立', desc:'强化三角肌前束。', steps:['哑铃置于大腿前','前举至肩平高度','控制下放'], tips:['避免借力摆动','肘部微屈','交替或同时均可'], muscles:['三角肌前束'] },
      { id:'sh4', name:'俯身飞鸟', en:'Rear Delt Fly', difficulty:'初级', muscle:'三角肌后束', equipment:'哑铃', mechanic:'孤立', desc:'强化后束,改善圆肩体态。', steps:['俯身约90度','哑铃向两侧弧线抬起','顶峰肩胛后缩'], tips:['轻重量高次数','背部保持中立','肘部略高于腕'], muscles:['三角肌后束','斜方肌中束'] },
      { id:'sh5', name:'耸肩', en:'Shrugs', difficulty:'初级', muscle:'斜方肌上束', equipment:'哑铃', mechanic:'孤立', desc:'强化上斜方肌,塑造颈部线条。', steps:['哑铃置于身体两侧','耸肩至最高点','控制下放'], tips:['避免过度旋转肩部','顶峰保持2秒','不必过大重量'], muscles:['斜方肌上束'] },
      { id:'sh6', name:'阿诺德推举', en:'Arnold Press', difficulty:'中级', muscle:'三角肌', equipment:'哑铃', mechanic:'复合', desc:'全范围三角肌刺激,经典动作。', steps:['哑铃于肩前掌心向内','旋转推举至头顶掌心向前','控制回放'], tips:['旋转流畅','肘部稳定','避免挺腰'], muscles:['三角肌前束','三角肌中束','肱三头肌'] },
      { id:'sh7', name:'器械反飞鸟', en:'Reverse Pec Deck', difficulty:'初级', muscle:'三角肌后束', equipment:'器械', mechanic:'孤立', desc:'固定轨迹后束训练,适合新手。', steps:['调节座椅高度','掌心相对握把手','向后弧线打开'], tips:['顶峰肩胛后缩','肘部保持微屈','控制回放'], muscles:['三角肌后束'] },
      { id:'sh8', name:'绳索侧平举', en:'Cable Lateral Raise', difficulty:'初级', muscle:'三角肌中束', equipment:'绳索', mechanic:'孤立', desc:'持续张力的侧平举变式。', steps:['单手握低位绳索','弧线上抬至肩平','控制下放'], tips:['肘部领先小臂','避免耸肩','持续张力'], muscles:['三角肌中束'] }
    ]
  },

  // ===== 手臂 =====
  arms: {
    name: '手臂',
    icon: 'fa-hand-dots',
    color: '#a855f7',
    exercises: [
      { id:'ar1', name:'杠铃弯举', en:'Barbell Curl', difficulty:'初级', muscle:'肱二头肌', equipment:'杠铃', mechanic:'孤立', desc:'二头肌基础增肌动作。', steps:['握杠与肩同宽','肘部固定贴身体','屈臂上举至肩前'], tips:['避免身体借力','肘部不前后移动','控制下放2秒'], muscles:['肱二头肌','肱肌'] },
      { id:'ar2', name:'哑铃锤式弯举', en:'Hammer Curl', difficulty:'初级', muscle:'肱肌', equipment:'哑铃', mechanic:'孤立', desc:'强化肱肌与前臂,塑造手臂厚度。', steps:['哑铃掌心相对','保持锤式握法','屈臂上举'], tips:['肘部固定','避免摆动','顶峰收缩1秒'], muscles:['肱肌','肱二头肌','前臂屈肌'] },
      { id:'ar3', name:'集中弯举', en:'Concentration Curl', difficulty:'初级', muscle:'肱二头肌', equipment:'哑铃', mechanic:'孤立', desc:'顶峰收缩感强烈的孤立动作。', steps:['坐姿,单臂支撑大腿内侧','集中弯举至顶峰','缓慢下放'], tips:['避免借力','顶峰保持2秒','感受二头收缩'], muscles:['肱二头肌'] },
      { id:'ar4', name:'牧师凳弯举', en:'Preacher Curl', difficulty:'初级', muscle:'肱二头肌', equipment:'杠铃/器械', mechanic:'孤立', desc:'固定上臂,完全孤立二头肌。', steps:['上臂贴紧斜板','握把屈臂上举','控制下放'], tips:['上臂完全贴板','避免身体抬起','全程控制'], muscles:['肱二头肌'] },
      { id:'ar5', name:'绳索下压', en:'Triceps Pushdown', difficulty:'初级', muscle:'肱三头肌', equipment:'绳索', mechanic:'孤立', desc:'三头肌基础孤立动作。', steps:['握把手于胸前','肘部固定贴身体','下压至完全伸展'], tips:['肘部不前后移动','顶峰保持1秒','肩胛稳定'], muscles:['肱三头肌'] },
      { id:'ar6', name:'仰卧臂屈伸', en:'Skull Crusher', difficulty:'中级', muscle:'肱三头肌', equipment:'杠铃/哑铃', mechanic:'孤立', desc:'仰卧三头伸展,全范围刺激。', steps:['仰卧凳上握杠于胸前','屈肘下放至额头','伸臂回到起始'], tips:['肘部指向上方','避免过大幅度','使用EZ杠更舒适'], muscles:['肱三头肌'] },
      { id:'ar7', name:'窄距卧推', en:'Close Grip Bench', difficulty:'中级', muscle:'肱三头肌', equipment:'杠铃', mechanic:'复合', desc:'大重量三头复合动作。', steps:['握距与肩同宽','下放至下胸位置','推起至锁定'], tips:['肘部贴近身体','避免过窄伤腕','控制下放'], muscles:['肱三头肌','胸大肌','三角肌前束'] },
      { id:'ar8', name:'哑铃臂屈伸', en:'Overhead Triceps Extension', difficulty:'初级', muscle:'肱三头肌长头', equipment:'哑铃', mechanic:'孤立', desc:'强化三头长头,塑造马蹄形。', steps:['双手握哑铃举过头顶','屈肘下放至脑后','伸臂回起始'], tips:['肘部指向上方','避免外展','全程控制'], muscles:['肱三头肌长头'] },
      { id:'ar9', name:'腕弯举', en:'Wrist Curl', difficulty:'初级', muscle:'前臂屈肌', equipment:'哑铃', mechanic:'孤立', desc:'强化前臂屈肌,提升握力。', steps:['前臂置于大腿上','腕部悬空','屈腕上举'], tips:['小重量高次数','避免借力','感受前臂收缩'], muscles:['前臂屈肌'] },
      { id:'ar10', name:'反向腕弯举', en:'Reverse Wrist Curl', difficulty:'初级', muscle:'前臂伸肌', equipment:'哑铃', mechanic:'孤立', desc:'平衡前臂伸肌发展。', steps:['掌心向下握哑铃','前臂贴大腿','伸腕上抬'], tips:['控制速度','避免大重量','高次数训练'], muscles:['前臂伸肌'] }
    ]
  },

  // ===== 腿部 =====
  legs: {
    name: '腿部',
    icon: 'fa-shoe-prints',
    color: '#10b981',
    exercises: [
      { id:'lg1', name:'杠铃深蹲', en:'Barbell Squat', difficulty:'高级', muscle:'股四头肌', equipment:'杠铃', mechanic:'复合', desc:'动作之王,全面发展下肢力量与肌肉。', steps:['杠铃置于斜方肌上','双脚与肩同宽','下蹲至大腿平行或更低','蹬地站起'], tips:['膝盖与脚尖同向','背部保持中立','核心收紧'], muscles:['股四头肌','臀大肌','腘绳肌','核心'] },
      { id:'lg2', name:'罗马尼亚硬拉', en:'Romanian Deadlift', difficulty:'中级', muscle:'腘绳肌', equipment:'杠铃', mechanic:'复合', desc:'强化腘绳肌与臀部,改善后链。', steps:['微屈膝保持固定','屈髋下放杠铃至小腿中部','伸髋回到起始'], tips:['背部中立不圆肩','感受腘绳肌拉伸','杠铃贴近身体'], muscles:['腘绳肌','臀大肌','竖脊肌'] },
      { id:'lg3', name:'腿举', en:'Leg Press', difficulty:'初级', muscle:'股四头肌', equipment:'器械', mechanic:'复合', desc:'大重量下肢训练,适合新手。', steps:['双脚与肩同宽踏板','下放至膝盖约90度','蹬起至起始'], tips:['避免完全锁死膝盖','脚位决定侧重','背部贴靠背'], muscles:['股四头肌','臀大肌','腘绳肌'] },
      { id:'lg4', name:'保加利亚分腿蹲', en:'Bulgarian Split Squat', difficulty:'中级', muscle:'股四头肌', equipment:'哑铃', mechanic:'复合', desc:'单腿动作,改善不平衡与稳定性。', steps:['后脚置于凳上','前脚支撑下蹲','蹬起回起始'], tips:['前膝不超脚尖过多','躯干保持直立','控制平衡'], muscles:['股四头肌','臀大肌'] },
      { id:'lg5', name:'腿弯举', en:'Leg Curl', difficulty:'初级', muscle:'腘绳肌', equipment:'器械', mechanic:'孤立', desc:'孤立腘绳肌,平衡大腿发展。', steps:['俯卧器械上','腿弯举至臀部','控制回放'], tips:['避免臀部抬起','顶峰保持1秒','控制速度'], muscles:['腘绳肌'] },
      { id:'lg6', name:'腿屈伸', en:'Leg Extension', difficulty:'初级', muscle:'股四头肌', equipment:'器械', mechanic:'孤立', desc:'孤立股四头肌,强化大腿前侧。', steps:['坐于器械上','腿伸至完全伸展','控制回放'], tips:['避免快速弹震','顶峰保持1秒','感受股四收缩'], muscles:['股四头肌'] },
      { id:'lg7', name:'箭步蹲', en:'Lunges', difficulty:'初级', muscle:'股四头肌', equipment:'哑铃', mechanic:'复合', desc:'功能性动作,强化下肢与平衡。', steps:['迈步下蹲至双膝约90度','后膝近地面','蹬起回起始'], tips:['前膝与脚尖同向','躯干直立','避免过度前倾'], muscles:['股四头肌','臀大肌','腘绳肌'] },
      { id:'lg8', name:'站姿提踵', en:'Standing Calf Raise', difficulty:'初级', muscle:'腓肠肌', equipment:'器械/哑铃', mechanic:'孤立', desc:'强化小腿,塑造钻石型小腿。', steps:['前脚掌立于踏板','下放至充分拉伸','蹬起至最高点'], tips:['顶峰保持2秒','全程控制','充分拉伸'], muscles:['腓肠肌','比目鱼肌'] },
      { id:'lg9', name:'坐姿提踵', en:'Seated Calf Raise', difficulty:'初级', muscle:'比目鱼肌', equipment:'器械', mechanic:'孤立', desc:'强化比目鱼肌,平衡小腿发展。', steps:['坐于器械上','前脚掌踏板','蹬起至最高点'], tips:['屈膝状态下刺激比目鱼肌','高次数训练','顶峰保持2秒'], muscles:['比目鱼肌'] },
      { id:'lg10', name:'臀推', en:'Hip Thrust', difficulty:'中级', muscle:'臀大肌', equipment:'杠铃', mechanic:'复合', desc:'臀部王牌动作,塑造饱满翘臀。', steps:['上背靠凳,杠铃置于髋部','蹬地顶髋至身体水平','顶峰收缩臀部'], tips:['下巴微收','顶峰保持2秒','避免过度挺腰'], muscles:['臀大肌','腘绳肌'] }
    ]
  },

  // ===== 核心 =====
  core: {
    name: '核心',
    icon: 'fa-circle-dot',
    color: '#06b6d4',
    exercises: [
      { id:'co1', name:'平板支撑', en:'Plank', difficulty:'初级', muscle:'核心', equipment:'自重', mechanic:'静态', desc:'核心稳定基础动作,提升整体力量。', steps:['前臂支撑地面','身体保持一条直线','保持姿势静止'], tips:['核心收紧不塌腰','臀部不下沉','呼吸均匀'], muscles:['腹横肌','腹直肌','核心'] },
      { id:'co2', name:'卷腹', en:'Crunch', difficulty:'初级', muscle:'腹直肌', equipment:'自重', mechanic:'孤立', desc:'上腹基础动作,强化腹肌线条。', steps:['仰卧屈膝','卷起肩胛离地','控制下放'], tips:['避免拉颈部','下背贴地','顶峰保持1秒'], muscles:['腹直肌'] },
      { id:'co3', name:'悬垂举腿', en:'Hanging Leg Raise', difficulty:'高级', muscle:'下腹', equipment:'自重', mechanic:'孤立', desc:'下腹王牌动作,难度较高。', steps:['悬挂于单杠','举腿至水平或更高','控制下放'], tips:['避免摆动借力','避免耸肩','可用屈膝降阶'], muscles:['腹直肌下束','髂腰肌'] },
      { id:'co4', name:'俄罗斯转体', en:'Russian Twist', difficulty:'初级', muscle:'腹斜肌', equipment:'自重/哑铃', mechanic:'孤立', desc:'强化腹斜肌,塑造侧腹线条。', steps:['坐姿后倾,双脚离地','躯干左右转体','手触地面两侧'], tips:['核心保持稳定','感受腹斜发力','控制速度'], muscles:['腹内斜肌','腹外斜肌'] },
      { id:'co5', name:'山羊挺身', en:'Back Extension', difficulty:'初级', muscle:'下背', equipment:'器械', mechanic:'孤立', desc:'强化竖脊肌,保护腰椎。', steps:['俯卧于罗马椅上','后伸至上身水平','顶峰下背收缩'], tips:['避免过度后仰','感受下背发力','控制速度'], muscles:['竖脊肌','臀大肌'] },
      { id:'co6', name:'死虫', en:'Dead Bug', difficulty:'初级', muscle:'核心', equipment:'自重', mechanic:'静态', desc:'核心抗伸展训练,适合新手。', steps:['仰卧举臂屈膝','对侧手脚同时伸展','保持核心稳定'], tips:['下背贴地不离开','呼吸均匀','避免过快'], muscles:['腹横肌','核心'] },
      { id:'co7', name:'登山者', en:'Mountain Climber', difficulty:'初级', muscle:'核心', equipment:'自重', mechanic:'复合', desc:'核心+心肺双重训练。', steps:['俯卧撑姿势','交替提膝至胸前','保持核心稳定'], tips:['臀部不抬起','速度可调节','呼吸均匀'], muscles:['腹直肌','核心','肩部'] },
      { id:'co8', name:'绳索卷腹', en:'Cable Crunch', difficulty:'中级', muscle:'腹直肌', equipment:'绳索', mechanic:'孤立', desc:'负重卷腹,强化腹肌厚度。', steps:['跪于绳索前','握把手卷腹下压','控制回放'], tips:['避免手臂发力','顶峰保持2秒','感受腹肌收缩'], muscles:['腹直肌'] }
    ]
  },

  // ===== 臀部 =====
  glutes: {
    name: '臀部',
    icon: 'fa-person-walking',
    color: '#ec4899',
    exercises: [
      { id:'gl1', name:'臀推', en:'Hip Thrust', difficulty:'中级', muscle:'臀大肌', equipment:'杠铃', mechanic:'复合', desc:'臀部王牌动作,塑造饱满翘臀。', steps:['上背靠凳,杠铃置于髋部','蹬地顶髋至身体水平','顶峰收缩臀部'], tips:['下巴微收','顶峰保持2秒','避免过度挺腰'], muscles:['臀大肌','腘绳肌'] },
      { id:'gl2', name:'臀桥', en:'Glute Bridge', difficulty:'初级', muscle:'臀大肌', equipment:'自重', mechanic:'孤立', desc:'臀推的基础版本,适合新手。', steps:['仰卧屈膝','蹬地顶髋至身体水平','顶峰收缩'], tips:['顶峰夹紧臀部','避免过度挺腰','感受臀部发力'], muscles:['臀大肌'] },
      { id:'gl3', name:'蚌式开合', en:'Clam Shell', difficulty:'初级', muscle:'臀中肌', equipment:'自重/弹力带', mechanic:'孤立', desc:'强化臀中肌,改善骨盆稳定。', steps:['侧卧屈膝','开合上膝','控制下放'], tips:['骨盆保持稳定','感受臀中发力','可加弹力带'], muscles:['臀中肌'] },
      { id:'gl4', name:'跪姿后踢腿', en:'Kneeling Kickback', difficulty:'初级', muscle:'臀大肌', equipment:'自重/绳索', mechanic:'孤立', desc:'孤立臀部,强化后伸力量。', steps:['跪姿四点支撑','单腿后伸至最高','控制回放'], tips:['核心保持稳定','顶峰保持1秒','感受臀部收缩'], muscles:['臀大肌'] },
      { id:'gl5', name:'侧抬腿', en:'Side Leg Raise', difficulty:'初级', muscle:'臀中肌', equipment:'自重', mechanic:'孤立', desc:'强化臀中肌,改善臀形。', steps:['侧卧伸直身体','上腿抬起至最高','控制下放'], tips:['骨盆不后倾','感受臀中发力','控制速度'], muscles:['臀中肌'] }
    ]
  },

  // ===== 有氧 =====
  cardio: {
    name: '有氧',
    icon: 'fa-heart',
    color: '#dc2626',
    exercises: [
      { id:'cd1', name:'跑步', en:'Running', difficulty:'初级', muscle:'全身', equipment:'无', mechanic:'有氧', desc:'基础有氧运动,提升心肺功能。', steps:['保持良好跑姿','步频约180/分钟','呼吸均匀'], tips:['循序渐进增加距离','选择合适跑鞋','跑后拉伸'], muscles:['下肢','核心','心肺'] },
      { id:'cd2', name:'骑行', en:'Cycling', difficulty:'初级', muscle:'下肢', equipment:'自行车', mechanic:'有氧', desc:'低冲击有氧,适合各种人群。', steps:['调整座椅高度','保持稳定踏频','呼吸均匀'], tips:['避免过度前倾','合理变速','补充水分'], muscles:['股四头肌','臀大肌','腘绳肌'] },
      { id:'cd3', name:'跳绳', en:'Jump Rope', difficulty:'初级', muscle:'全身', equipment:'跳绳', mechanic:'有氧', desc:'高效燃脂,提升协调性。', steps:['保持肘部贴近身体','手腕转动绳子','前脚掌着地'], tips:['膝盖微屈','轻巧着地','循序渐进时间'], muscles:['小腿','核心','肩部','心肺'] },
      { id:'cd4', name:'波比跳', en:'Burpees', difficulty:'高级', muscle:'全身', equipment:'自重', mechanic:'复合', desc:'全身爆发力动作,高效燃脂。', steps:['下蹲双手撑地','双脚后跳至俯卧撑位','跳回深蹲再跳起'], tips:['保持动作连贯','量力而行','呼吸节奏'], muscles:['全身','心肺'] },
      { id:'cd5', name:'划船机', en:'Rowing Machine', difficulty:'初级', muscle:'全身', equipment:'划船机', mechanic:'有氧', desc:'全身有氧,强化后链。', steps:['蹬腿→身体后倾→拉桨','回放顺序相反','保持节奏'], tips:['腿部主导发力','背部保持中立','避免手臂过早发力'], muscles:['背部','下肢','核心','心肺'] },
      { id:'cd6', name:'台阶步', en:'Step Up', difficulty:'初级', muscle:'下肢', equipment:'台阶', mechanic:'复合', desc:'功能性有氧+力量训练。', steps:['单脚踏上台阶','蹬起至完全伸展','控制下放'], tips:['避免后腿过度借力','躯干直立','交替进行'], muscles:['股四头肌','臀大肌','心肺'] }
    ]
  },

  // ===== 全身功能性 =====
  fullbody: {
    name: '全身功能性',
    icon: 'fa-person-running',
    color: '#8b5cf6',
    exercises: [
      { id:'fb1', name:'土耳其起立', en:'Turkish Get Up', difficulty:'高级', muscle:'全身', equipment:'壶铃', mechanic:'复合', desc:'全身协调与稳定性训练。', steps:['仰卧举壶铃','侧身至手肘支撑','依次起身至站立','反向回到起始'], tips:['眼睛盯住壶铃','全程保持稳定','循序渐进重量'], muscles:['全身','核心','肩部'] },
      { id:'fb2', name:'壶铃摆荡', en:'Kettlebell Swing', difficulty:'中级', muscle:'后链', equipment:'壶铃', mechanic:'复合', desc:'爆发力后链训练,高效燃脂。', steps:['壶铃于双腿间','屈髋后摆','爆发伸髋荡起壶铃'], tips:['屈髋主导而非深蹲','背部保持中立','顶峰臀部夹紧'], muscles:['臀大肌','腘绳肌','核心','肩部'] },
      { id:'fb3', name:'药球砸地', en:'Medicine Ball Slam', difficulty:'中级', muscle:'全身', equipment:'药球', mechanic:'复合', desc:'爆发力释放,减压燃脂。', steps:['举药球过头顶','爆发砸向地面','顺势下蹲接球'], tips:['核心发力主导','全程爆发','注意安全'], muscles:['核心','背部','肩部'] },
      { id:'fb4', name:'战绳', en:'Battle Ropes', difficulty:'中级', muscle:'全身', equipment:'战绳', mechanic:'有氧', desc:'高强度全身燃脂训练。', steps:['双手握绳端','交替波浪甩动','保持深蹲姿势'], tips:['核心保持稳定','全身协调发力','间隔训练'], muscles:['肩部','核心','手臂','心肺'] }
    ]
  }
};

// ---------------- 训练计划库 ----------------
const TRAINING_PLANS = [
  {
    id:'ppl', name:'推拉腿分化(PPL)', en:'Push Pull Legs', level:'中级', daysPerWeek:6, goal:'增肌', duration:'12周', desc:'经典6天分化训练,高效增肌塑形。推日练胸肩三头,拉日练背二头,腿日练下肢。',
    days:[
      { name:'推日A(胸/肩/三头)', exercises:[ {id:'ch1', sets:4, reps:'6-8', rest:'2-3分钟'}, {id:'sh1', sets:3, reps:'8-10', rest:'90秒'}, {id:'ch2', sets:3, reps:'10-12', rest:'90秒'}, {id:'sh2', sets:4, reps:'12-15', rest:'60秒'}, {id:'ar5', sets:3, reps:'12-15', rest:'60秒'}, {id:'ar6', sets:3, reps:'10-12', rest:'60秒'} ] },
      { name:'拉日A(背/二头)', exercises:[ {id:'bk2', sets:4, reps:'6-8', rest:'2-3分钟'}, {id:'bk3', sets:4, reps:'8-10', rest:'90秒'}, {id:'bk4', sets:3, reps:'10-12', rest:'90秒'}, {id:'bk8', sets:3, reps:'15-20', rest:'60秒'}, {id:'ar1', sets:3, reps:'10-12', rest:'60秒'}, {id:'ar2', sets:3, reps:'12-15', rest:'60秒'} ] },
      { name:'腿日A(股四/臀)', exercises:[ {id:'lg1', sets:4, reps:'6-8', rest:'3分钟'}, {id:'lg10', sets:3, reps:'8-10', rest:'2分钟'}, {id:'lg3', sets:3, reps:'10-12', rest:'2分钟'}, {id:'lg5', sets:3, reps:'12-15', rest:'90秒'}, {id:'lg8', sets:4, reps:'15-20', rest:'60秒'}, {id:'co1', sets:3, reps:'60秒', rest:'45秒'} ] },
      { name:'推日B(胸/肩/三头)', exercises:[ {id:'ch3', sets:4, reps:'6-8', rest:'2-3分钟'}, {id:'sh6', sets:3, reps:'8-10', rest:'90秒'}, {id:'ch7', sets:3, reps:'12-15', rest:'60秒'}, {id:'sh4', sets:3, reps:'15-20', rest:'60秒'}, {id:'ar7', sets:3, reps:'8-10', rest:'90秒'}, {id:'ar8', sets:3, reps:'12-15', rest:'60秒'} ] },
      { name:'拉日B(背/二头)', exercises:[ {id:'bk1', sets:3, reps:'5-5', rest:'3分钟'}, {id:'bk6', sets:4, reps:'8-10', rest:'90秒'}, {id:'bk5', sets:3, reps:'10-12', rest:'90秒'}, {id:'bk7', sets:3, reps:'15-20', rest:'60秒'}, {id:'ar3', sets:3, reps:'12-15', rest:'60秒'}, {id:'ar4', sets:3, reps:'10-12', rest:'60秒'} ] },
      { name:'腿日B(腘绳/小腿)', exercises:[ {id:'lg2', sets:4, reps:'8-10', rest:'2分钟'}, {id:'lg4', sets:3, reps:'10-12', rest:'90秒'}, {id:'lg5', sets:3, reps:'12-15', rest:'90秒'}, {id:'lg9', sets:4, reps:'15-20', rest:'60秒'}, {id:'co3', sets:3, reps:'12-15', rest:'60秒'}, {id:'co5', sets:3, reps:'12-15', rest:'60秒'} ] }
    ]
  },
  {
    id:'ul', name:'上下半身分化', en:'Upper/Lower Split', level:'中级', daysPerWeek:4, goal:'增肌力量', duration:'12周', desc:'4天分化,适合工作日训练。上下半身交替,每部位一周两练。',
    days:[
      { name:'上半身A(力量)', exercises:[ {id:'ch1', sets:4, reps:'5-5', rest:'3分钟'}, {id:'bk1', sets:4, reps:'5-5', rest:'3分钟'}, {id:'sh1', sets:3, reps:'6-8', rest:'2分钟'}, {id:'bk3', sets:3, reps:'8-10', rest:'90秒'}, {id:'ar1', sets:3, reps:'10-12', rest:'60秒'}, {id:'ar5', sets:3, reps:'10-12', rest:'60秒'} ] },
      { name:'下半身A(力量)', exercises:[ {id:'lg1', sets:4, reps:'5-5', rest:'3分钟'}, {id:'lg2', sets:4, reps:'6-8', rest:'2分钟'}, {id:'lg10', sets:3, reps:'8-10', rest:'90秒'}, {id:'lg8', sets:4, reps:'10-15', rest:'60秒'}, {id:'co1', sets:3, reps:'60秒', rest:'45秒'}, {id:'co4', sets:3, reps:'15-20', rest:'45秒'} ] },
      { name:'上半身B(增肌)', exercises:[ {id:'ch2', sets:4, reps:'10-12', rest:'90秒'}, {id:'bk4', sets:4, reps:'10-12', rest:'90秒'}, {id:'sh2', sets:3, reps:'12-15', rest:'60秒'}, {id:'ch4', sets:3, reps:'12-15', rest:'60秒'}, {id:'ar2', sets:3, reps:'12-15', rest:'60秒'}, {id:'ar6', sets:3, reps:'12-15', rest:'60秒'} ] },
      { name:'下半身B(增肌)', exercises:[ {id:'lg3', sets:4, reps:'10-12', rest:'90秒'}, {id:'lg4', sets:3, reps:'10-12', rest:'90秒'}, {id:'lg5', sets:3, reps:'12-15', rest:'60秒'}, {id:'lg6', sets:3, reps:'12-15', rest:'60秒'}, {id:'co3', sets:3, reps:'12-15', rest:'60秒'}, {id:'co5', sets:3, reps:'12-15', rest:'60秒'} ] }
    ]
  },
  {
    id:'fb', name:'全身训练', en:'Full Body', level:'初级', daysPerWeek:3, goal:'增肌', duration:'8周', desc:'每周3次全身训练,适合新手。每次覆盖主要肌群,频率高效果好。',
    days:[
      { name:'全身A', exercises:[ {id:'ch1', sets:3, reps:'8-10', rest:'90秒'}, {id:'bk4', sets:3, reps:'10-12', rest:'90秒'}, {id:'lg1', sets:3, reps:'8-10', rest:'2分钟'}, {id:'sh2', sets:3, reps:'12-15', rest:'60秒'}, {id:'ar1', sets:3, reps:'10-12', rest:'60秒'}, {id:'co1', sets:3, reps:'45秒', rest:'45秒'} ] },
      { name:'全身B', exercises:[ {id:'ch2', sets:3, reps:'10-12', rest:'90秒'}, {id:'bk3', sets:3, reps:'10-12', rest:'90秒'}, {id:'lg2', sets:3, reps:'10-12', rest:'90秒'}, {id:'sh1', sets:3, reps:'8-10', rest:'90秒'}, {id:'ar5', sets:3, reps:'12-15', rest:'60秒'}, {id:'co4', sets:3, reps:'15-20', rest:'45秒'} ] },
      { name:'全身C', exercises:[ {id:'lg3', sets:3, reps:'10-12', rest:'90秒'}, {id:'bk2', sets:3, reps:'8-10', rest:'90秒'}, {id:'ch5', sets:3, reps:'15-20', rest:'60秒'}, {id:'lg10', sets:3, reps:'12-15', rest:'60秒'}, {id:'ar2', sets:3, reps:'12-15', rest:'60秒'}, {id:'co2', sets:3, reps:'15-20', rest:'45秒'} ] }
    ]
  },
  {
    id:'5x5', name:'5x5力量训练', en:'5x5 Strength', level:'中级', daysPerWeek:3, goal:'力量', duration:'12周', desc:'经典力量训练计划,5组5次大重量复合动作。线性加重,快速提升力量。',
    days:[
      { name:'训练A', exercises:[ {id:'ch1', sets:5, reps:'5-5', rest:'3-5分钟'}, {id:'lg1', sets:5, reps:'5-5', rest:'3-5分钟'}, {id:'bk4', sets:5, reps:'5-5', rest:'3-5分钟'} ] },
      { name:'训练B', exercises:[ {id:'lg1', sets:5, reps:'5-5', rest:'3-5分钟'}, {id:'sh1', sets:5, reps:'5-5', rest:'3-5分钟'}, {id:'bk1', sets:1, reps:'5-5', rest:'3-5分钟'} ] }
    ]
  },
  {
    id:'cut', name:'减脂塑形', en:'Cutting/Fat Loss', level:'中级', daysPerWeek:5, goal:'减脂', duration:'8周', desc:'力量+有氧结合,高效减脂塑形。保留肌肉同时燃脂。',
    days:[
      { name:'上半身力量', exercises:[ {id:'ch1', sets:4, reps:'8-10', rest:'60秒'}, {id:'bk3', sets:4, reps:'10-12', rest:'60秒'}, {id:'sh1', sets:3, reps:'10-12', rest:'60秒'}, {id:'bk4', sets:3, reps:'12-15', rest:'45秒'}, {id:'ar5', sets:3, reps:'15-20', rest:'45秒'} ] },
      { name:'下半身+有氧', exercises:[ {id:'lg1', sets:4, reps:'10-12', rest:'60秒'}, {id:'lg10', sets:3, reps:'12-15', rest:'60秒'}, {id:'lg5', sets:3, reps:'15-20', rest:'45秒'}, {id:'lg8', sets:3, reps:'20-25', rest:'30秒'} ] },
      { name:'HIIT有氧', exercises:[ {id:'cd4', sets:8, reps:'30秒', rest:'30秒'}, {id:'cd3', sets:5, reps:'60秒', rest:'30秒'}, {id:'fb4', sets:6, reps:'30秒', rest:'30秒'} ] },
      { name:'全身循环', exercises:[ {id:'ch5', sets:4, reps:'15-20', rest:'30秒'}, {id:'bk2', sets:4, reps:'8-12', rest:'30秒'}, {id:'lg7', sets:4, reps:'12-15', rest:'30秒'}, {id:'co7', sets:4, reps:'30秒', rest:'30秒'} ] },
      { name:'核心+有氧', exercises:[ {id:'co1', sets:3, reps:'60秒', rest:'30秒'}, {id:'co3', sets:3, reps:'12-15', rest:'45秒'}, {id:'co4', sets:3, reps:'20-25', rest:'30秒'}, {id:'cd1', sets:1, reps:'30分钟', rest:'0'} ] }
    ]
  },
  {
    id:'hyp', name:'增肌专项', en:'Hypertrophy', level:'中级', daysPerWeek:5, goal:'增肌', duration:'10周', desc:'高容量增肌训练,5天分化。每个肌群获得充足训练量。',
    days:[
      { name:'胸部日', exercises:[ {id:'ch1', sets:4, reps:'8-10', rest:'90秒'}, {id:'ch2', sets:4, reps:'10-12', rest:'60秒'}, {id:'ch3', sets:3, reps:'10-12', rest:'60秒'}, {id:'ch4', sets:3, reps:'12-15', rest:'60秒'}, {id:'ch7', sets:3, reps:'15-20', rest:'45秒'} ] },
      { name:'背部日', exercises:[ {id:'bk2', sets:4, reps:'8-10', rest:'90秒'}, {id:'bk3', sets:4, reps:'10-12', rest:'60秒'}, {id:'bk5', sets:3, reps:'10-12', rest:'60秒'}, {id:'bk7', sets:3, reps:'15-20', rest:'45秒'}, {id:'bk8', sets:3, reps:'15-20', rest:'45秒'} ] },
      { name:'腿部日', exercises:[ {id:'lg1', sets:4, reps:'8-10', rest:'2分钟'}, {id:'lg2', sets:4, reps:'10-12', rest:'90秒'}, {id:'lg4', sets:3, reps:'12-15', rest:'60秒'}, {id:'lg5', sets:3, reps:'12-15', rest:'60秒'}, {id:'lg8', sets:4, reps:'15-20', rest:'45秒'} ] },
      { name:'肩部日', exercises:[ {id:'sh1', sets:4, reps:'8-10', rest:'90秒'}, {id:'sh2', sets:4, reps:'12-15', rest:'60秒'}, {id:'sh6', sets:3, reps:'10-12', rest:'60秒'}, {id:'sh3', sets:3, reps:'15-20', rest:'45秒'}, {id:'sh4', sets:4, reps:'15-20', rest:'45秒'} ] },
      { name:'手臂日', exercises:[ {id:'ar1', sets:4, reps:'10-12', rest:'60秒'}, {id:'ar6', sets:4, reps:'10-12', rest:'60秒'}, {id:'ar2', sets:3, reps:'12-15', rest:'45秒'}, {id:'ar5', sets:3, reps:'15-20', rest:'45秒'}, {id:'ar3', sets:3, reps:'12-15', rest:'45秒'}, {id:'ar8', sets:3, reps:'12-15', rest:'45秒'} ] }
    ]
  }
];

// ---------------- 饮食方案 ----------------
const MEAL_PLANS = [
  {
    id:'bulk', name:'增肌期饮食', goal:'增肌', calories:'3000-3500kcal', protein:'180-220g', carbs:'350-400g', fat:'80-100g', desc:'热量盈余状态下支持肌肉增长的高蛋白饮食。',
    meals:[
      { time:'早餐', name:'燕麦蛋白餐', items:'燕麦100g+牛奶300ml+鸡蛋3个+香蕉1根', calories:'650kcal' },
      { time:'加餐', name:'坚果酸奶', items:'希腊酸奶200g+混合坚果30g+蜂蜜', calories:'400kcal' },
      { time:'午餐', name:'鸡胸糙米饭', items:'鸡胸200g+糙米150g+西兰花+橄榄油', calories:'750kcal' },
      { time:'训练前', name:'能量补充', items:'全麦面包2片+花生酱+乳清蛋白', calories:'450kcal' },
      { time:'晚餐', name:'牛肉意面', items:'瘦牛肉200g+全麦意面150g+番茄酱', calories:'700kcal' },
      { time:'睡前', name:'缓释蛋白', items:'酪蛋白30g+杏仁10粒', calories:'250kcal' }
    ]
  },
  {
    id:'cut', name:'减脂期饮食', goal:'减脂', calories:'1800-2200kcal', protein:'160-200g', carbs:'150-180g', fat:'60-80g', desc:'热量缺口状态下保留肌肉的低碳高蛋白饮食。',
    meals:[
      { time:'早餐', name:'蛋白燕麦', items:'燕麦50g+乳清蛋白1勺+鸡蛋4个蛋白', calories:'400kcal' },
      { time:'加餐', name:'高蛋白小吃', items:'希腊酸奶150g+蓝莓+杏仁10粒', calories:'250kcal' },
      { time:'午餐', name:'鸡胸沙拉', items:'鸡胸180g+大量蔬菜+糙米80g+橄榄油', calories:'500kcal' },
      { time:'训练后', name:'恢复餐', items:'乳清蛋白1勺+香蕉1根', calories:'250kcal' },
      { time:'晚餐', name:'鱼肉蔬菜', items:'三文鱼180g+蒸蔬菜+藜麦60g', calories:'450kcal' }
    ]
  },
  {
    id:'maint', name:'维持期饮食', goal:'维持', calories:'2500-2800kcal', protein:'140-160g', carbs:'280-320g', fat:'70-90g', desc:'均衡营养维持体型的健康饮食。',
    meals:[
      { time:'早餐', name:'均衡早餐', items:'全麦面包+鸡蛋2个+牛奶+水果', calories:'500kcal' },
      { time:'午餐', name:'营养午餐', items:'鸡肉/鱼肉150g+糙米100g+蔬菜', calories:'650kcal' },
      { time:'加餐', name:'健康加餐', items:'酸奶+水果+坚果', calories:'300kcal' },
      { time:'晚餐', name:'清淡晚餐', items:'瘦肉150g+蔬菜+少量主食', calories:'550kcal' }
    ]
  }
];

// ---------------- 成就系统 ----------------
const ACHIEVEMENTS = [
  { id:'first_workout', name:'初次训练', icon:'fa-flag-checkered', desc:'完成第一次训练', cond:(s)=>s.totalWorkouts>=1 },
  { id:'workout_10', name:'坚持不懈', icon:'fa-fire', desc:'完成10次训练', cond:(s)=>s.totalWorkouts>=10 },
  { id:'workout_50', name:'健身达人', icon:'fa-medal', desc:'完成50次训练', cond:(s)=>s.totalWorkouts>=50 },
  { id:'workout_100', name:'百炼成钢', icon:'fa-trophy', desc:'完成100次训练', cond:(s)=>s.totalWorkouts>=100 },
  { id:'bench_60', name:'卧推60kg', icon:'fa-dumbbell', desc:'卧推达到60kg', cond:(s)=>(s.prs.bench||0)>=60 },
  { id:'bench_100', name:'卧推破百', icon:'fa-dumbbell', desc:'卧推达到100kg', cond:(s)=>(s.prs.bench||0)>=100 },
  { id:'squat_100', name:'深蹲破百', icon:'fa-person-arrows', desc:'深蹲达到100kg', cond:(s)=>(s.prs.squat||0)>=100 },
  { id:'deadlift_140', name:'硬拉140', icon:'fa-weight-hanging', desc:'硬拉达到140kg', cond:(s)=>(s.prs.deadlift||0)>=140 },
  { id:'week_streak', name:'一周连续', icon:'fa-calendar-week', desc:'连续训练7天', cond:(s)=>s.streak>=7 },
  { id:'month_streak', name:'月度坚持', icon:'fa-calendar-check', desc:'连续训练30天', cond:(s)=>s.streak>=30 },
  { id:'all_parts', name:'全面发展', icon:'fa-star', desc:'训练过所有身体部位', cond:(s)=>s.trainedParts>=8 }
];

// 工具函数:根据ID查找动作(支持自定义动作)
function getExerciseById(id){
  for(const part in EXERCISE_DB){
    const ex = EXERCISE_DB[part].exercises.find(e=>e.id===id);
    if(ex) return {...ex, part:part, partName:EXERCISE_DB[part].name, partColor:EXERCISE_DB[part].color, partIcon:EXERCISE_DB[part].icon, custom:false};
  }
  // 查找自定义动作
  if(typeof state !== 'undefined' && state.customExercises){
    const ce = state.customExercises.find(e=>e.id===id);
    if(ce){
      const partInfo = getPartInfoByKey(ce.partKey);
      return {...ce, part:ce.partKey, partName: partInfo?partInfo.name:'自定义', partColor: partInfo?partInfo.color:'#d4af37', partIcon: partInfo?partInfo.icon:'fa-star', custom:true};
    }
  }
  return null;
}

function getPartByKey(key){ return EXERCISE_DB[key]; }

// 获取部位信息(内置+自定义)
function getPartInfoByKey(key){
  if(EXERCISE_DB[key]) return EXERCISE_DB[key];
  if(typeof state !== 'undefined' && state.customParts){
    const cp = state.customParts.find(p=>p.key===key);
    if(cp) return { name:cp.name, icon:cp.icon, color:cp.color, exercises:[] };
  }
  return null;
}

// 获取所有部位key(内置+自定义)
function getAllPartKeys(){
  const keys = Object.keys(EXERCISE_DB);
  if(typeof state !== 'undefined' && state.customParts){
    state.customParts.forEach(p=>{ if(!keys.includes(p.key)) keys.push(p.key); });
  }
  return keys;
}

// 获取某部位下所有动作(内置+自定义)
function getAllExercisesByPart(partKey){
  const result = [];
  if(EXERCISE_DB[partKey]){
    EXERCISE_DB[partKey].exercises.forEach(e=>result.push(e));
  }
  if(typeof state !== 'undefined' && state.customExercises){
    state.customExercises.filter(e=>e.partKey===partKey).forEach(e=>result.push(e));
  }
  return result;
}
