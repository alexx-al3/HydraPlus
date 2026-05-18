import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react'

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const AVATARS = [
  { id: 'drop',   label: 'Gotinha',   emoji: '💧' },
  { id: 'dino',   label: 'Dino',      emoji: '🦕' },
  { id: 'whale',  label: 'Baleia',    emoji: '🐳' },
  { id: 'plant',  label: 'Plantinha', emoji: '🌱' },
  { id: 'robot',  label: 'Robô',      emoji: '🤖' },
]
const ROUTINES = [
  { id: 'light',   label: 'Leve',     goal: 1800, icon: '🌙', desc: 'Atividade baixa'      },
  { id: 'normal',  label: 'Normal',   goal: 2000, icon: '☀️', desc: 'Rotina comum'         },
  { id: 'work',    label: 'Trabalho', goal: 2200, icon: '💼', desc: 'Escritório/Home office'},
  { id: 'intense', label: 'Intensa',  goal: 2500, icon: '🔥', desc: 'Alta atividade'       },
  { id: 'gym',     label: 'Academia', goal: 3000, icon: '💪', desc: 'Treinos pesados'      },
]
const NOTIF_MSGS = [
  // Sarcásticas
  'Parabéns! Você ignorou a água por mais uma hora. 👏 Orgulho.',
  'Seu rim ligou. Caiu na caixa postal. Ele tá bem preocupado.',
  'A ciência diz que humanos precisam de água. Talvez você seja especial? 🤔',
  'Achei que você tinha desaparecido. Ah não, só desidratou mesmo.',
  'Uau, de novo aqui. Sua última hidratação foi em outra era geológica.',
  'Seu médico agradece por garantir aposentadoria dele. Beba água. 💀',
  'Tecnicamente você pode sobreviver sem água por dias. Tecnicamente. 🫠',
  'Spoiler: a dor de cabeça que vem aí não é do estresse. É sede.',
  'Interessante estratégia de vida essa de não beber água. Respeito a coragem.',
  'Notícia de última hora: seu corpo ainda é feito de carne, não de cacto. 🌵',
  // Dramáticas
  'URGENTE: suas células estão fazendo vaquinha pra comprar água. Socorro. 🆘',
  'Seu fígado pediu demissão. RH tá segurando, mas ele tá no limite.',
  'Alerta vermelho! Suas lágrimas secaram. Não tem mais como chorar o leite derramado. 😭',
  'Os neurônios pararam de se falar. Briga interna por falta de hidratação.',
  'Seu sangue tá mais grosso que desculpa de segunda-feira. Bebe água. 🩸',
  // Motivacionais com atitude
  'Cada gole é um tapa na cara da versão seca de você. Vai lá. 👊',
  'Agua: o único vício saudável que você pode ter. Sê viciado. 💧',
  'Seu personagem do app tá sofrendo. Sabe quem mais tá sofrendo? Você.',
  'Beija a garrafa, bebe a água, salva o rim. Nessa ordem. 💋',
  'Se você fosse planta já tinha morrido. Mas você é humano. Por enquanto. 🌱',
  // Engraçadas
  'Sua pele tá pedindo colágeno. Sabe o que ajuda? Não é o creme de R$200.',
  'Café não conta. Refrigerante não conta. Lágrima de arrependimento não conta. 😤',
  'Imagine ser 60% água e passar sede. Que ironia cruel da natureza.',
  'Seu cérebro encolheu 2% sem água hoje. Tá explicado as decisões de ontem. 🧠',
  'A garrafinha te olha com decepção silenciosa. Ela merece mais. 🫙',
  // Diretas ao ponto
  'Bebe água ou perde o streak. Simples assim. 🔥',
  'Hoje você já tomou menos água que uma suculenta. UMA SUCULENTA. 🪴',
  'Lembrete gentil: você não é um camelo. Embora a situação esteja parecida.',
  '+1 hora sem água = -10 de produtividade. A conta não fecha, bebe. 📉',
  'Seu futuro eu agradece. Seu rim atual IMPLORA. Priorize o rim. 🙏',
]
const ACHIEVEMENTS = [
  { id: 'first_sip',  label: 'Primeiro Gole',     desc: 'Primeiro registro',        icon: '🌊', xp: 50   },
  { id: 'day1',       label: 'Dia Hidratado',      desc: 'Meta diária atingida',     icon: '⭐', xp: 100  },
  { id: 'liter',      label: 'Litro Zero',         desc: '1000ml em um dia',         icon: '🏆', xp: 150  },
  { id: 'streak3',    label: '3 Dias On Fire',     desc: '3 dias consecutivos',      icon: '🔥', xp: 200  },
  { id: 'early',      label: 'Madrugador',         desc: 'Bebeu água antes das 8h',  icon: '🌅', xp: 75   },
  { id: 'night',      label: 'Noturno',            desc: 'Bebeu água após 22h',      icon: '🌙', xp: 75   },
  { id: 'consistent', label: 'Consistente',        desc: '5 registros em um dia',    icon: '💪', xp: 100  },
  { id: 'streak7',    label: 'Uma Semana!',        desc: '7 dias consecutivos',      icon: '💎', xp: 500  },
  { id: 'master',     label: 'Mestre da Água',     desc: 'Nível 5 atingido',         icon: '🧙', xp: 300  },
  { id: 'streak14',   label: 'Quinzena Campeã',    desc: '14 dias consecutivos',     icon: '👑', xp: 1000 },
  { id: 'champion',   label: 'Campeão',            desc: 'Meta 10 dias seguidos',    icon: '🥇', xp: 1000 },
  { id: 'speed',      label: 'Veloz',              desc: '500ml na primeira hora',   icon: '⚡', xp: 150  },
]
const MOTIVATIONAL = [
  'Hoje você bebe água ou o rim cobra depois. A escolha é sua. 💧',
  'Café te acorda. Água te mantém vivo. Prioridades. ☕➡️💧',
  'Cada gole é um tapa carinhoso no seu fígado. Ele merece. 👊',
  'Você gastou dinheiro em skincare. A água é de graça. Irônico. ✨',
  'Seu personagem tá te julgando. Bebe água antes que ele chore. 😢',
  'Hidratado você pensa melhor. Desidratado você manda áudio de 3 min. 🎤',
  'Água: o único vício que o médico aplaude. Seja viciado. 💊',
  'Sua meta de hoje não vai se cumprir sozinha. Nem a garrafa. 🫙',
  'O segredo dos bem-sucedidos? Água, sono e não te contar o resto. 🤫',
  'Beber água é praticamente um superpoder que todo mundo ignora. ⚡',
]
const LEVEL_TITLES = [
  'Iniciante Seco','Aprendiz da Gota','Hidratante','Caminhante Aquoso',
  'Guerreiro da Água','Mestre da Hidratação','Lenda Aquática','Deus das Águas',
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt   = ml => ml >= 1000 ? `${(ml/1000).toFixed(1)}L` : `${ml}ml`
const todayKey = () => new Date().toISOString().split('T')[0]
const xpInfo = xp => {
  const level = Math.floor(xp / 200) + 1
  const prev  = (level-1)*200, next = level*200
  return { level, progress:(xp-prev)/(next-prev), next,
    title: LEVEL_TITLES[Math.min(level-1, LEVEL_TITLES.length-1)] }
}
const ls = {
  get: k => { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } },
  set: (k,v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} },
}

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
const Ctx = createContext({})
const useApp = () => useContext(Ctx)

function AppProvider({ children }) {
  const [dark, setDark]     = useState(true)
  const [profile, _setProf] = useState(() => ({
    name:'', avatar:'drop', routine:'normal', goal:2000,
    notifInterval:60, notifStart:7, notifEnd:22,
    soundEnabled:true, vibrationEnabled:true, onboarded:false,
    ...(ls.get('profile')||{})
  }))
  const [today, _setToday] = useState(() => {
    const s = ls.get('today')
    return s?.date===todayKey() ? s : { consumed:0, logs:[], date:todayKey() }
  })
  const [history, setHistory] = useState(() => ls.get('history')||[])
  const [game, _setGame]     = useState(() => ({
    xp:0, streak:0, achievements:[], lastDate:null, ...(ls.get('game')||{})
  }))
  const [toasts, setToasts]   = useState([])
  const [xpPop, setXpPop]     = useState(null)
  const [celebrate, setCelebrate] = useState(false)
  const [notifPerm, setNotifPerm] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  )
  const notifTimer = useRef(null)

  const setProf  = p => { _setProf(p);  ls.set('profile', p) }
  const setToday = t => { _setToday(t); ls.set('today', t) }
  const setGame  = g => { _setGame(g);  ls.set('game', g) }

  // Day rollover
  useEffect(() => {
    const s = ls.get('today')
    if (s && s.date !== todayKey()) {
      if (s.consumed > 0) {
        const h = [...(ls.get('history')||[]), { date:s.date, consumed:s.consumed, goal:profile.goal }].slice(-60)
        setHistory(h); ls.set('history', h)
      }
      setToday({ consumed:0, logs:[], date:todayKey() })
    }
  }, [])

  // ── Notification scheduler ────────────────────────────────────────────────
  const scheduleNotifs = useCallback(() => {
    if (notifTimer.current) clearInterval(notifTimer.current)
    if (!profile.onboarded) return
    notifTimer.current = setInterval(() => {
      const h = new Date().getHours()
      const pct = (ls.get('today')?.consumed||0) / profile.goal
      if (h >= profile.notifStart && h <= profile.notifEnd && pct < 1) {
        const body = NOTIF_MSGS[Math.floor(Math.random()*NOTIF_MSGS.length)]
        // Browser Notification API
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          try {
            navigator.serviceWorker?.ready.then(sw => {
              sw.showNotification('Hydra+ 💧', {
                body,
                icon: '/icons/icon-192.png',
                badge: '/icons/icon-192.png',
                vibrate: [100,50,100],
                tag: 'hydra-reminder',
                renotify: true,
                actions: [
                  { action:'drink', title:'💧 Bebi!' },
                  { action:'snooze', title:'⏰ 30min' },
                ]
              })
            })
          } catch(e) {
            new Notification('Hydra+ 💧', { body, icon:'/icons/icon-192.png' })
          }
        }
        // In-app toast too
        toast({ emoji:'💧', text:body })
      }
    }, profile.notifInterval * 60 * 1000)
  }, [profile])

  useEffect(() => { scheduleNotifs(); return () => clearInterval(notifTimer.current) }, [scheduleNotifs])

  const requestNotifPerm = async () => {
    if (typeof Notification === 'undefined') return 'unsupported'
    const perm = await Notification.requestPermission()
    setNotifPerm(perm)
    if (perm === 'granted') scheduleNotifs()
    return perm
  }

  // ── toast ─────────────────────────────────────────────────────────────────
  const toast = useCallback(msg => {
    const id = Date.now()+Math.random()
    setToasts(q => [...q.slice(-2), {...msg, id}])
    setTimeout(() => setToasts(q => q.filter(t => t.id !== id)), 3200)
  }, [])

  // ── addWater ──────────────────────────────────────────────────────────────
  const addWater = useCallback(ml => {
    const prev = today.consumed
    const newC = prev + ml
    const pct  = newC / profile.goal
    const gained = Math.round(ml * 0.5)
    const hour = new Date().getHours()
    const time = new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})

    if (profile.vibrationEnabled && navigator.vibrate) navigator.vibrate(40)

    const newToday = { ...today, consumed:newC, logs:[...today.logs,{ml,time}] }
    setToday(newToday)

    let ach = [...game.achievements], streak = game.streak, xp = game.xp + gained
    const toastQ = []

    if (prev===0 && !ach.includes('first_sip')) { ach.push('first_sip'); xp+=50; toastQ.push({emoji:'🌊',text:'Primeiro Gole! Era hora, seu camelo. +50 XP'}) }
    if (newC>=1000 && prev<1000 && !ach.includes('liter')) { ach.push('liter'); xp+=150; toastQ.push({emoji:'🏆',text:'1 LITRO! Seu rim fez uma reverência. +150 XP'}) }
    if (hour<8 && !ach.includes('early')) { ach.push('early'); xp+=75; toastQ.push({emoji:'🌅',text:'Bebendo água às ${hour}h? Você assustou. +75 XP'}) }
    if (hour>=22 && !ach.includes('night')) { ach.push('night'); xp+=75; toastQ.push({emoji:'🌙',text:'Hidratação noturna! Sua bexiga vai te odiar. +75 XP'}) }
    if (newToday.logs.length>=5 && !ach.includes('consistent')) { ach.push('consistent'); xp+=100; toastQ.push({emoji:'💪',text:'5 registros hoje! Você virou peixe. +100 XP'}) }
    if (xpInfo(xp).level>=5 && !ach.includes('master')) { ach.push('master'); xp+=300; toastQ.push({emoji:'🧙',text:'Nível 5! Mestre da Água. Seu rim tem orgulho. +300 XP'}) }

    if (pct>=1 && prev<profile.goal) {
      setCelebrate(true); setTimeout(()=>setCelebrate(false),3500)
      streak = game.streak+1
      if (!ach.includes('day1')) { ach.push('day1'); xp+=100 }
      if (streak>=3  && !ach.includes('streak3'))  { ach.push('streak3');  xp+=200;  toastQ.push({emoji:'🔥',text:'3 Dias On Fire! Seu rim tá comemorando!'}) }
      if (streak>=7  && !ach.includes('streak7'))  { ach.push('streak7');  xp+=500;  toastQ.push({emoji:'💎',text:'7 dias! Você é basicamente um peixe agora.'}) }
      if (streak>=14 && !ach.includes('streak14')) { ach.push('streak14'); xp+=1000; toastQ.push({emoji:'👑',text:'14 dias. Lenda. Seu rim tem tatuagem sua.'}) }
      toastQ.push({emoji:'🎉',text:'META BATIDA! Seu personagem tá chorando de felicidade! 🏆'})
      if (navigator.vibrate) navigator.vibrate([100,50,100,50,200])
    } else {
      const msgs = [
        {emoji:'💧', text:`Uhh, ${fmt(ml)}! Seu rim fez uma dancinha.`},
        {emoji:'✨', text:`+${gained} XP! Tá hidratando ou tá me provocando?`},
        {emoji:'💪', text:`Só ${fmt(Math.max(0,profile.goal-newC))} pra meta. Vai, não sê mole.`},
        {emoji:'🫙', text:`A garrafinha aprovou. ${fmt(ml)} no estômago!`},
        {emoji:'🧠', text:`Seus neurônios agradeceram coletivamente.`},
        {emoji:'😤', text:`Era hora! Faltam ${fmt(Math.max(0,profile.goal-newC))} ainda.`},
        {emoji:'🐟', text:`${fmt(ml)} engolidos! Peixe te respeita.`},
        {emoji:'🩸', text:`Sangue menos grosso. Coração feliz. Simples assim.`},
      ]
      toastQ.push(msgs[Math.floor(Math.random()*msgs.length)])
    }

    setXpPop(gained); setTimeout(()=>setXpPop(null),2000)
    setGame({ xp, streak, achievements:ach, lastDate:todayKey() })
    toastQ.forEach((t,i) => setTimeout(()=>toast(t), i*350))
  }, [today, profile, game, toast])

  const pct  = Math.min(100, (today.consumed/profile.goal)*100)
  const mood = pct>=100?'happy': pct>=60?'normal': pct>=30?'sad':'critical'
  const motivational = MOTIVATIONAL[new Date().getDay() % MOTIVATIONAL.length]

  return (
    <Ctx.Provider value={{
      dark,setDark, profile,setProf,
      today,history, game,addWater,
      toasts,xpPop,celebrate,
      pct,mood,motivational,
      notifPerm,requestNotifPerm,
    }}>
      {children}
    </Ctx.Provider>
  )
}

// ─── TAMAGOTCHI CHARACTERS ────────────────────────────────────────────────────
// Each character is drawn entirely with CSS/divs — animated with keyframes

function TamaDroplet({ mood, size=120 }) {
  // Water droplet character with face
  const happy   = mood==='happy'
  const sad     = mood==='sad'
  const crit    = mood==='critical'
  const normal  = mood==='normal'
  return (
    <div className={`tama-wrap tama-${mood}`} style={{width:size,height:size*1.2}}>
      <div className="tama-body tama-droplet-body">
        {/* Eyes */}
        <div className="tama-eyes">
          <div className={`tama-eye${happy?' happy':''}`}>
            {happy && <div className="tama-shine"/>}
            {crit  && <div className="tama-x">×</div>}
          </div>
          <div className={`tama-eye${happy?' happy':''}`}>
            {happy && <div className="tama-shine"/>}
            {crit  && <div className="tama-x">×</div>}
          </div>
        </div>
        {/* Mouth */}
        <div className={`tama-mouth tama-m-${mood}`}/>
        {/* Rosy cheeks when happy */}
        {happy && <><div className="tama-cheek left"/><div className="tama-cheek right"/></>}
        {/* Sweat when critical */}
        {crit && <div className="tama-sweat"/>}
        {/* Tears when sad */}
        {sad && <><div className="tama-tear left"/><div className="tama-tear right"/></>}
        {/* Water fill inside */}
        <div className="tama-water-fill" style={{height:`${Math.max(5,mood==='happy'?90:mood==='normal'?60:mood==='sad'?30:10)}%`}}/>
      </div>
      {/* Arms */}
      <div className={`tama-arm left tama-arm-${mood}`}/>
      <div className={`tama-arm right tama-arm-${mood}`}/>
      {/* Accessories */}
      {happy && <div className="tama-stars"><span>✨</span><span>⭐</span><span>💫</span></div>}
      {crit  && <div className="tama-zzz"><span>💦</span><span>💦</span></div>}
    </div>
  )
}

function TamaDino({ mood, size=120 }) {
  return (
    <div className={`tama-wrap tama-${mood}`} style={{width:size,height:size*1.15}}>
      <div className="tama-body tama-dino-body">
        {/* Spikes */}
        <div className="dino-spikes">
          {[0,1,2,3].map(i=><div key={i} className="dino-spike"/>)}
        </div>
        <div className="tama-eyes">
          <div className={`tama-eye dino-eye${mood==='happy'?' happy':''}`}>
            {mood==='happy' && <div className="tama-shine"/>}
            {mood==='critical' && <div className="tama-x">×</div>}
          </div>
          <div className={`tama-eye dino-eye${mood==='happy'?' happy':''}`}>
            {mood==='happy' && <div className="tama-shine"/>}
            {mood==='critical' && <div className="tama-x">×</div>}
          </div>
        </div>
        <div className={`tama-mouth tama-m-${mood} dino-mouth`}/>
        {mood==='happy' && <><div className="tama-cheek left"/><div className="tama-cheek right"/></>}
        {mood==='sad'   && <><div className="tama-tear left"/><div className="tama-tear right"/></>}
        {mood==='critical' && <div className="tama-sweat"/>}
        <div className="tama-water-fill dino-fill" style={{height:`${mood==='happy'?85:mood==='normal'?55:mood==='sad'?25:8}%`}}/>
      </div>
      <div className={`tama-arm left tama-arm-${mood} dino-arm`}/>
      <div className={`tama-arm right tama-arm-${mood} dino-arm`}/>
      <div className="dino-tail"/>
      {mood==='happy' && <div className="tama-stars"><span>✨</span><span>🌟</span><span>💧</span></div>}
    </div>
  )
}

function TamaWhale({ mood, size=120 }) {
  return (
    <div className={`tama-wrap tama-${mood}`} style={{width:size*1.2,height:size}}>
      <div className="tama-body tama-whale-body">
        <div className="tama-eyes" style={{paddingTop:'18%'}}>
          <div className={`tama-eye whale-eye${mood==='happy'?' happy':''}`}>
            {mood==='happy' && <div className="tama-shine"/>}
            {mood==='critical' && <div className="tama-x">×</div>}
          </div>
          <div className={`tama-eye whale-eye${mood==='happy'?' happy':''}`}>
            {mood==='happy' && <div className="tama-shine"/>}
            {mood==='critical' && <div className="tama-x">×</div>}
          </div>
        </div>
        <div className={`tama-mouth tama-m-${mood}`} style={{marginTop:4}}/>
        {mood==='happy' && <><div className="tama-cheek left"/><div className="tama-cheek right"/></>}
        {mood==='sad'   && <><div className="tama-tear left"/><div className="tama-tear right"/></>}
        <div className="tama-water-fill whale-fill" style={{height:`${mood==='happy'?80:mood==='normal'?50:mood==='sad'?20:5}%`}}/>
      </div>
      {/* Tail */}
      <div className="whale-tail"/>
      {/* Spout when happy */}
      {mood==='happy' && <div className="whale-spout"><span>💦</span></div>}
      {mood==='happy' && <div className="tama-stars"><span>🌊</span><span>✨</span></div>}
    </div>
  )
}

function TamaPlant({ mood, size=120 }) {
  const leaves = mood==='happy'?4:mood==='normal'?3:mood==='sad'?2:1
  return (
    <div className={`tama-wrap tama-${mood}`} style={{width:size,height:size*1.2}}>
      {/* Leaves */}
      <div className="plant-leaves">
        {Array.from({length:leaves}).map((_,i)=>(
          <div key={i} className={`plant-leaf leaf-${i} ${mood==='happy'?'leaf-happy':''}`}/>
        ))}
        {mood==='happy' && <div className="plant-flower">🌸</div>}
      </div>
      <div className="tama-body tama-plant-body">
        <div className="tama-eyes" style={{paddingTop:'15%'}}>
          <div className={`tama-eye${mood==='happy'?' happy':''}`}>
            {mood==='happy' && <div className="tama-shine"/>}
            {mood==='critical' && <div className="tama-x">×</div>}
          </div>
          <div className={`tama-eye${mood==='happy'?' happy':''}`}>
            {mood==='happy' && <div className="tama-shine"/>}
            {mood==='critical' && <div className="tama-x">×</div>}
          </div>
        </div>
        <div className={`tama-mouth tama-m-${mood}`}/>
        {mood==='happy' && <><div className="tama-cheek left"/><div className="tama-cheek right"/></>}
        {mood==='sad'   && <><div className="tama-tear left"/><div className="tama-tear right"/></>}
        {mood==='critical' && <div className="tama-sweat"/>}
        <div className="tama-water-fill plant-fill" style={{
          height:`${mood==='happy'?85:mood==='normal'?55:mood==='sad'?25:8}%`,
          background:mood==='critical'?'#78350f':mood==='sad'?'#a16207':'linear-gradient(#4ade80,#16a34a)'
        }}/>
      </div>
      <div className="plant-pot"/>
    </div>
  )
}

function TamaRobot({ mood, size=120 }) {
  return (
    <div className={`tama-wrap tama-${mood}`} style={{width:size,height:size*1.15}}>
      {/* Antenna */}
      <div className="robot-antenna">
        <div className={`robot-light ${mood==='happy'?'light-on':mood==='critical'?'light-red':'light-dim'}`}/>
      </div>
      <div className="tama-body tama-robot-body">
        {/* Screen face */}
        <div className="robot-screen">
          <div className="tama-eyes robot-eyes">
            <div className={`robot-eye ${mood==='happy'?'eye-happy':mood==='critical'?'eye-crit':''}`}>
              {mood==='happy' && '◉'}
              {mood==='normal' && '●'}
              {mood==='sad' && '◔'}
              {mood==='critical' && '✕'}
            </div>
            <div className={`robot-eye ${mood==='happy'?'eye-happy':mood==='critical'?'eye-crit':''}`}>
              {mood==='happy' && '◉'}
              {mood==='normal' && '●'}
              {mood==='sad' && '◔'}
              {mood==='critical' && '✕'}
            </div>
          </div>
          <div className={`robot-mouth rm-${mood}`}>
            {mood==='happy' && '▲▲▲'}
            {mood==='normal' && '━━━'}
            {mood==='sad' && '▽▽▽'}
            {mood==='critical' && '×××'}
          </div>
          {/* Water level bar on robot */}
          <div className="robot-bar-wrap">
            <div className="robot-bar-fill" style={{width:`${mood==='happy'?90:mood==='normal'?60:mood==='sad'?30:8}%`}}/>
          </div>
        </div>
        <div className="tama-water-fill robot-fill" style={{height:`${mood==='happy'?80:mood==='normal'?50:mood==='sad'?20:5}%`}}/>
      </div>
      <div className={`tama-arm left robot-arm tama-arm-${mood}`}/>
      <div className={`tama-arm right robot-arm tama-arm-${mood}`}/>
      <div className="robot-legs">
        <div className="robot-leg"/><div className="robot-leg"/>
      </div>
      {mood==='happy' && <div className="tama-stars robot-sparks"><span>⚡</span><span>✨</span><span>💡</span></div>}
    </div>
  )
}

const TAMA_COMPONENTS = { drop:TamaDroplet, dino:TamaDino, whale:TamaWhale, plant:TamaPlant, robot:TamaRobot }

function TamaCharacter({ avatarId, mood, size=120 }) {
  const Comp = TAMA_COMPONENTS[avatarId] || TamaDroplet
  return <Comp mood={mood} size={size}/>
}

// ─── SHARED UI COMPONENTS ─────────────────────────────────────────────────────
function XPBar({ compact }) {
  const { game } = useApp()
  const { level, progress, next, title } = xpInfo(game.xp)
  return (
    <div className="xp-wrap">
      <div className="xp-hdr">
        <span className="xp-level">Nível {level}</span>
        {!compact && <span className="xp-title">{title}</span>}
        <span className="xp-pts">{game.xp}/{next} XP</span>
      </div>
      <div className="xp-track">
        <div className="xp-fill" style={{width:`${progress*100}%`}}/>
      </div>
    </div>
  )
}

function RingProgress() {
  const { pct, today, profile, mood } = useApp()
  const size=180, r=(size-22)/2
  const circ=2*Math.PI*r
  const offset=circ-(pct/100)*circ
  const c={happy:'#00d4ff',normal:'#38bdf8',sad:'#a78bfa',critical:'#f87171'}[mood]
  return (
    <div className="ring-wrap">
      <svg width={size} height={size} style={{position:'absolute',top:0,left:0}}>
        <defs>
          <linearGradient id="rg"><stop offset="0%" stopColor="#00d4ff"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={pct>=100?'url(#rg)':c} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{transition:'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)'}}
          filter={pct>=80?'url(#glow)':undefined}/>
      </svg>
      <div className="ring-inner">
        <div className="ring-consumed">{fmt(today.consumed)}</div>
        <div className="ring-of">de {fmt(profile.goal)}</div>
        <div className="ring-pct" style={{color:pct>=100?'#34d399':'#00d4ff'}}>{Math.round(pct)}%</div>
      </div>
    </div>
  )
}

// ─── TOAST LAYER ──────────────────────────────────────────────────────────────
function ToastLayer() {
  const { toasts, xpPop, celebrate } = useApp()
  return (
    <>
      <div className="toast-layer">
        {toasts.map(t=>(
          <div key={t.id} className="toast-item">
            <span style={{fontSize:18}}>{t.emoji}</span>
            <span className="toast-txt">{t.text}</span>
          </div>
        ))}
      </div>
      {xpPop && <div className="xp-pop">+{xpPop} XP ⚡</div>}
      {celebrate && (
        <div className="celebrate-layer" style={{pointerEvents:'none'}}>
          {['🎉','💧','⭐','🏆','✨','🎊','💫','🌊'].map((e,i)=>(
            <span key={i} className={`conf conf-${i}`}>{e}</span>
          ))}
        </div>
      )}
    </>
  )
}

// ─── NOTIFICATION BANNER ──────────────────────────────────────────────────────
function NotifBanner() {
  const { notifPerm, requestNotifPerm } = useApp()
  const [dismissed, setDismissed] = useState(false)
  const [loading, setLoading] = useState(false)

  if (notifPerm === 'granted' || notifPerm === 'denied' || dismissed) return null

  const handle = async () => {
    setLoading(true)
    const perm = await requestNotifPerm()
    setLoading(false)
    if (perm !== 'granted') setDismissed(true)
  }

  return (
    <div className="notif-banner">
      <span>🔔</span>
      <span className="nb-txt">Ative as notificações para receber lembretes!</span>
      <button className="nb-btn" onClick={handle} disabled={loading}>
        {loading ? '...' : 'Ativar'}
      </button>
      <button className="nb-close" onClick={()=>setDismissed(true)}>✕</button>
    </div>
  )
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding() {
  const { profile, setProf, requestNotifPerm } = useApp()
  const [step, setStep] = useState(0)
  const [name, setName]   = useState('')
  const [avatar, setAvatar] = useState('drop')
  const [routine, setRoutine] = useState('normal')
  const sel = ROUTINES.find(r=>r.id===routine)

  const finish = async () => {
    await requestNotifPerm()
    setProf({...profile, name, avatar, routine, goal:sel.goal, onboarded:true})
  }
  const next = () => step<3 ? setStep(s=>s+1) : finish()

  return (
    <div className="ob-shell">
      <div className="ob-dots">
        {[0,1,2,3].map(i=><div key={i} className={`ob-dot${i<=step?' on':''}${i===step?' cur':''}`}/>)}
      </div>
      <div className="ob-body">
        {step===0 && (
          <div className="ob-step fade-in">
            <div style={{display:'flex',justifyContent:'center',marginBottom:16}}>
              <TamaCharacter avatarId="drop" mood="happy" size={100}/>
            </div>
            <h1 className="ob-title">Olá! Eu sou o<br/><span className="cyan">Hydra+</span>!</h1>
            <p className="ob-sub">Vou te ajudar a beber água de forma divertida e gamificada.</p>
            <div className="ob-features">
              {['🎮 Personagens Tamagotchi animados','🔔 Notificações inteligentes no celular','📊 Estatísticas e conquistas','🏆 XP, níveis e streaks diários'].map((f,i)=>(
                <div key={i} className="ob-feat">{f}</div>
              ))}
            </div>
          </div>
        )}
        {step===1 && (
          <div className="ob-step fade-in">
            <h2 className="ob-title">Qual é o<br/>seu nome?</h2>
            <p className="ob-sub">Para eu poder te chamar direitinho 😊</p>
            <input className="ob-input" placeholder="Seu nome..." value={name} onChange={e=>setName(e.target.value)} autoFocus/>
          </div>
        )}
        {step===2 && (
          <div className="ob-step fade-in">
            <h2 className="ob-title">Escolha<br/>seu avatar</h2>
            <p className="ob-sub">Quem vai te acompanhar nessa jornada?</p>
            <div className="ob-avatar-grid">
              {AVATARS.map(a=>(
                <button key={a.id} className={`ob-av-btn${avatar===a.id?' sel':''}`} onClick={()=>setAvatar(a.id)}>
                  <div style={{transform:'scale(0.55)',transformOrigin:'center',height:80,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                    <TamaCharacter avatarId={a.id} mood="happy" size={100}/>
                  </div>
                  <span className="ob-av-label">{a.label}</span>
                  {avatar===a.id && <span className="ob-av-check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}
        {step===3 && (
          <div className="ob-step fade-in">
            <h2 className="ob-title">Qual é<br/>sua rotina?</h2>
            <p className="ob-sub">Isso define sua meta diária de hidratação</p>
            <div className="ob-routines">
              {ROUTINES.map(r=>(
                <button key={r.id} className={`ob-routine${routine===r.id?' sel':''}`} onClick={()=>setRoutine(r.id)}>
                  <span style={{fontSize:24}}>{r.icon}</span>
                  <div className="ob-rt-info"><span className="ob-rt-name">{r.label}</span><span className="ob-rt-desc">{r.desc}</span></div>
                  <span className={`ob-rt-goal${routine===r.id?' cyan':''}`}>{fmt(r.goal)}/dia</span>
                  {routine===r.id && <span className="cyan">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="ob-actions">
        {step>0 && <button className="btn-sec" onClick={()=>setStep(s=>s-1)}>← Voltar</button>}
        <button className="btn-pri" onClick={next}>{step===3?'🚀 Começar!':'Continuar →'}</button>
      </div>
    </div>
  )
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
function HomeScreen() {
  const { profile, today, game, addWater, pct, mood, motivational, dark, setDark } = useApp()
  const [customAmt, setCustomAmt] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const { level } = xpInfo(game.xp)
  const remaining = Math.max(0, profile.goal - today.consumed)

  const moodInfo = {
    happy:   {text:'Você está incrível hoje!',  color:'#34d399'},
    normal:  {text:'Continue bebendo água!',    color:'#00d4ff'},
    sad:     {text:'Beba mais água agora!',      color:'#a78bfa'},
    critical:{text:'ALERTA! Hidrate-se já!',    color:'#f87171'},
  }[mood]

  const doCustom = () => {
    const ml = parseInt(customAmt)
    if (ml>0 && ml<=3000) { addWater(ml); setCustomAmt(''); setShowCustom(false) }
  }

  return (
    <div className="screen home-screen">
      {/* Header */}
      <div className="home-hdr">
        <div>
          <div className="home-greeting">Olá, {profile.name||'Hidratante'}! 👋</div>
          <div className="home-date">{new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})}</div>
        </div>
        <div className="home-hdr-right">
          <button className="icon-btn" onClick={()=>setDark(d=>!d)}>{dark?'☀️':'🌙'}</button>
          <div className="level-badge">Nv.{level}</div>
          <div className="streak-badge">🔥{game.streak}</div>
        </div>
      </div>

      <XPBar/>

      {/* Motivational */}
      <div className="motiv-card glass-card">💬 {motivational}</div>

      {/* Main Dashboard — Character + Ring */}
      <div className="dashboard">
        <div className="dash-tama">
          <TamaCharacter avatarId={profile.avatar} mood={mood} size={110}/>
          <div className="mood-lbl" style={{color:moodInfo.color}}>{moodInfo.text}</div>
        </div>
        <div className="dash-ring">
          <RingProgress/>
        </div>
      </div>

      {/* Remaining */}
      <div className="remain-row">
        {pct<100
          ? <><span className="remain-lbl">Faltam </span><span className="remain-amt">{fmt(remaining)}</span><span className="remain-lbl"> para a meta</span></>
          : <span className="goal-done">🎉 Meta do dia atingida! Incrível!</span>
        }
      </div>

      {/* Quick Add */}
      <div className="sec-lbl">ADICIONAR ÁGUA</div>
      <div className="quick-grid">
        {[100,200,300,500].map(ml=>(
          <button key={ml} className="quick-btn" onClick={()=>addWater(ml)}>
            <span className="quick-icon">💧</span>
            <span className="quick-lbl">+{ml}ml</span>
          </button>
        ))}
      </div>
      <button className="custom-btn" onClick={()=>setShowCustom(v=>!v)}>
        {showCustom?'✕ Cancelar':'⚖️ Quantidade personalizada'}
      </button>
      {showCustom && (
        <div className="custom-row fade-in">
          <input className="custom-input" type="number" placeholder="Ex: 350" value={customAmt}
            onChange={e=>setCustomAmt(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doCustom()}/>
          <span className="ml-lbl">ml</span>
          <button className="btn-pri small" onClick={doCustom}>+</button>
        </div>
      )}

      {/* Log */}
      {today.logs.length>0 && <>
        <div className="sec-lbl" style={{marginTop:18}}>REGISTRO DE HOJE</div>
        {[...today.logs].reverse().slice(0,6).map((log,i)=>(
          <div key={i} className="log-item glass-card fade-in">
            <span style={{fontSize:18}}>💧</span>
            <span className="log-ml">+{log.ml}ml</span>
            <span className="log-time">{log.time}</span>
          </div>
        ))}
      </>}
      <div style={{height:24}}/>
    </div>
  )
}

// ─── STATS SCREEN ─────────────────────────────────────────────────────────────
function StatsScreen() {
  const { today, history, profile, game } = useApp()
  const { level } = xpInfo(game.xp)
  const week = [...history.slice(-6), {date:todayKey(),consumed:today.consumed,goal:profile.goal}]
  const totalWeek = week.reduce((s,d)=>s+d.consumed,0)
  const avg  = Math.round(totalWeek/week.length)
  const best = Math.max(...week.map(d=>d.consumed))
  const achieved = week.filter(d=>d.consumed>=d.goal).length
  const days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

  return (
    <div className="screen">
      <div className="scr-hdr">
        <h2 className="scr-title">Estatísticas 📊</h2>
        <p className="scr-sub">Sua evolução de hidratação</p>
      </div>
      <div className="stats-grid">
        {[
          {icon:'🔥',val:game.streak,lbl:'Dias seguidos',cls:'cyan'},
          {icon:'⭐',val:game.xp,lbl:'XP Total',cls:'purple'},
          {icon:'🏆',val:level,lbl:'Nível atual',cls:'blue'},
          {icon:'✅',val:`${achieved}/7`,lbl:'Metas atingidas',cls:'green'},
        ].map((s,i)=>(
          <div key={i} className={`stat-card sc-${s.cls}`}>
            <div className="sc-icon">{s.icon}</div>
            <div className="sc-val">{s.val}</div>
            <div className="sc-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>
      <div className="glass-card">
        <div className="card-title">Consumo Semanal</div>
        <div className="bar-chart">
          {week.map((d,i)=>{
            const p=Math.min(100,(d.consumed/d.goal)*100)
            const isToday=d.date===todayKey()
            const dObj=new Date(d.date+'T12:00:00')
            return (
              <div key={i} className="bar-col">
                <div className="bar-amt">{fmt(d.consumed)}</div>
                <div className="bar-track">
                  <div className={`bar-fill${p>=100?' complete':''}${isToday?' today':''}`} style={{height:`${Math.max(4,p)}%`}}/>
                </div>
                <div className={`bar-day${isToday?' today-lbl':''}`}>{days[dObj.getDay()]}</div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="glass-card">
        <div className="card-title">Resumo Semanal</div>
        {[['💧 Total da semana',fmt(totalWeek)],['📈 Média diária',fmt(avg)],['🏆 Melhor dia',fmt(best)],['🎯 Meta diária',fmt(profile.goal)],['🔥 Streak atual',`${game.streak} dias`]].map(([k,v],i)=>(
          <div key={i} className="sum-row"><span>{k}</span><strong>{v}</strong></div>
        ))}
      </div>
      <div className="glass-card">
        <div className="card-title">Progresso vs Meta</div>
        {week.map((d,i)=>{
          const p=Math.min(100,(d.consumed/d.goal)*100)
          const dObj=new Date(d.date+'T12:00:00')
          return (
            <div key={i} className="pr-row">
              <span className="pr-day">{days[dObj.getDay()]}</span>
              <div className="pr-track"><div className={`pr-fill${p>=100?' c':p>=70?' g':' l'}`} style={{width:`${p}%`}}/></div>
              <span className="pr-pct">{Math.round(p)}%</span>
            </div>
          )
        })}
      </div>
      <div style={{height:24}}/>
    </div>
  )
}

// ─── ACHIEVEMENTS SCREEN ──────────────────────────────────────────────────────
function AchievementsScreen() {
  const { game } = useApp()
  const { level, title } = xpInfo(game.xp)
  return (
    <div className="screen">
      <div className="scr-hdr">
        <h2 className="scr-title">Conquistas 🏆</h2>
        <p className="scr-sub">Sua coleção de medalhas</p>
      </div>
      <div className="glass-card level-show">
        <div style={{fontSize:44}}>👑</div>
        <div className="ls-info">
          <div className="ls-level">Nível {level}</div>
          <div className="ls-title">{title}</div>
          <XPBar compact/>
        </div>
      </div>
      <div className="glass-card streak-show">
        <div style={{fontSize:44}}>🔥</div>
        <div>
          <div className="ss-num">{game.streak} dias</div>
          <div className="ss-lbl">de sequência atual</div>
          <div className="ss-quote">"Hidratando igual um campeão!"</div>
        </div>
      </div>
      <div className="sec-lbl">CONQUISTAS ({game.achievements.length}/{ACHIEVEMENTS.length})</div>
      <div className="ach-grid">
        {ACHIEVEMENTS.map(a=>{
          const unlocked=game.achievements.includes(a.id)
          return (
            <div key={a.id} className={`ach-card${unlocked?' unlocked':' locked'}`}>
              <div className="ach-icon">{unlocked?a.icon:'🔒'}</div>
              <div className="ach-lbl">{a.label}</div>
              <div className="ach-desc">{a.desc}</div>
              <div className="ach-xp">+{a.xp} XP</div>
            </div>
          )
        })}
      </div>
      <div style={{height:24}}/>
    </div>
  )
}

// ─── SETTINGS SCREEN ─────────────────────────────────────────────────────────
function NotifPreview() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * NOTIF_MSGS.length))
  const [animKey, setAnimKey] = useState(0)
  useEffect(() => {
    const t = setInterval(() => {
      setIdx(Math.floor(Math.random() * NOTIF_MSGS.length))
      setAnimKey(k => k + 1)
    }, 3500)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{marginTop:14}}>
      <div className="card-title" style={{marginBottom:8}}>🔔 Preview de notificação:</div>
      <div key={animKey} className="notif-prev-bubble fade-in">
        <div className="npb-header">
          <span className="npb-icon">💧</span>
          <span className="npb-app">Hydra+</span>
          <span className="npb-time">agora</span>
        </div>
        <div className="npb-body">{NOTIF_MSGS[idx]}</div>
        <div className="npb-actions">
          <span className="npb-action">💧 Bebi!</span>
          <span className="npb-action">⏰ Depois</span>
        </div>
      </div>
    </div>
  )
}

function SettingsScreen() {
  const { profile, setProf, dark, setDark, game, notifPerm, requestNotifPerm } = useApp()
  const [local, setLocal] = useState(profile)
  const upd = (k,v) => { const np={...local,[k]:v}; setLocal(np); setProf(np) }

  return (
    <div className="screen">
      <div className="scr-hdr">
        <h2 className="scr-title">Configurações ⚙️</h2>
        <p className="scr-sub">Personalize sua experiência</p>
      </div>

      {/* Avatar preview + selection */}
      <div className="glass-card">
        <div className="card-title">Meu Personagem</div>
        <div style={{display:'flex',justifyContent:'center',marginBottom:12}}>
          <TamaCharacter avatarId={local.avatar} mood="happy" size={90}/>
        </div>
        <div className="cfg-av-grid">
          {AVATARS.map(a=>(
            <button key={a.id} className={`ob-av-btn sm${local.avatar===a.id?' sel':''}`} onClick={()=>upd('avatar',a.id)}>
              <span style={{fontSize:22}}>{a.emoji}</span>
              <span className="ob-av-label">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Routine */}
      <div className="glass-card">
        <div className="card-title">Rotina & Meta</div>
        <div className="cfg-routines">
          {ROUTINES.map(r=>(
            <button key={r.id} className={`ob-routine sm${local.routine===r.id?' sel':''}`} onClick={()=>{upd('routine',r.id);upd('goal',r.goal)}}>
              <span style={{fontSize:20}}>{r.icon}</span>
              <div className="ob-rt-info"><span className="ob-rt-name">{r.label}</span><span className="ob-rt-desc">{r.desc}</span></div>
              <span className={`ob-rt-goal${local.routine===r.id?' cyan':''}`}>{fmt(r.goal)}/dia</span>
              {local.routine===r.id && <span className="cyan">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card">
        <div className="card-title">Notificações no Celular</div>
        <div className={`notif-status ns-${notifPerm}`}>
          {notifPerm==='granted' && '✅ Notificações ativadas!'}
          {notifPerm==='denied'  && '❌ Notificações bloqueadas. Ative nas configurações do browser.'}
          {notifPerm==='default' && '⚠️ Notificações não configuradas'}
        </div>
        {notifPerm!=='granted' && notifPerm!=='denied' && (
          <button className="btn-outline" onClick={requestNotifPerm} style={{marginTop:10}}>
            🔔 Ativar notificações
          </button>
        )}
        <div className="notif-how">
          <div className="card-title" style={{marginTop:12,marginBottom:8}}>Como instalar no celular:</div>
          <div className="how-step"><span>📱</span><span><b>Android:</b> Chrome → menu (⋮) → "Adicionar à tela inicial"</span></div>
          <div className="how-step"><span>🍎</span><span><b>iPhone:</b> Safari → compartilhar (□↑) → "Adicionar à Tela de Início"</span></div>
          <div className="how-step"><span>🔔</span><span>Após instalar, ative as notificações quando solicitado</span></div>
        </div>
        {[
          {lbl:'Intervalo',key:'notifInterval',min:15,max:120,step:15,suffix:'min'},
          {lbl:'Início',   key:'notifStart',   min:5,  max:12, step:1,  suffix:'h'},
          {lbl:'Fim',      key:'notifEnd',     min:18, max:23, step:1,  suffix:'h'},
        ].map(s=>(
          <div key={s.key} className="cfg-slider">
            <span className="cfg-sl-lbl">{s.lbl}</span>
            <input type="range" min={s.min} max={s.max} step={s.step} value={local[s.key]}
              onChange={e=>upd(s.key,+e.target.value)} className="slider"/>
            <span className="cfg-sl-val">{local[s.key]}{s.suffix}</span>
          </div>
        ))}
        <NotifPreview/>
      </div>

      {/* Toggles */}
      <div className="glass-card">
        <div className="card-title">Preferências</div>
        {[{icon:'📳',lbl:'Vibração',key:'vibrationEnabled'}].map(t=>(
          <div key={t.key} className="toggle-row">
            <span>{t.icon} {t.lbl}</span>
            <button className={`toggle${local[t.key]?' on':' off'}`} onClick={()=>upd(t.key,!local[t.key])}>
              <div className="toggle-thumb"/>
            </button>
          </div>
        ))}
        <div className="toggle-row">
          <span>{dark?'🌙':'☀️'} Modo escuro</span>
          <button className={`toggle${dark?' on':' off'}`} onClick={()=>setDark(d=>!d)}>
            <div className="toggle-thumb"/>
          </button>
        </div>
      </div>

      <div className="glass-card">
        <div className="card-title">Dados</div>
        <div className="sum-row"><span>XP acumulado</span><strong>{game.xp} XP</strong></div>
        <div className="sum-row"><span>Conquistas</span><strong>{game.achievements.length}/{ACHIEVEMENTS.length}</strong></div>
        <button className="btn-danger" onClick={()=>{if(confirm('Resetar todos os dados?')){localStorage.clear();window.location.reload()}}}>
          🗑️ Resetar todos os dados
        </button>
      </div>
      <div style={{height:24}}/>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
function MainApp() {
  const { dark } = useApp()
  const [tab, setTab] = useState('home')
  const tabs=[
    {id:'home',         icon:'💧', label:'Início'   },
    {id:'stats',        icon:'📊', label:'Stats'    },
    {id:'achievements', icon:'🏆', label:'Conquistas'},
    {id:'settings',     icon:'⚙️', label:'Config'   },
  ]
  return (
    <div className={`app-shell${dark?'':' light'}`}>
      <NotifBanner/>
      <ToastLayer/>
      <div className="app-content">
        {tab==='home'         && <HomeScreen/>}
        {tab==='stats'        && <StatsScreen/>}
        {tab==='achievements' && <AchievementsScreen/>}
        {tab==='settings'     && <SettingsScreen/>}
      </div>
      <nav className="bottom-nav">
        {tabs.map(t=>(
          <button key={t.id} className={`nav-tab${tab===t.id?' active':''}`} onClick={()=>setTab(t.id)}>
            <span className="nav-icon">{t.icon}</span>
            <span className="nav-lbl">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

// ─── SPLASH ───────────────────────────────────────────────────────────────────
function Splash({ onDone }) {
  useEffect(()=>{ setTimeout(onDone,2600) },[])
  return (
    <div className="splash">
      <div className="splash-inner">
        <TamaCharacter avatarId="drop" mood="happy" size={110}/>
        <h1 className="splash-title">Hydra<span>+</span></h1>
        <p className="splash-sub">Seu companheiro de hidratação</p>
      </div>
      <div className="splash-bar"><div className="splash-fill"/></div>
    </div>
  )
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
function AppInner() {
  const { profile } = useApp()
  const [splashDone, setSplashDone] = useState(false)
  if (!splashDone) return <Splash onDone={()=>setSplashDone(true)}/>
  if (!profile.onboarded) return <Onboarding/>
  return <MainApp/>
}

export default function App() {
  return <><Styles/><AppProvider><AppInner/></AppProvider></>
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
function Styles() {
  return <style>{`
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#050d1a;--bg2:#0a1628;--card:rgba(255,255,255,.07);
  --border:rgba(255,255,255,.11);--cyan:#00d4ff;--cyan2:#0099bb;
  --blue:#38bdf8;--purple:#a78bfa;--green:#34d399;--amber:#fbbf24;
  --red:#f87171;--t1:#f0f9ff;--t2:#7ea9c4;--t3:#4a6782;
}
.light{
  --bg:#f0f9ff;--bg2:#e0f2fe;--card:rgba(255,255,255,.88);
  --border:rgba(14,165,233,.18);--t1:#0c2340;--t2:#1e6094;--t3:#7ba9c4;
}
html,body,#root{height:100%;width:100%;overflow:hidden}
body{font-family:'Nunito',sans-serif;background:var(--bg);color:var(--t1);overscroll-behavior:none}

/* ── Shell ── */
.app-shell{max-width:430px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;background:var(--bg);overflow:hidden;position:relative}
.app-content{flex:1;overflow-y:auto;overflow-x:hidden;scrollbar-width:none}
.app-content::-webkit-scrollbar{display:none}
.screen{padding:12px 16px 0}

/* ── Splash ── */
.splash{height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px;background:radial-gradient(ellipse at center,#051830,#020a14)}
.splash-inner{text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px}
.splash-title{font-family:'Space Grotesk',sans-serif;font-size:52px;font-weight:700;color:#f0f9ff;letter-spacing:-2px}
.splash-title span{color:var(--cyan)}
.splash-sub{font-size:15px;color:var(--t2)}
.splash-bar{width:200px;height:3px;background:rgba(255,255,255,.1);border-radius:99px;overflow:hidden}
.splash-fill{height:100%;background:linear-gradient(90deg,var(--cyan),var(--purple));animation:splashLoad 2.2s .4s ease forwards;width:0}
@keyframes splashLoad{to{width:100%}}

/* ── Notification Banner ── */
.notif-banner{
  background:linear-gradient(90deg,rgba(0,212,255,.18),rgba(167,139,250,.18));
  border-bottom:1px solid rgba(0,212,255,.25);
  padding:10px 14px;display:flex;align-items:center;gap:8px;font-size:13px;
}
.nb-txt{flex:1;color:var(--t1);font-weight:600}
.nb-btn{background:var(--cyan);color:#050d1a;border:none;border-radius:8px;padding:6px 14px;font-weight:900;font-family:'Nunito',sans-serif;cursor:pointer;font-size:12px}
.nb-close{background:none;border:none;color:var(--t2);cursor:pointer;font-size:16px;padding:2px 6px}

/* ── Onboarding ── */
.ob-shell{min-height:100dvh;display:flex;flex-direction:column;padding:24px 20px 40px;background:var(--bg)}
.ob-dots{display:flex;gap:8px;justify-content:center;margin-bottom:24px}
.ob-dot{width:8px;height:8px;border-radius:99px;background:rgba(255,255,255,.14);transition:all .3s}
.ob-dot.on{background:rgba(0,212,255,.5)}.ob-dot.cur{width:26px;background:var(--cyan)}
.ob-body{flex:1}
.ob-step{padding-bottom:12px}
.ob-title{font-family:'Space Grotesk',sans-serif;font-size:30px;font-weight:700;line-height:1.15;margin-bottom:8px}
.ob-sub{font-size:14px;color:var(--t2);margin-bottom:20px;line-height:1.6}
.ob-features{display:flex;flex-direction:column;gap:9px}
.ob-feat{padding:13px 16px;background:var(--card);border:1px solid var(--border);border-radius:14px;font-size:14px;font-weight:600}
.ob-input{width:100%;padding:16px 18px;background:var(--card);border:1.5px solid var(--border);border-radius:16px;color:var(--t1);font-family:'Nunito',sans-serif;font-size:17px;font-weight:600;outline:none;transition:border-color .2s}
.ob-input:focus{border-color:var(--cyan)}.ob-input::placeholder{color:var(--t3)}
.ob-avatar-grid{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.ob-av-btn{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px;background:var(--card);border:2px solid var(--border);border-radius:18px;cursor:pointer;color:var(--t1);width:calc(33% - 8px);position:relative;transition:all .2s;overflow:hidden}
.ob-av-btn.sm{width:auto;padding:10px 14px}
.ob-av-btn.sel{border-color:var(--cyan);background:rgba(0,212,255,.1)}
.ob-av-label{font-size:11px;color:var(--t2);font-weight:700}
.ob-av-check{position:absolute;top:5px;right:8px;font-size:12px;font-weight:900;color:var(--cyan)}
.ob-routines{display:flex;flex-direction:column;gap:8px}
.ob-routine{display:flex;align-items:center;gap:12px;padding:13px 16px;background:var(--card);border:2px solid var(--border);border-radius:14px;cursor:pointer;color:var(--t1);text-align:left;width:100%;transition:all .2s}
.ob-routine.sm{padding:10px 13px}.ob-routine.sel{border-color:var(--cyan);background:rgba(0,212,255,.08)}
.ob-rt-info{flex:1}.ob-rt-name{display:block;font-weight:800;font-size:15px}.ob-rt-desc{display:block;font-size:11px;color:var(--t2);margin-top:1px}
.ob-rt-goal{font-size:13px;font-weight:700;color:var(--t3)}.ob-rt-goal.cyan,.cyan{color:var(--cyan)!important}
.ob-actions{display:flex;gap:12px;padding-top:20px}
.btn-pri{flex:1;padding:16px;background:linear-gradient(135deg,var(--cyan),#0099ee);border:none;border-radius:16px;color:#fff;font-family:'Nunito',sans-serif;font-size:16px;font-weight:900;cursor:pointer;transition:transform .15s;box-shadow:0 4px 20px rgba(0,212,255,.28)}
.btn-pri:active{transform:scale(.96)}.btn-pri.small{flex:0;padding:11px 18px;font-size:14px}
.btn-sec{padding:16px 18px;background:var(--card);border:1px solid var(--border);border-radius:16px;color:var(--t2);font-family:'Nunito',sans-serif;font-size:15px;font-weight:700;cursor:pointer}
.btn-outline{width:100%;padding:12px;background:transparent;border:1.5px solid var(--border);border-radius:12px;color:var(--cyan);font-family:'Nunito',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:border-color .2s}
.btn-danger{width:100%;padding:12px;background:rgba(248,113,113,.1);border:1.5px solid rgba(248,113,113,.3);border-radius:12px;color:var(--red);font-family:'Nunito',sans-serif;font-size:13px;font-weight:700;cursor:pointer;margin-top:12px}

/* ── Glass card ── */
.glass-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:16px;margin-bottom:12px}
.card-title{font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:600;color:var(--t2);text-transform:uppercase;letter-spacing:.6px;margin-bottom:12px}

/* ── Bottom nav ── */
.bottom-nav{display:flex;background:var(--bg2);border-top:1px solid var(--border);padding:6px 0 max(6px,env(safe-area-inset-bottom))}
.nav-tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 4px;background:none;border:none;cursor:pointer;color:var(--t3);transition:color .2s}
.nav-tab.active{color:var(--cyan)}.nav-tab.active .nav-icon{transform:scale(1.18)}
.nav-icon{font-size:22px;transition:transform .2s;display:block}.nav-lbl{font-size:10px;font-weight:700}

/* ── Home ── */
.home-screen{padding-top:max(12px,env(safe-area-inset-top))}
.home-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
.home-greeting{font-size:17px;font-weight:900}.home-date{font-size:11px;color:var(--t2);text-transform:capitalize;margin-top:2px}
.home-hdr-right{display:flex;align-items:center;gap:7px}
.icon-btn{background:none;border:none;font-size:20px;cursor:pointer;padding:2px}
.level-badge{background:linear-gradient(135deg,var(--purple),var(--cyan));color:#fff;font-size:11px;font-weight:900;padding:4px 10px;border-radius:99px}
.streak-badge{background:rgba(251,191,36,.14);color:var(--amber);font-size:11px;font-weight:900;padding:4px 10px;border-radius:99px;border:1px solid rgba(251,191,36,.3)}
.xp-wrap{margin-bottom:10px}.xp-hdr{display:flex;align-items:center;gap:7px;margin-bottom:5px}
.xp-level{font-size:11px;font-weight:900;color:var(--cyan)}.xp-title{font-size:11px;color:var(--t2);flex:1}.xp-pts{font-size:10px;color:var(--t3)}
.xp-track{height:6px;background:rgba(255,255,255,.07);border-radius:99px;overflow:hidden;border:1px solid var(--border)}
.xp-fill{height:100%;background:linear-gradient(90deg,var(--cyan),var(--purple));border-radius:99px;transition:width 1s ease}
.motiv-card{font-size:12px;color:var(--t2);font-style:italic;padding:11px 14px;margin-bottom:12px}
.dashboard{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px}
.dash-tama{display:flex;flex-direction:column;align-items:center;gap:6px;flex:0 0 auto}
.dash-ring{flex:1;display:flex;justify-content:center}
.mood-lbl{font-size:11px;text-align:center;font-weight:700;line-height:1.3;max-width:110px}
.remain-row{display:flex;align-items:center;justify-content:center;gap:5px;margin-bottom:16px;flex-wrap:wrap}
.remain-lbl{font-size:13px;color:var(--t2)}.remain-amt{font-size:19px;font-weight:900;color:var(--cyan);font-family:'Space Grotesk',sans-serif}
.goal-done{font-size:15px;font-weight:900;color:var(--green)}
.sec-lbl{font-size:11px;font-weight:900;color:var(--t2);text-transform:uppercase;letter-spacing:.6px;margin-bottom:9px}
.quick-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px}
.quick-btn{display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 4px;background:var(--card);border:1.5px solid var(--border);border-radius:16px;cursor:pointer;color:var(--t1);font-family:'Nunito',sans-serif;transition:all .15s}
.quick-btn:active{transform:scale(.93);border-color:var(--cyan);background:rgba(0,212,255,.12)}
.quick-icon{font-size:20px}.quick-lbl{font-size:12px;font-weight:900}
.custom-btn{width:100%;padding:12px;background:var(--card);border:1.5px dashed var(--border);border-radius:14px;color:var(--t2);font-family:'Nunito',sans-serif;font-size:13px;font-weight:700;cursor:pointer;margin-bottom:10px;transition:all .2s}
.custom-row{display:flex;gap:8px;align-items:center;margin-bottom:10px}
.custom-input{flex:1;padding:12px 14px;background:var(--card);border:1.5px solid var(--border);border-radius:14px;color:var(--t1);font-family:'Nunito',sans-serif;font-size:15px;font-weight:600;outline:none}
.custom-input:focus{border-color:var(--cyan)}.ml-lbl{color:var(--t2);font-weight:700}
.log-item{display:flex;align-items:center;gap:12px;padding:10px 14px;margin-bottom:6px}
.log-ml{flex:1;font-weight:900;font-size:14px;color:var(--cyan)}.log-time{font-size:12px;color:var(--t3)}

/* ── Ring ── */
.ring-wrap{position:relative;width:178px;height:178px;display:flex;align-items:center;justify-content:center}
.ring-inner{text-align:center;pointer-events:none}
.ring-consumed{font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:700}.ring-of{font-size:11px;color:var(--t2)}.ring-pct{font-size:14px;font-weight:900;margin-top:2px;transition:color .5s}

/* ── Stats ── */
.scr-hdr{margin-bottom:14px;padding-top:max(12px,env(safe-area-inset-top))}
.scr-title{font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:700}.scr-sub{font-size:13px;color:var(--t2);margin-top:2px}
.stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.stat-card{padding:14px;border-radius:18px;text-align:center;border:1.5px solid}
.sc-cyan{background:rgba(0,212,255,.08);border-color:rgba(0,212,255,.25)}.sc-purple{background:rgba(167,139,250,.08);border-color:rgba(167,139,250,.25)}
.sc-blue{background:rgba(56,189,248,.08);border-color:rgba(56,189,248,.25)}.sc-green{background:rgba(52,211,153,.08);border-color:rgba(52,211,153,.25)}
.sc-icon{font-size:26px;margin-bottom:6px}.sc-val{font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:700}.sc-lbl{font-size:11px;color:var(--t2);font-weight:700;margin-top:2px}
.bar-chart{display:flex;align-items:flex-end;gap:6px;height:120px;padding-top:22px}
.bar-col{flex:1;display:flex;flex-direction:column;align-items:center;height:100%}
.bar-amt{font-size:7px;color:var(--t3);margin-bottom:3px;text-align:center}
.bar-track{flex:1;width:100%;background:rgba(255,255,255,.05);border-radius:6px;overflow:hidden;display:flex;align-items:flex-end;border:1px solid var(--border)}
.bar-fill{width:100%;border-radius:5px;background:linear-gradient(180deg,var(--blue),var(--cyan2));transition:height 1s ease}
.bar-fill.complete{background:linear-gradient(180deg,#34d399,#059669)}.bar-fill.today{background:linear-gradient(180deg,var(--cyan),var(--purple));box-shadow:0 0 10px rgba(0,212,255,.35)}
.bar-day{font-size:10px;color:var(--t2);margin-top:4px;font-weight:700}.today-lbl{color:var(--cyan)}
.sum-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);font-size:13px;color:var(--t2)}
.sum-row:last-of-type{border-bottom:none}.sum-row strong{color:var(--t1);font-size:14px}
.pr-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.pr-day{font-size:12px;font-weight:900;color:var(--t2);width:28px}
.pr-track{flex:1;height:8px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden}
.pr-fill{height:100%;border-radius:99px;transition:width 1s ease}
.pr-fill.c{background:var(--green)}.pr-fill.g{background:var(--cyan)}.pr-fill.l{background:var(--purple)}
.pr-pct{font-size:11px;font-weight:700;color:var(--t2);width:32px;text-align:right}

/* ── Achievements ── */
.level-show{display:flex;align-items:center;gap:14px}
.ls-info{flex:1}.ls-level{font-family:'Space Grotesk',sans-serif;font-size:19px;font-weight:700}.ls-title{font-size:12px;color:var(--cyan);font-weight:700;margin-bottom:8px}
.streak-show{display:flex;align-items:center;gap:14px;background:rgba(251,191,36,.08);border-color:rgba(251,191,36,.25)}
.ss-num{font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:700;color:var(--amber)}.ss-lbl{font-size:12px;color:var(--t2)}.ss-quote{font-size:11px;color:var(--t3);font-style:italic;margin-top:4px}
.ach-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.ach-card{padding:14px;border-radius:18px;text-align:center;border:1.5px solid var(--border);background:var(--card);transition:all .2s}
.ach-card.unlocked{border-color:rgba(0,212,255,.3);background:rgba(0,212,255,.05)}.ach-card.locked{opacity:.55}
.ach-icon{font-size:30px;display:block;margin-bottom:6px}.ach-lbl{font-size:12px;font-weight:900;margin-bottom:2px}.ach-desc{font-size:10px;color:var(--t2);margin-bottom:4px;line-height:1.3}.ach-xp{font-size:10px;font-weight:900;color:var(--cyan)}

/* ── Settings ── */
.cfg-av-grid{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}.cfg-routines{display:flex;flex-direction:column;gap:7px}
.cfg-slider{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)}
.cfg-slider:last-of-type{border-bottom:none}.cfg-sl-lbl{font-size:13px;color:var(--t2);width:60px}
.slider{flex:1;accent-color:var(--cyan);cursor:pointer}.cfg-sl-val{font-size:13px;font-weight:700;color:var(--cyan);width:44px;text-align:right}
.toggle-row{display:flex;align-items:center;justify-content:space-between;padding:13px 0;border-bottom:1px solid var(--border);font-size:14px;color:var(--t1)}
.toggle-row:last-child{border-bottom:none}
.toggle{width:50px;height:28px;border-radius:99px;border:none;cursor:pointer;position:relative;transition:background .3s}
.toggle.on{background:var(--cyan)}.toggle.off{background:rgba(255,255,255,.15)}
.toggle-thumb{position:absolute;top:4px;width:20px;height:20px;background:#fff;border-radius:50%;transition:left .3s}
.toggle.on .toggle-thumb{left:26px}.toggle.off .toggle-thumb{left:4px}
.notif-status{padding:10px 14px;border-radius:12px;font-size:13px;font-weight:600;margin-bottom:4px}
.ns-granted{background:rgba(52,211,153,.12);color:var(--green);border:1px solid rgba(52,211,153,.3)}
.ns-denied{background:rgba(248,113,113,.12);color:var(--red);border:1px solid rgba(248,113,113,.3)}
.ns-default{background:rgba(251,191,36,.1);color:var(--amber);border:1px solid rgba(251,191,36,.3)}
.notif-how{margin-top:4px}.how-step{display:flex;gap:8px;font-size:12px;color:var(--t2);padding:5px 0;border-bottom:1px solid var(--border)}.how-step:last-child{border-bottom:none}.how-step b{color:var(--t1)}
.notif-prev-bubble{
  background:rgba(255,255,255,0.08);
  border:1px solid rgba(255,255,255,0.15);
  border-radius:16px;padding:12px 14px;
  box-shadow:0 4px 20px rgba(0,0,0,0.3);
}
.npb-header{display:flex;align-items:center;gap:7px;margin-bottom:6px}
.npb-icon{font-size:16px}
.npb-app{font-size:12px;font-weight:900;color:var(--cyan);flex:1}
.npb-time{font-size:11px;color:var(--t3)}
.npb-body{font-size:13px;color:var(--t1);font-weight:600;line-height:1.4;margin-bottom:10px}
.npb-actions{display:flex;gap:8px}
.npb-action{font-size:11px;font-weight:800;color:var(--cyan);background:rgba(0,212,255,0.12);border:1px solid rgba(0,212,255,0.25);padding:4px 12px;border-radius:99px}

/* ── Toast ── */
.toast-layer{position:fixed;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;z-index:9999;padding-top:max(14px,env(safe-area-inset-top));pointer-events:none;display:flex;flex-direction:column;align-items:center;gap:8px}
.toast-item{display:flex;align-items:center;gap:10px;padding:11px 20px;background:rgba(5,13,26,.97);border:1px solid var(--cyan);border-radius:99px;box-shadow:0 6px 28px rgba(0,212,255,.22);animation:toastIn .35s cubic-bezier(.34,1.56,.64,1);max-width:calc(100% - 32px)}
.toast-txt{font-size:13px;font-weight:700;color:var(--t1)}
@keyframes toastIn{from{opacity:0;transform:translateY(-20px) scale(.88)}to{opacity:1;transform:none}}
.xp-pop{position:fixed;right:20px;top:90px;background:linear-gradient(135deg,var(--purple),var(--cyan));color:#fff;font-size:14px;font-weight:900;padding:8px 16px;border-radius:99px;z-index:9998;pointer-events:none;animation:xpPop 2.1s ease forwards}
@keyframes xpPop{0%{opacity:0;transform:translateY(10px) scale(.8)}15%{opacity:1;transform:none}80%{opacity:1}100%{opacity:0;transform:translateY(-44px)}}
.celebrate-layer{position:fixed;inset:0;z-index:9997;overflow:hidden}
.conf{position:absolute;font-size:30px;animation:confFall 3s ease-in both}
.conf-0{left:6%;animation-delay:.0s}.conf-1{left:20%;animation-delay:.15s}.conf-2{left:37%;animation-delay:.05s}.conf-3{left:52%;animation-delay:.2s}
.conf-4{left:66%;animation-delay:.0s}.conf-5{left:79%;animation-delay:.1s}.conf-6{left:89%;animation-delay:.25s}.conf-7{left:46%;animation-delay:.3s}
@keyframes confFall{from{top:-60px;transform:rotate(0)}to{top:110vh;transform:rotate(720deg) scale(.4)}}

/* ── Util ── */
.fade-in{animation:fadeUp .35s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

/* ════════════════════════════════════════════════════════════
   TAMAGOTCHI CHARACTERS — CSS-only animated characters
═══════════════════════════════════════════════════════════ */

/* Base wrapper & body moods */
.tama-wrap{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;user-select:none}

/* Mood-based body animations */
.tama-happy  .tama-body{animation:tamaHappy 0.7s ease-in-out infinite}
.tama-normal .tama-body{animation:tamaNormal 2.5s ease-in-out infinite}
.tama-sad    .tama-body{animation:tamaSad 2s ease-in-out infinite}
.tama-critical .tama-body{animation:tamaCrit 0.4s ease-in-out infinite}
@keyframes tamaHappy{0%,100%{transform:translateY(0) rotate(-3deg) scale(1.04)}50%{transform:translateY(-10px) rotate(3deg) scale(1.08)}}
@keyframes tamaNormal{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-4px) scale(1.02)}}
@keyframes tamaSad{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(3px) rotate(1deg) scale(0.97)}}
@keyframes tamaCrit{0%,100%{transform:translateX(0) scale(0.95)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}

/* ── Base body shapes ── */
.tama-body{position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;flex-shrink:0}

/* Droplet */
.tama-droplet-body{
  width:72px;height:86px;
  background:linear-gradient(160deg,#60c8f0,#1e9fd4);
  border-radius:50% 50% 50% 50% / 40% 40% 60% 60%;
  border:2.5px solid rgba(255,255,255,0.35);
  box-shadow:0 0 20px rgba(0,180,255,0.4),inset 0 -8px 16px rgba(0,0,0,0.15),inset 4px 4px 12px rgba(255,255,255,0.25);
}
.tama-happy .tama-droplet-body{background:linear-gradient(160deg,#7de8ff,#00b8f5);box-shadow:0 0 30px rgba(0,212,255,0.6),inset 0 -8px 16px rgba(0,0,0,0.1)}
.tama-sad   .tama-droplet-body{background:linear-gradient(160deg,#93b8cc,#5a8aa0);box-shadow:0 0 12px rgba(0,100,180,0.3)}
.tama-critical .tama-droplet-body{background:linear-gradient(160deg,#b0c8d4,#7090a0);box-shadow:none;filter:saturate(0.3) brightness(0.8)}

/* Dino */
.tama-dino-body{
  width:70px;height:80px;
  background:linear-gradient(160deg,#6ee76e,#22a022);
  border-radius:40% 40% 44% 44% / 35% 35% 55% 55%;
  border:2.5px solid rgba(255,255,255,0.3);
  box-shadow:0 0 18px rgba(50,200,50,0.4),inset 0 -6px 14px rgba(0,0,0,0.2);
}
.tama-happy  .tama-dino-body{background:linear-gradient(160deg,#7fff7f,#2ec02e);box-shadow:0 0 28px rgba(80,240,80,0.5)}
.tama-sad    .tama-dino-body{background:linear-gradient(160deg,#8aaa8a,#4a7a4a);box-shadow:none}
.tama-critical .tama-dino-body{background:linear-gradient(160deg,#8a9a8a,#506050);filter:saturate(0.2) brightness(0.75)}
.dino-spikes{position:absolute;top:-10px;left:50%;transform:translateX(-50%);display:flex;gap:5px}
.dino-spike{width:8px;height:14px;background:linear-gradient(180deg,#4ade80,#16a34a);clip-path:polygon(50% 0%,100% 100%,0% 100%);border-radius:2px}
.tama-happy .dino-spike{background:linear-gradient(180deg,#86efac,#22c55e);animation:spikeWiggle 0.6s ease-in-out infinite alternate}
@keyframes spikeWiggle{from{transform:scaleY(1)}to{transform:scaleY(1.3)}}
.dino-tail{position:absolute;bottom:0;right:-18px;width:22px;height:16px;background:linear-gradient(135deg,#22a022,#16a34a);border-radius:50% 80% 80% 20%;transform:rotate(-20deg);transform-origin:left center}
.tama-happy .dino-tail{animation:tailWag 0.5s ease-in-out infinite alternate}
@keyframes tailWag{from{transform:rotate(-20deg)}to{transform:rotate(10deg)}}

/* Whale */
.tama-whale-body{
  width:95px;height:68px;
  background:linear-gradient(160deg,#6ca8ff,#2460d8);
  border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;
  border:2.5px solid rgba(255,255,255,0.3);
  box-shadow:0 0 18px rgba(60,120,255,0.4),inset 0 -6px 14px rgba(0,0,0,0.2);
}
.tama-happy .tama-whale-body{background:linear-gradient(160deg,#93c5fd,#3b82f6);box-shadow:0 0 28px rgba(100,160,255,0.5)}
.tama-sad   .tama-whale-body{background:linear-gradient(160deg,#9ab0d0,#4a6090)}
.tama-critical .tama-whale-body{background:linear-gradient(160deg,#a0b0c8,#5060a0);filter:saturate(0.2) brightness(0.75)}
.whale-tail{position:absolute;bottom:4px;right:-20px;width:28px;height:22px;background:linear-gradient(135deg,#2460d8,#1e50c0);border-radius:0 40% 40% 0;clip-path:polygon(0 50%,60% 0%,100% 20%,100% 80%,60% 100%)}
.tama-happy .whale-tail{animation:whaleTail 0.6s ease-in-out infinite alternate}
@keyframes whaleTail{from{transform:rotate(-15deg)}to{transform:rotate(15deg)}}
.whale-spout{position:absolute;top:-24px;left:28%;font-size:14px;animation:spoutUp 1.2s ease-in-out infinite}
@keyframes spoutUp{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(-10px);opacity:0.6}}
.whale-eye{width:11px!important;height:11px!important}

/* Plant */
.tama-plant-body{
  width:64px;height:72px;
  background:linear-gradient(160deg,#a3e07a,#5a9a2a);
  border-radius:38% 38% 45% 45% / 30% 30% 60% 60%;
  border:2.5px solid rgba(255,255,255,0.25);
  box-shadow:0 0 16px rgba(90,180,50,0.35);
}
.tama-happy .tama-plant-body{background:linear-gradient(160deg,#bbf7d0,#22c55e);box-shadow:0 0 24px rgba(100,220,80,0.45)}
.tama-sad   .tama-plant-body{background:linear-gradient(160deg,#b5c9a0,#607a40)}
.tama-critical .tama-plant-body{background:linear-gradient(160deg,#c8b89a,#7a6040);filter:saturate(0.2) brightness(0.75)}
.plant-pot{width:52px;height:22px;background:linear-gradient(180deg,#c2855a,#9a5a30);border-radius:4px 4px 8px 8px;border:2px solid rgba(255,255,255,0.15);margin-top:-2px;position:relative;z-index:2}
.plant-leaves{position:absolute;top:-18px;left:50%;transform:translateX(-50%);display:flex;gap:0;z-index:3}
.plant-leaf{width:22px;height:28px;background:linear-gradient(135deg,#4ade80,#15803d);border-radius:50% 50% 50% 0;position:absolute}
.leaf-0{left:-22px;top:-8px;transform:rotate(-40deg)}.leaf-1{left:8px;top:-14px;transform:rotate(10deg)}.leaf-2{left:-8px;top:-20px;transform:rotate(-15deg)}.leaf-3{left:18px;top:-6px;transform:rotate(35deg)}
.leaf-happy{animation:leafWave 1.2s ease-in-out infinite alternate}
@keyframes leafWave{from{transform:rotate(-40deg) scale(1)}to{transform:rotate(-30deg) scale(1.1)}}
.plant-flower{position:absolute;top:-36px;left:50%;transform:translateX(-50%);font-size:18px;animation:flowerBob 1s ease-in-out infinite alternate}
@keyframes flowerBob{from{transform:translateX(-50%) rotate(-5deg)}to{transform:translateX(-50%) rotate(5deg)}}

/* Robot */
.tama-robot-body{
  width:68px;height:78px;
  background:linear-gradient(160deg,#94a3b8,#475569);
  border-radius:14px;
  border:2.5px solid rgba(255,255,255,0.3);
  box-shadow:0 0 16px rgba(100,150,200,0.3),inset 0 -4px 10px rgba(0,0,0,0.3);
}
.tama-happy .tama-robot-body{background:linear-gradient(160deg,#a5f3fc,#0891b2);box-shadow:0 0 28px rgba(0,180,220,0.5)}
.tama-sad   .tama-robot-body{background:linear-gradient(160deg,#7a8898,#364050)}
.tama-critical .tama-robot-body{background:linear-gradient(160deg,#6a7888,#283040);filter:brightness(0.7)}
.robot-antenna{position:absolute;top:-18px;left:50%;transform:translateX(-50%);width:4px;height:16px;background:#64748b;border-radius:2px}
.robot-light{width:8px;height:8px;border-radius:50%;position:absolute;top:-9px;left:-2px}
.light-on{background:#00d4ff;box-shadow:0 0 8px #00d4ff;animation:lightBlink 0.5s ease-in-out infinite}
.light-red{background:#f87171;box-shadow:0 0 8px #f87171;animation:lightBlink 0.2s ease-in-out infinite}
.light-dim{background:#475569}
@keyframes lightBlink{0%,100%{opacity:1}50%{opacity:0.3}}
.robot-screen{position:relative;z-index:2;padding-top:8px;display:flex;flex-direction:column;align-items:center;gap:3px;width:100%}
.robot-eyes{display:flex;gap:14px;justify-content:center}
.robot-eye{font-size:14px;font-weight:900;line-height:1;transition:all 0.3s}
.eye-happy{color:#00d4ff;text-shadow:0 0 8px #00d4ff;animation:eyeGlow 0.8s ease-in-out infinite alternate}
.eye-crit{color:#f87171;animation:eyeShake 0.3s ease-in-out infinite}
@keyframes eyeGlow{from{text-shadow:0 0 4px #00d4ff}to{text-shadow:0 0 14px #00d4ff}}
@keyframes eyeShake{0%,100%{transform:translateX(0)}50%{transform:translateX(2px)}}
.robot-mouth{font-size:8px;letter-spacing:1px;font-family:monospace;font-weight:900;color:rgba(255,255,255,0.7)}
.rm-happy{color:#00d4ff;animation:mouthPulse 0.6s ease-in-out infinite alternate}
.rm-critical{color:#f87171}
@keyframes mouthPulse{from{letter-spacing:0px}to{letter-spacing:2px}}
.robot-bar-wrap{width:44px;height:5px;background:rgba(0,0,0,0.3);border-radius:3px;margin-top:3px;overflow:hidden}
.robot-bar-fill{height:100%;background:var(--cyan);border-radius:3px;transition:width 1s ease}
.robot-arm{width:10px!important;height:30px!important;border-radius:5px!important;background:linear-gradient(180deg,#64748b,#475569)!important}
.robot-arm.tama-arm-happy{animation:robotArmWave 0.5s ease-in-out infinite alternate!important}
@keyframes robotArmWave{from{transform:rotate(-20deg)}to{transform:rotate(20deg)}}
.robot-sparks span{font-size:16px!important}
.robot-legs{display:flex;gap:14px;margin-top:2px;position:relative;z-index:2}
.robot-leg{width:12px;height:16px;background:linear-gradient(180deg,#475569,#334155);border-radius:4px 4px 6px 6px;border:1.5px solid rgba(255,255,255,0.2)}

/* ── Eyes ── */
.tama-eyes{display:flex;gap:12px;justify-content:center;padding-top:14%;position:relative;z-index:2}
.tama-eye{width:10px;height:10px;background:#1a1a2e;border-radius:50%;position:relative;border:1.5px solid rgba(255,255,255,0.5)}
.tama-eye.happy{height:7px;border-radius:50% 50% 0 0;background:#1a1a2e}
.tama-shine{position:absolute;top:1px;right:1px;width:3px;height:3px;background:#fff;border-radius:50%}
.tama-x{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:10px;font-weight:900;color:#f87171;line-height:1}
.dino-eye{width:11px;height:11px}
.whale-eye{width:11px;height:11px}

/* ── Mouth ── */
.tama-mouth{position:relative;z-index:2;margin-top:5px}
.tama-m-happy{width:18px;height:9px;border:2.5px solid rgba(255,255,255,0.8);border-top:none;border-radius:0 0 18px 18px;background:rgba(255,80,80,0.6)}
.tama-m-normal{width:12px;height:0;border-bottom:2.5px solid rgba(255,255,255,0.7);border-radius:2px}
.tama-m-sad{width:16px;height:8px;border:2.5px solid rgba(255,255,255,0.6);border-bottom:none;border-radius:8px 8px 0 0;margin-top:8px}
.tama-m-critical{width:10px;height:0;border-bottom:2.5px solid rgba(248,113,113,0.8);border-radius:2px;margin-top:8px}
.dino-mouth{margin-top:3px}

/* ── Cheeks ── */
.tama-cheek{position:absolute;bottom:22%;width:10px;height:7px;background:rgba(255,120,150,0.55);border-radius:50%;z-index:3}
.tama-cheek.left{left:8%}.tama-cheek.right{right:8%}

/* ── Tears ── */
.tama-tear{position:absolute;bottom:10%;width:5px;height:8px;background:rgba(100,180,255,0.8);border-radius:50% 50% 80% 80%;z-index:3;animation:tearDrop 1.5s ease-in infinite}
.tama-tear.left{left:18%}.tama-tear.right{right:18%}
@keyframes tearDrop{0%{transform:translateY(0);opacity:1}100%{transform:translateY(14px);opacity:0}}

/* ── Sweat ── */
.tama-sweat{position:absolute;top:10%;right:2%;width:7px;height:10px;background:rgba(100,200,255,0.7);border-radius:50% 50% 80% 80%;animation:sweatDrop 1s ease-in infinite;z-index:3}
@keyframes sweatDrop{0%{transform:translateY(0);opacity:1}100%{transform:translateY(16px);opacity:0}}

/* ── Arms ── */
.tama-arm{position:absolute;bottom:28%;width:9px;height:22px;background:inherit;border-radius:5px;z-index:1;transition:transform 0.3s}
.tama-arm.left{left:-7px;transform-origin:top center}.tama-arm.right{right:-7px;transform-origin:top center}
.tama-arm-happy.left{animation:armWaveL 0.5s ease-in-out infinite alternate}
.tama-arm-happy.right{animation:armWaveR 0.5s ease-in-out infinite alternate}
.tama-arm-sad.left{transform:rotate(30deg)}.tama-arm-sad.right{transform:rotate(-30deg)}
.tama-arm-critical.left{transform:rotate(60deg) translateY(4px)}.tama-arm-critical.right{transform:rotate(-60deg) translateY(4px)}
@keyframes armWaveL{from{transform:rotate(-35deg)}to{transform:rotate(5deg)}}
@keyframes armWaveR{from{transform:rotate(35deg)}to{transform:rotate(-5deg)}}

/* ── Water fill inside body ── */
.tama-water-fill{
  position:absolute;bottom:0;left:0;right:0;
  background:linear-gradient(0deg,rgba(0,180,255,0.45),rgba(0,212,255,0.2));
  border-radius:0 0 40px 40px;
  transition:height 1.5s cubic-bezier(0.4,0,0.2,1);
  z-index:1;
}
.dino-fill{background:linear-gradient(0deg,rgba(50,220,50,0.4),rgba(80,255,80,0.15))}
.whale-fill{background:linear-gradient(0deg,rgba(50,100,255,0.4),rgba(100,180,255,0.15))}
.plant-fill{border-radius:0 0 35px 35px}
.robot-fill{background:linear-gradient(0deg,rgba(0,212,255,0.3),rgba(0,150,200,0.1));border-radius:0 0 10px 10px}

/* ── Stars / sparkles ── */
.tama-stars,.tama-zzz{position:absolute;inset:0;pointer-events:none;z-index:10}
.tama-stars span,.tama-zzz span{position:absolute;font-size:14px;animation:starFloat 1.5s ease-in-out infinite}
.tama-stars span:nth-child(1){top:-14px;right:-14px;animation-delay:0s}
.tama-stars span:nth-child(2){top:0px;left:-18px;animation-delay:0.4s}
.tama-stars span:nth-child(3){bottom:-6px;right:-18px;animation-delay:0.8s}
.robot-sparks span:nth-child(1){top:-20px;right:-10px;font-size:14px}
.robot-sparks span:nth-child(2){top:5px;left:-20px}
.robot-sparks span:nth-child(3){bottom:-5px;right:-20px}
.tama-zzz span:nth-child(1){bottom:-10px;left:10%;animation-delay:0s}
.tama-zzz span:nth-child(2){bottom:-18px;left:40%;animation-delay:0.5s}
@keyframes starFloat{0%,100%{transform:scale(0.7) rotate(0deg);opacity:0.6}50%{transform:scale(1.2) rotate(180deg);opacity:1}}
`}</style>
}
