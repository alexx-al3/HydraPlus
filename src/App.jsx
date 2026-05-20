import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react'
import { CSS } from './styles.js'
import { TamaCharacter } from './characters.jsx'
import {
  AVATARS, ROUTINES, NOTIF_MSGS, MOTIVATIONAL, ACHIEVEMENTS,
  fmt, todayKey, xpInfo, ls, AVATAR_ICONS
} from './constants.js'

// ─── CONTEXT ──────────────────────────────────────────────────────────────────
const Ctx    = createContext({})
const useApp = () => useContext(Ctx)

function AppProvider({ children }) {
  const [dark,   setDark]   = useState(true)
  const [profile,_setProf]  = useState(() => ({
    name:'', avatar:'drop', routine:'normal', goal:2000,
    notifInterval:60, notifStart:7, notifEnd:22,
    vibrationEnabled:true, onboarded:false,
    ...(ls.get('profile')||{})
  }))
  const [today,  _setToday] = useState(() => {
    const s = ls.get('today')
    return s?.date === todayKey() ? s : { consumed:0, logs:[], date:todayKey() }
  })
  const [history,  setHistory] = useState(() => ls.get('history')||[])
  const [game,   _setGame]  = useState(() => ({
    xp:0, streak:0, achievements:[], lastDate:null, ...(ls.get('game')||{})
  }))
  const [toasts,    setToasts]    = useState([])
  const [xpPop,     setXpPop]     = useState(null)
  const [celebrate, setCelebrate] = useState(false)
  const [notifPerm, setNotifPerm] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  )
  const notifTimer = useRef(null)

  const setProf  = useCallback(p => { _setProf(p);  ls.set('profile', p) }, [])
  const setToday = useCallback(t => { _setToday(t); ls.set('today',   t) }, [])
  const setGame  = useCallback(g => { _setGame(g);  ls.set('game',    g) }, [])

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

  // SW registration
  useEffect(() => {
    if ('serviceWorker' in navigator)
      navigator.serviceWorker.register('/sw-notifications.js').catch(()=>{})
  }, [])

  const toast = useCallback(msg => {
    const id = Date.now() + Math.random()
    setToasts(q => [...q.slice(-2), { ...msg, id }])
    setTimeout(() => setToasts(q => q.filter(t => t.id !== id)), 3200)
  }, [])

  const fireNotif = useCallback(body => {
    toast({ emoji:'💧', text:body })
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
    const opts = {
      body, icon:'/icons/icon-192.png', badge:'/icons/icon-192.png',
      vibrate:[100,50,100,50,200], tag:'hydra', renotify:true,
      actions:[{ action:'drink', title:'💧 Bebi!' },{ action:'snooze', title:'⏰ 30min' }],
    }
    navigator.serviceWorker?.ready
      .then(sw => sw.showNotification('Hydra+ 💧', opts))
      .catch(()=> new Notification('Hydra+ 💧', opts))
  }, [toast])

  // Notification scheduler
  useEffect(() => {
    if (!profile.onboarded) return
    if (notifTimer.current) clearInterval(notifTimer.current)
    const ms = Math.max(1, profile.notifInterval) * 60 * 1000
    notifTimer.current = setInterval(() => {
      const h   = new Date().getHours()
      const pct = (ls.get('today')?.consumed || 0) / profile.goal
      if (h >= profile.notifStart && h <= profile.notifEnd && pct < 1)
        fireNotif(NOTIF_MSGS[Math.floor(Math.random() * NOTIF_MSGS.length)])
    }, ms)
    return () => clearInterval(notifTimer.current)
  }, [profile.onboarded, profile.notifInterval, profile.notifStart, profile.notifEnd, profile.goal, fireNotif])

  const requestNotifPerm = async () => {
    if (typeof Notification === 'undefined') return 'unsupported'
    const perm = await Notification.requestPermission()
    setNotifPerm(perm)
    if (perm === 'granted')
      setTimeout(() => fireNotif('✅ Notificações ativadas! Agora vou te encher o saco pra beber água. 💧'), 800)
    return perm
  }

  const addWater = useCallback(ml => {
    const prev   = today.consumed
    const newC   = prev + ml
    const pct    = newC / profile.goal
    const gained = Math.round(ml * 0.5)
    const hour   = new Date().getHours()
    const time   = new Date().toLocaleTimeString('pt-BR',{ hour:'2-digit', minute:'2-digit' })

    if (profile.vibrationEnabled && navigator.vibrate) navigator.vibrate(40)

    const newToday = { ...today, consumed:newC, logs:[...today.logs,{ml,time}] }
    setToday(newToday)

    let ach = [...game.achievements], streak = game.streak, xp = game.xp + gained
    const toastQ = []

    if (prev===0 && !ach.includes('first_sip'))
      { ach.push('first_sip'); xp+=50; toastQ.push({ emoji:'🌊', text:'Primeiro Gole! Era hora, camelo. +50 XP' }) }
    if (newC>=1000 && prev<1000 && !ach.includes('liter'))
      { ach.push('liter'); xp+=150; toastQ.push({ emoji:'🏆', text:'1 LITRO! Seu rim fez reverência. +150 XP' }) }
    if (hour<8 && !ach.includes('early'))
      { ach.push('early'); xp+=75; toastQ.push({ emoji:'🌅', text:`Água às ${hour}h? Você assustou. +75 XP` }) }
    if (hour>=22 && !ach.includes('night'))
      { ach.push('night'); xp+=75; toastQ.push({ emoji:'🌙', text:'Hidratação noturna! Bexiga vai te odiar. +75 XP' }) }
    if (newToday.logs.length>=5 && !ach.includes('consistent'))
      { ach.push('consistent'); xp+=100; toastQ.push({ emoji:'💪', text:'5 registros hoje! Virou peixe. +100 XP' }) }
    if (xpInfo(xp).level>=5 && !ach.includes('master'))
      { ach.push('master'); xp+=300; toastQ.push({ emoji:'🧙', text:'Nível 5! Mestre da Água. +300 XP' }) }

    if (pct >= 1 && prev < profile.goal) {
      setCelebrate(true); setTimeout(()=>setCelebrate(false), 3500)
      streak = game.streak + 1
      if (!ach.includes('day1')) { ach.push('day1'); xp+=100 }
      if (streak>=3  && !ach.includes('streak3'))  { ach.push('streak3');  xp+=200;  toastQ.push({ emoji:'🔥', text:'3 Dias On Fire! Rim comemorando!' }) }
      if (streak>=7  && !ach.includes('streak7'))  { ach.push('streak7');  xp+=500;  toastQ.push({ emoji:'💎', text:'7 dias! Você é basicamente um peixe.' }) }
      if (streak>=14 && !ach.includes('streak14')) { ach.push('streak14'); xp+=1000; toastQ.push({ emoji:'👑', text:'14 dias! Rim tem tatuagem sua.' }) }
      toastQ.push({ emoji:'🎉', text:'META BATIDA! Personagem em êxtase! 🏆' })
      if (navigator.vibrate) navigator.vibrate([100,50,100,50,200])
    } else {
      const msgs = [
        { emoji:'💧', text:`Uhh, ${fmt(ml)}! Seu rim fez dancinha.` },
        { emoji:'✨', text:`+${gained} XP! Tá hidratando ou me provocando?` },
        { emoji:'💪', text:`Só ${fmt(Math.max(0,profile.goal-newC))} pra meta. Vai lá.` },
        { emoji:'🫙', text:`Garrafinha aprovou. ${fmt(ml)} no estômago!` },
        { emoji:'🧠', text:'Neurônios agradeceram coletivamente.' },
        { emoji:'😤', text:`Era hora! Faltam ${fmt(Math.max(0,profile.goal-newC))} ainda.` },
        { emoji:'🐟', text:`${fmt(ml)} engolidos! Peixe te respeita agora.` },
      ]
      toastQ.push(msgs[Math.floor(Math.random()*msgs.length)])
    }

    setXpPop(gained); setTimeout(()=>setXpPop(null), 2000)
    setGame({ xp, streak, achievements:ach, lastDate:todayKey() })
    toastQ.forEach((t,i) => setTimeout(()=>toast(t), i*350))
  }, [today, profile, game, toast, setToday, setGame])

  const pct  = Math.min(100, (today.consumed / profile.goal) * 100)
  const mood = pct>=100 ? 'happy' : pct>=60 ? 'normal' : pct>=30 ? 'sad' : 'critical'
  const motivational = MOTIVATIONAL[new Date().getDay() % MOTIVATIONAL.length]

  return (
    <Ctx.Provider value={{
      dark, setDark, profile, setProf,
      today, history, game, addWater,
      toasts, xpPop, celebrate,
      pct, mood, motivational,
      notifPerm, requestNotifPerm, fireNotif,
    }}>
      {children}
    </Ctx.Provider>
  )
}

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────
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
      <div className="xp-track"><div className="xp-fill" style={{width:`${progress*100}%`}}/></div>
    </div>
  )
}

function RingProgress() {
  const { pct, today, profile, mood } = useApp()
  const size=178, r=(size-22)/2, circ=2*Math.PI*r, offset=circ-(pct/100)*circ
  const sc = { happy:'#00d4ff', normal:'#38bdf8', sad:'#a78bfa', critical:'#f87171' }[mood]
  return (
    <div className="ring-wrap">
      <svg width={size} height={size} style={{position:'absolute',top:0,left:0}}>
        <defs>
          <linearGradient id="rg"><stop offset="0%" stopColor="#00d4ff"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={pct>=100?'url(#rg)':sc} strokeWidth="12" strokeLinecap="round"
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

function NotifBanner() {
  const { notifPerm, requestNotifPerm } = useApp()
  const [dismissed, setDismissed] = useState(false)
  const [loading,   setLoading]   = useState(false)
  if (notifPerm==='granted' || notifPerm==='denied' || dismissed) return null
  const handle = async () => {
    setLoading(true)
    const p = await requestNotifPerm()
    setLoading(false)
    if (p !== 'granted') setDismissed(true)
  }
  return (
    <div className="notif-banner">
      <span>🔔</span>
      <span className="nb-txt">Ative as notificações para lembretes!</span>
      <button className="nb-btn" onClick={handle} disabled={loading}>{loading?'...':'Ativar'}</button>
      <button className="nb-close" onClick={()=>setDismissed(true)}>✕</button>
    </div>
  )
}

function NotifPreview() {
  const [idx,      setIdx]    = useState(()=>Math.floor(Math.random()*NOTIF_MSGS.length))
  const [animKey,  setAnimKey]= useState(0)
  useEffect(()=>{
    const t = setInterval(()=>{
      setIdx(Math.floor(Math.random()*NOTIF_MSGS.length))
      setAnimKey(k=>k+1)
    }, 3500)
    return ()=>clearInterval(t)
  },[])
  return (
    <div style={{marginTop:14}}>
      <div className="card-title" style={{marginBottom:8}}>🔔 Preview:</div>
      <div key={animKey} className="notif-prev-bubble fade-in">
        <div className="npb-header"><span>💧</span><span className="npb-app">Hydra+</span><span className="npb-time">agora</span></div>
        <div className="npb-body">{NOTIF_MSGS[idx]}</div>
        <div className="npb-actions">
          <span className="npb-action">💧 Bebi!</span>
          <span className="npb-action">⏰ Depois</span>
        </div>
      </div>
    </div>
  )
}

// ─── SCREENS ─────────────────────────────────────────────────────────────────
function Onboarding() {
  const { profile, setProf, requestNotifPerm } = useApp()
  const [step,    setStep]   = useState(0)
  const [name,    setName]   = useState('')
  const [avatar,  setAvatar] = useState('drop')
  const [routine, setRoutine]= useState('normal')
  const sel = ROUTINES.find(r=>r.id===routine)
  const finish = async () => {
    await requestNotifPerm()
    setProf({ ...profile, name, avatar, routine, goal:sel.goal, onboarded:true })
  }
  const next = () => step < 3 ? setStep(s=>s+1) : finish()
  return (
    <div className="ob-shell">
      <div className="ob-dots">
        {[0,1,2,3].map(i=><div key={i} className={`ob-dot${i<=step?' on':''}${i===step?' cur':''}`}/>)}
      </div>
      <div className="ob-body">
        {step===0 && (
          <div className="ob-step fade-in">
            <div style={{display:'flex',justifyContent:'center',marginBottom:16}}>
              <TamaCharacter avatarId="drop" mood="happy" size={110}/>
            </div>
            <h1 className="ob-title">Olá! Eu sou o<br/><span className="cyan">Hydra+</span>!</h1>
            <p className="ob-sub">Seu companheiro de hidratação gamificado.</p>
            <div className="ob-features">
              {['🐣 8 personagens Tamagotchi animados','🔔 Notificações sarcásticas','📊 Estatísticas e conquistas','🏆 XP, níveis e streaks'].map((f,i)=>(
                <div key={i} className="ob-feat">{f}</div>
              ))}
            </div>
          </div>
        )}
        {step===1 && (
          <div className="ob-step fade-in">
            <h2 className="ob-title">Qual é o<br/>seu nome?</h2>
            <p className="ob-sub">Para eu poder te chamar direitinho 😊</p>
            <input className="ob-input" placeholder="Seu nome..." value={name}
              onChange={e=>setName(e.target.value)} autoFocus/>
          </div>
        )}
        {step===2 && (
          <div className="ob-step fade-in">
            <h2 className="ob-title">Escolha<br/>seu personagem</h2>
            <p className="ob-sub">Quem vai te acompanhar nessa jornada?</p>
            <div className="ob-avatar-grid">
              {AVATARS.map(a=>(
                <button key={a.id} className={`ob-av-btn${avatar===a.id?' sel':''}`} onClick={()=>setAvatar(a.id)}>
                  <div className="ob-av-preview">
                    <TamaCharacter avatarId={a.id} mood={avatar===a.id?'happy':'normal'} size={68}/>
                  </div>
                  <span className="ob-av-label">{a.label}</span>
                  <span className="ob-av-desc">{a.desc}</span>
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
                  <div className="ob-rt-info">
                    <span className="ob-rt-name">{r.label}</span>
                    <span className="ob-rt-desc">{r.desc}</span>
                  </div>
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

function HomeScreen() {
  const { profile, today, game, addWater, pct, mood, motivational, dark, setDark } = useApp()
  const [customAmt,  setCustomAmt] = useState('')
  const [showCustom, setShowCustom]= useState(false)
  const { level } = xpInfo(game.xp)
  const remaining = Math.max(0, profile.goal - today.consumed)
  const moodInfo = {
    happy:   { text:'Você está incrível hoje!', color:'#34d399' },
    normal:  { text:'Continue bebendo água!',   color:'#00d4ff' },
    sad:     { text:'Beba mais água agora!',     color:'#a78bfa' },
    critical:{ text:'ALERTA! Hidrate-se já!',   color:'#f87171' },
  }[mood]
  const doCustom = () => {
    const ml = parseInt(customAmt)
    if (ml>0 && ml<=3000) { addWater(ml); setCustomAmt(''); setShowCustom(false) }
  }
  return (
    <div className="screen home-screen">
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
      <div className="motiv-card glass-card">💬 {motivational}</div>
      <div className="dashboard">
        <div className="dash-tama">
          <TamaCharacter avatarId={profile.avatar} mood={mood} size={115}/>
          <div className="mood-lbl" style={{color:moodInfo.color}}>{moodInfo.text}</div>
        </div>
        <div className="dash-ring"><RingProgress/></div>
      </div>
      <div className="remain-row">
        {pct<100
          ? <><span className="remain-lbl">Faltam </span><span className="remain-amt">{fmt(remaining)}</span><span className="remain-lbl"> para a meta</span></>
          : <span className="goal-done">🎉 Meta do dia atingida! Incrível!</span>
        }
      </div>
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

function StatsScreen() {
  const { today, history, profile, game } = useApp()
  const { level } = xpInfo(game.xp)
  const week = [...history.slice(-6), {date:todayKey(),consumed:today.consumed,goal:profile.goal}]
  const totalWeek = week.reduce((s,d)=>s+d.consumed,0)
  const avg       = Math.round(totalWeek/week.length)
  const best      = Math.max(...week.map(d=>d.consumed))
  const achieved  = week.filter(d=>d.consumed>=d.goal).length
  const days      = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
  return (
    <div className="screen">
      <div className="scr-hdr"><h2 className="scr-title">Estatísticas 📊</h2><p className="scr-sub">Sua evolução de hidratação</p></div>
      <div className="stats-grid">
        {[
          {icon:'🔥',val:game.streak,  lbl:'Dias seguidos',  cls:'cyan'  },
          {icon:'⭐',val:game.xp,      lbl:'XP Total',       cls:'purple'},
          {icon:'🏆',val:level,        lbl:'Nível atual',    cls:'blue'  },
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
            const p=Math.min(100,(d.consumed/d.goal)*100), isT=d.date===todayKey()
            const dObj=new Date(d.date+'T12:00:00')
            return (
              <div key={i} className="bar-col">
                <div className="bar-amt">{fmt(d.consumed)}</div>
                <div className="bar-track"><div className={`bar-fill${p>=100?' complete':''}${isT?' today':''}`} style={{height:`${Math.max(4,p)}%`}}/></div>
                <div className={`bar-day${isT?' today-lbl':''}`}>{days[dObj.getDay()]}</div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="glass-card">
        <div className="card-title">Resumo Semanal</div>
        {[['💧 Total',fmt(totalWeek)],['📈 Média diária',fmt(avg)],['🏆 Melhor dia',fmt(best)],['🎯 Meta diária',fmt(profile.goal)],['🔥 Streak',`${game.streak} dias`]].map(([k,v],i)=>(
          <div key={i} className="sum-row"><span>{k}</span><strong>{v}</strong></div>
        ))}
      </div>
      <div className="glass-card">
        <div className="card-title">Progresso vs Meta</div>
        {week.map((d,i)=>{
          const p=Math.min(100,(d.consumed/d.goal)*100), dObj=new Date(d.date+'T12:00:00')
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

function AchievementsScreen() {
  const { game } = useApp()
  const { level, title } = xpInfo(game.xp)
  return (
    <div className="screen">
      <div className="scr-hdr"><h2 className="scr-title">Conquistas 🏆</h2><p className="scr-sub">Sua coleção de medalhas</p></div>
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
          const unlocked = game.achievements.includes(a.id)
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

function SettingsScreen() {
  const { profile, setProf, dark, setDark, game, notifPerm, requestNotifPerm, fireNotif } = useApp()
  const profileRef = useRef(profile)
  const [local, setLocal] = useState(profile)

  // FIX: sync local with profile to prevent stale closure bug on routine change
  useEffect(() => {
    profileRef.current = profile
    setLocal({ ...profile })
  }, [profile])

  const upd = useCallback((k, v) => {
    const np = { ...profileRef.current, [k]: v }
    profileRef.current = np
    setLocal({ ...np })
    setProf(np)
  }, [setProf])

  const testNotif = () => fireNotif(NOTIF_MSGS[Math.floor(Math.random()*NOTIF_MSGS.length)])

  return (
    <div className="screen">
      <div className="scr-hdr"><h2 className="scr-title">Configurações ⚙️</h2><p className="scr-sub">Personalize sua experiência</p></div>

      <div className="glass-card">
        <div className="card-title">Meu Personagem</div>
        <div style={{display:'flex',justifyContent:'center',marginBottom:12,minHeight:100}}>
          <TamaCharacter avatarId={local.avatar} mood="happy" size={90}/>
        </div>
        <div className="cfg-av-grid">
          {AVATARS.map(a=>(
            <button key={a.id} className={`cfg-av-btn${local.avatar===a.id?' sel':''}`} onClick={()=>upd('avatar',a.id)}>
              <div style={{fontSize:22}}>{AVATAR_ICONS[a.id]}</div>
              <span className="ob-av-label">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card">
        <div className="card-title">Rotina & Meta</div>
        <div className="cfg-routines">
          {ROUTINES.map(r=>(
            <button key={r.id} className={`ob-routine sm${local.routine===r.id?' sel':''}`}
              onClick={()=>{ upd('routine', r.id); upd('goal', r.goal) }}>
              <span style={{fontSize:20}}>{r.icon}</span>
              <div className="ob-rt-info">
                <span className="ob-rt-name">{r.label}</span>
                <span className="ob-rt-desc">{r.desc}</span>
              </div>
              <span className={`ob-rt-goal${local.routine===r.id?' cyan':''}`}>{fmt(r.goal)}/dia</span>
              {local.routine===r.id && <span className="cyan">✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card">
        <div className="card-title">Notificações</div>
        <div className={`notif-status ns-${notifPerm}`}>
          {notifPerm==='granted' && '✅ Ativadas! Você vai ser incomodado com amor.'}
          {notifPerm==='denied'  && '❌ Bloqueadas. Vá em Configurações do browser → Notificações → Permitir.'}
          {notifPerm==='default' && '⚠️ Notificações não ativadas ainda.'}
        </div>
        {notifPerm==='granted' && (
          <button className="btn-outline" onClick={testNotif} style={{marginTop:10}}>🧪 Testar notificação agora</button>
        )}
        {notifPerm!=='granted' && notifPerm!=='denied' && (
          <button className="btn-outline" onClick={requestNotifPerm} style={{marginTop:10}}>🔔 Ativar notificações</button>
        )}
        <div className="notif-how">
          <div className="card-title" style={{marginTop:12,marginBottom:8}}>📱 Instalar no celular:</div>
          <div className="how-step"><span>🤖</span><span><b>Android:</b> Chrome → menu ⋮ → "Adicionar à tela inicial"</span></div>
          <div className="how-step"><span>🍎</span><span><b>iPhone:</b> Safari → compartilhar □↑ → "Adicionar à Tela de Início"</span></div>
          <div className="how-step"><span>⚠️</span><span><b>iPhone:</b> Notificações requerem iOS 16.4+ e app instalado</span></div>
        </div>
        {[
          { lbl:'Intervalo', key:'notifInterval', min:1,  max:120, step:1, suffix:'min' },
          { lbl:'Início',    key:'notifStart',    min:5,  max:12,  step:1, suffix:'h'   },
          { lbl:'Fim',       key:'notifEnd',      min:18, max:23,  step:1, suffix:'h'   },
        ].map(s=>(
          <div key={s.key} className="cfg-slider">
            <span className="cfg-sl-lbl">{s.lbl}</span>
            <input type="range" min={s.min} max={s.max} step={s.step}
              value={local[s.key]} onChange={e=>upd(s.key, +e.target.value)} className="slider"/>
            <span className="cfg-sl-val">{local[s.key]}{s.suffix}</span>
          </div>
        ))}
        <NotifPreview/>
      </div>

      <div className="glass-card">
        <div className="card-title">Preferências</div>
        <div className="toggle-row">
          <span>📳 Vibração</span>
          <button className={`toggle${local.vibrationEnabled?' on':' off'}`}
            onClick={()=>upd('vibrationEnabled', !local.vibrationEnabled)}>
            <div className="toggle-thumb"/>
          </button>
        </div>
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
        <button className="btn-danger" onClick={()=>{
          if (confirm('Resetar todos os dados? Esta ação não pode ser desfeita.')) {
            localStorage.clear(); window.location.reload()
          }
        }}>🗑️ Resetar todos os dados</button>
      </div>
      <div style={{height:24}}/>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
function MainApp() {
  const { dark } = useApp()
  const [tab, setTab] = useState('home')
  const tabs = [
    { id:'home',         icon:'💧', label:'Início'    },
    { id:'stats',        icon:'📊', label:'Stats'     },
    { id:'achievements', icon:'🏆', label:'Conquistas'},
    { id:'settings',     icon:'⚙️', label:'Config'    },
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

function Splash({ onDone }) {
  useEffect(()=>{ setTimeout(onDone, 2600) },[])
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

function AppInner() {
  const { profile } = useApp()
  const [splashDone, setSplashDone] = useState(false)
  if (!splashDone) return <Splash onDone={()=>setSplashDone(true)}/>
  if (!profile.onboarded) return <Onboarding/>
  return <MainApp/>
}

export default function App() {
  return (
    <>
      <style>{CSS}</style>
      <AppProvider><AppInner/></AppProvider>
    </>
  )
}
