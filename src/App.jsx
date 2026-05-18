import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const AVATARS = [
  { id: 'drop',   label: 'Gotinha',    emoji: '💧' },
  { id: 'bottle', label: 'Garrafinha', emoji: '🫙' },
  { id: 'plant',  label: 'Plantinha',  emoji: '🌱' },
  { id: 'whale',  label: 'Baleinha',   emoji: '🐳' },
  { id: 'dino',   label: 'Dino',       emoji: '🦕' },
]

const ROUTINES = [
  { id: 'light',   label: 'Leve',     goal: 1800, icon: '🌙', desc: 'Atividade baixa' },
  { id: 'normal',  label: 'Normal',   goal: 2000, icon: '☀️', desc: 'Rotina comum' },
  { id: 'work',    label: 'Trabalho', goal: 2200, icon: '💼', desc: 'Escritório / Home Office' },
  { id: 'intense', label: 'Intensa',  goal: 2500, icon: '🔥', desc: 'Alta atividade física' },
  { id: 'gym',     label: 'Academia', goal: 3000, icon: '💪', desc: 'Treinos pesados' },
]

const NOTIF_MSGS = [
  { text: 'Ei humano seco, bora beber água?', emoji: '🌊' },
  { text: 'Seu corpo tá mandando SOS!', emoji: '💧' },
  { text: 'Água agora ou pele de maracujá depois.', emoji: '😅' },
  { text: 'Seu cérebro quer hidratação premium!', emoji: '🧠' },
  { text: 'A garrafinha está triste sem você...', emoji: '😢' },
  { text: '+200ml e você desbloqueia felicidade!', emoji: '✨' },
  { text: 'Seu rim mandou um coraçãozinho!', emoji: '❤️' },
  { text: 'Planta seca não cresce. Hidrata!', emoji: '🌿' },
  { text: '3, 2, 1... Beba água AGORA!', emoji: '⏰' },
  { text: 'Você é 60% água. Mantenha o nível!', emoji: '💦' },
  { text: 'Cada gole = +XP de felicidade!', emoji: '🎮' },
  { text: 'Seu coração pede hidratação. Atende?', emoji: '💙' },
]

const ACHIEVEMENTS = [
  { id: 'first_sip',  label: 'Primeiro Gole',        desc: 'Registrou pela primeira vez',  icon: '🌊', xp: 50   },
  { id: 'day1',       label: 'Dia Hidratado',         desc: 'Meta diária atingida',         icon: '⭐', xp: 100  },
  { id: 'liter',      label: 'Litro Zero',            desc: '1000ml em um dia',             icon: '🏆', xp: 150  },
  { id: 'streak3',    label: '3 Dias On Fire',        desc: '3 dias consecutivos',          icon: '🔥', xp: 200  },
  { id: 'early',      label: 'Madrugador',            desc: 'Bebeu água antes das 8h',      icon: '🌅', xp: 75   },
  { id: 'night',      label: 'Noturno',               desc: 'Bebeu água após as 22h',       icon: '🌙', xp: 75   },
  { id: 'consistent', label: 'Consistente',           desc: '5 registros em um dia',        icon: '💪', xp: 100  },
  { id: 'streak7',    label: 'Uma Semana!',           desc: '7 dias consecutivos',          icon: '💎', xp: 500  },
  { id: 'master',     label: 'Mestre da Água',        desc: 'Nível 5 atingido',             icon: '🧙', xp: 300  },
  { id: 'streak14',   label: 'Quinzena Campeã',       desc: '14 dias consecutivos',         icon: '👑', xp: 1000 },
  { id: 'champion',   label: 'Campeão da Hidratação', desc: 'Meta por 10 dias seguidos',    icon: '🥇', xp: 1000 },
  { id: 'speed',      label: 'Velocidade da Luz',     desc: '500ml na primeira hora do dia',icon: '⚡', xp: 150  },
]

const MOTIVATIONAL = [
  'Seu futuro eu agradece cada gole! 💧',
  'Água é o melhor suplemento do mundo.',
  'Hidratado é o novo produtivo!',
  'Seu corpo é um templo. Regue-o! 🌿',
  'Cada gole é um passo pra melhor versão de você.',
  'Beber água é o maior ato de amor-próprio.',
  'Consistência cria campeões. Beba água!',
  'Água limpa a mente e purifica o corpo.',
  'Você merece estar no seu melhor estado!',
  'Pequenos hábitos, grandes transformações.',
]

const LEVEL_TITLES = [
  'Iniciante Seco', 'Aprendiz da Gota', 'Hidratante',
  'Caminhante Aquoso', 'Guerreiro da Água', 'Mestre da Hidratação',
  'Lenda Aquática', 'Deus das Águas', 'Ser de Luz Líquida',
]

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const fmt = ml => ml >= 1000 ? `${(ml / 1000).toFixed(1)}L` : `${ml}ml`
const todayKey = () => new Date().toISOString().split('T')[0]
const xpLevel = xp => {
  const level = Math.floor(xp / 200) + 1
  const prev = (level - 1) * 200
  const next = level * 200
  return { level, progress: (xp - prev) / (next - prev), next, title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)] }
}

const storage = {
  get: k => { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} },
}

const DEFAULT_PROFILE = {
  name: '', avatar: 'drop', routine: 'normal', goal: 2000,
  notifInterval: 60, notifStart: 7, notifEnd: 22,
  soundEnabled: true, vibrationEnabled: true, onboarded: false,
}
const DEFAULT_GAME = { xp: 0, streak: 0, achievements: [], lastDate: null }
const DEFAULT_TODAY = () => ({ consumed: 0, logs: [], date: todayKey() })

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────
const Ctx = createContext({})
const useApp = () => useContext(Ctx)

function AppProvider({ children }) {
  const [dark, setDark] = useState(true)
  const [profile, setProfile] = useState(() => ({ ...DEFAULT_PROFILE, ...(storage.get('profile') || {}) }))
  const [today, setToday] = useState(() => {
    const saved = storage.get('today')
    return saved?.date === todayKey() ? saved : DEFAULT_TODAY()
  })
  const [history, setHistory] = useState(() => storage.get('history') || [])
  const [game, setGame] = useState(() => ({ ...DEFAULT_GAME, ...(storage.get('game') || {}) }))
  const [toasts, setToasts] = useState([])
  const [xpPop, setXpPop] = useState(null)
  const [celebrate, setCelebrate] = useState(false)
  const notifRef = useRef(null)

  // Persist
  useEffect(() => { storage.set('profile', profile) }, [profile])
  useEffect(() => { storage.set('today', today) }, [today])
  useEffect(() => { storage.set('history', history) }, [history])
  useEffect(() => { storage.set('game', game) }, [game])

  // Day rollover
  useEffect(() => {
    const saved = storage.get('today')
    if (saved && saved.date !== todayKey()) {
      if (saved.consumed > 0) {
        const newHist = [...history, { date: saved.date, consumed: saved.consumed, goal: profile.goal }].slice(-60)
        setHistory(newHist)
      }
      setToday(DEFAULT_TODAY())
    }
  }, [])

  // Notification loop (in-app banner)
  useEffect(() => {
    if (!profile.onboarded) return
    if (notifRef.current) clearInterval(notifRef.current)
    notifRef.current = setInterval(() => {
      const h = new Date().getHours()
      const pct = today.consumed / profile.goal
      if (h >= profile.notifStart && h <= profile.notifEnd && pct < 1) {
        const msg = NOTIF_MSGS[Math.floor(Math.random() * NOTIF_MSGS.length)]
        toast(msg)
        // Browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Hydra+ 💧', { body: msg.text, icon: '/icons/icon-192.png' })
        }
      }
    }, profile.notifInterval * 60 * 1000)
    return () => clearInterval(notifRef.current)
  }, [profile, today.consumed])

  const toast = useCallback((msg) => {
    const id = Date.now() + Math.random()
    setToasts(q => [...q.slice(-2), { ...msg, id }])
    setTimeout(() => setToasts(q => q.filter(t => t.id !== id)), 3200)
  }, [])

  const saveProfile = useCallback(p => setProfile(p), [])

  const addWater = useCallback((ml) => {
    const prev = today.consumed
    const newConsumed = prev + ml
    const pct = newConsumed / profile.goal
    const gained = Math.round(ml * 0.5)
    const hour = new Date().getHours()
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

    // Vibration
    if (profile.vibrationEnabled && navigator.vibrate) navigator.vibrate(40)

    const newToday = { ...today, consumed: newConsumed, logs: [...today.logs, { ml, time }] }
    setToday(newToday)

    // Achievements & XP
    let newAch = [...game.achievements]
    let newStreak = game.streak
    let newXP = game.xp + gained
    const toastQueue = []

    if (prev === 0 && !newAch.includes('first_sip')) {
      newAch.push('first_sip'); newXP += 50
      toastQueue.push({ emoji: '🌊', text: 'Conquista: Primeiro Gole! +50 XP' })
    }
    if (newConsumed >= 1000 && prev < 1000 && !newAch.includes('liter')) {
      newAch.push('liter'); newXP += 150
      toastQueue.push({ emoji: '🏆', text: 'Conquista: Litro Zero! +150 XP' })
    }
    if (hour < 8 && !newAch.includes('early')) {
      newAch.push('early'); newXP += 75
      toastQueue.push({ emoji: '🌅', text: 'Conquista: Madrugador! +75 XP' })
    }
    if (hour >= 22 && !newAch.includes('night')) {
      newAch.push('night'); newXP += 75
      toastQueue.push({ emoji: '🌙', text: 'Conquista: Noturno! +75 XP' })
    }
    if (newToday.logs.length >= 5 && !newAch.includes('consistent')) {
      newAch.push('consistent'); newXP += 100
      toastQueue.push({ emoji: '💪', text: 'Conquista: Consistente! +100 XP' })
    }
    // First hour speed check
    if (newConsumed >= 500 && prev < 500 && hour === new Date().getHours() && new Date().getHours() < 9 && !newAch.includes('speed')) {
      newAch.push('speed'); newXP += 150
      toastQueue.push({ emoji: '⚡', text: 'Conquista: Velocidade da Luz! +150 XP' })
    }
    // Level 5 master
    if (xpLevel(newXP).level >= 5 && !newAch.includes('master')) {
      newAch.push('master'); newXP += 300
      toastQueue.push({ emoji: '🧙', text: 'Conquista: Mestre da Água! +300 XP' })
    }

    if (pct >= 1 && prev < profile.goal) {
      setCelebrate(true)
      setTimeout(() => setCelebrate(false), 3500)
      newStreak = game.streak + 1
      if (!newAch.includes('day1')) { newAch.push('day1'); newXP += 100 }
      if (newStreak >= 3 && !newAch.includes('streak3')) { newAch.push('streak3'); newXP += 200; toastQueue.push({ emoji: '🔥', text: '3 Dias On Fire! +200 XP' }) }
      if (newStreak >= 7 && !newAch.includes('streak7')) { newAch.push('streak7'); newXP += 500; toastQueue.push({ emoji: '💎', text: 'Uma Semana! +500 XP' }) }
      if (newStreak >= 14 && !newAch.includes('streak14')) { newAch.push('streak14'); newXP += 1000; toastQueue.push({ emoji: '👑', text: 'Quinzena Campeã! +1000 XP' }) }
      toastQueue.push({ emoji: '🎉', text: 'Meta diária atingida! INCRÍVEL! 🏆' })
      if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200])
    } else {
      const msgs = [
        { emoji: '💧', text: `+${fmt(ml)} adicionados!` },
        { emoji: '✨', text: `Isso aí! +${gained} XP ganhos!` },
        { emoji: '💪', text: `Faltam ${fmt(Math.max(0, profile.goal - newConsumed))} pra meta!` },
      ]
      toastQueue.push(msgs[Math.floor(Math.random() * msgs.length)])
    }

    setXpPop(gained)
    setTimeout(() => setXpPop(null), 2000)
    setGame({ xp: newXP, streak: newStreak, achievements: newAch, lastDate: todayKey() })
    toastQueue.forEach((t, i) => setTimeout(() => toast(t), i * 350))
  }, [today, profile, game, toast])

  const pct = Math.min(100, (today.consumed / profile.goal) * 100)
  const mood = pct >= 100 ? 'happy' : pct >= 60 ? 'normal' : pct >= 30 ? 'sad' : 'critical'
  const motivational = MOTIVATIONAL[new Date().getDay() % MOTIVATIONAL.length]

  return (
    <Ctx.Provider value={{
      dark, setDark, profile, saveProfile,
      today, history, game, addWater,
      toasts, xpPop, celebrate,
      pct, mood, motivational,
    }}>
      {children}
    </Ctx.Provider>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ONBOARDING
// ─────────────────────────────────────────────────────────────────────────────
function Onboarding() {
  const { profile, saveProfile } = useApp()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('drop')
  const [routine, setRoutine] = useState('normal')

  const sel = ROUTINES.find(r => r.id === routine)

  const finish = () => saveProfile({ ...profile, name, avatar, routine, goal: sel.goal, onboarded: true })
  const next = () => step < 3 ? setStep(s => s + 1) : finish()

  return (
    <div className="ob-shell">
      <div className="ob-dots">
        {[0,1,2,3].map(i => <div key={i} className={`ob-dot${i <= step ? ' on' : ''}${i === step ? ' cur' : ''}`} />)}
      </div>

      <div className="ob-body">
        {step === 0 && (
          <div className="ob-step fade-in">
            <div className="ob-big-emoji">💧</div>
            <h1 className="ob-title">Olá! Eu sou o<br /><span className="cyan">Hydra+</span>!</h1>
            <p className="ob-sub">Vou te ajudar a se manter hidratado de forma divertida e gamificada.</p>
            <div className="ob-features">
              {['🎮 Gamificação com XP e conquistas','🔔 Lembretes inteligentes e divertidos','📊 Estatísticas detalhadas do progresso','🏆 Streaks, medalhas e rankings'].map((f,i) => (
                <div key={i} className="ob-feat">{f}</div>
              ))}
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="ob-step fade-in">
            <h2 className="ob-title">Qual é o<br />seu nome?</h2>
            <p className="ob-sub">Para eu poder te chamar direitinho 😊</p>
            <input className="ob-input" placeholder="Seu nome aqui..." value={name} onChange={e => setName(e.target.value)} autoFocus />
          </div>
        )}
        {step === 2 && (
          <div className="ob-step fade-in">
            <h2 className="ob-title">Escolha<br />seu avatar</h2>
            <p className="ob-sub">Quem vai te acompanhar nessa jornada?</p>
            <div className="ob-avatar-grid">
              {AVATARS.map(a => (
                <button key={a.id} className={`ob-av-btn${avatar === a.id ? ' sel' : ''}`} onClick={() => setAvatar(a.id)}>
                  <span className="ob-av-emoji">{a.emoji}</span>
                  <span className="ob-av-label">{a.label}</span>
                  {avatar === a.id && <span className="ob-av-check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="ob-step fade-in">
            <h2 className="ob-title">Qual é<br />sua rotina?</h2>
            <p className="ob-sub">Isso define sua meta diária de hidratação</p>
            <div className="ob-routines">
              {ROUTINES.map(r => (
                <button key={r.id} className={`ob-routine${routine === r.id ? ' sel' : ''}`} onClick={() => setRoutine(r.id)}>
                  <span style={{fontSize:26}}>{r.icon}</span>
                  <div className="ob-rt-info">
                    <span className="ob-rt-name">{r.label}</span>
                    <span className="ob-rt-desc">{r.desc}</span>
                  </div>
                  <span className={`ob-rt-goal${routine === r.id ? ' cyan' : ''}`}>{fmt(r.goal)}/dia</span>
                  {routine === r.id && <span className="cyan" style={{fontSize:18}}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="ob-actions">
        {step > 0 && <button className="btn-sec" onClick={() => setStep(s => s - 1)}>← Voltar</button>}
        <button className="btn-pri" onClick={next}>{step === 3 ? '🚀 Começar!' : 'Continuar →'}</button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function HomeScreen() {
  const { profile, today, game, addWater, pct, mood, motivational, dark, setDark } = useApp()
  const [customAmt, setCustomAmt] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const { level } = xpLevel(game.xp)
  const remaining = Math.max(0, profile.goal - today.consumed)

  const moodInfo = {
    happy:    { text: 'Você está incrível hoje!', color: '#34d399' },
    normal:   { text: 'Continue bebendo água!',   color: '#00d4ff' },
    sad:      { text: 'Beba mais água agora!',     color: '#a78bfa' },
    critical: { text: 'ALERTA! Hidrate-se já!',   color: '#f87171' },
  }[mood]

  const doCustom = () => {
    const ml = parseInt(customAmt)
    if (ml > 0 && ml <= 3000) { addWater(ml); setCustomAmt(''); setShowCustom(false) }
  }

  return (
    <div className="screen home-screen">
      {/* Header */}
      <div className="home-hdr">
        <div>
          <div className="home-greeting">Olá, {profile.name || 'Hidratante'}! 👋</div>
          <div className="home-date">{new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})}</div>
        </div>
        <div className="home-hdr-right">
          <button className="icon-btn" onClick={() => setDark(d => !d)}>{dark ? '☀️' : '🌙'}</button>
          <div className="level-badge">Nv.{level}</div>
          <div className="streak-badge">🔥{game.streak}</div>
        </div>
      </div>

      {/* XP Bar */}
      <XPBar />

      {/* Motivational */}
      <div className="motiv-card glass-card">💬 {motivational}</div>

      {/* Main Dashboard */}
      <div className="dashboard">
        <div className="dash-side">
          <AvatarComp size={64} />
          <div className="mood-lbl" style={{color: moodInfo.color}}>{moodInfo.text}</div>
        </div>
        <div className="dash-center">
          <RingProgress />
        </div>
        <div className="dash-side">
          <Bottle />
        </div>
      </div>

      {/* Remaining */}
      <div className="remain-row">
        {pct < 100
          ? <><span className="remain-lbl">Faltam </span><span className="remain-amt">{fmt(remaining)}</span><span className="remain-lbl"> para a meta</span></>
          : <span className="goal-done">🎉 Meta do dia atingida! Incrível!</span>
        }
      </div>

      {/* Quick add */}
      <div className="sec-lbl">ADICIONAR ÁGUA</div>
      <div className="quick-grid">
        {[100,200,300,500].map(ml => (
          <button key={ml} className="quick-btn" onClick={() => addWater(ml)}>
            <span className="quick-icon">💧</span>
            <span className="quick-lbl">+{ml}ml</span>
          </button>
        ))}
      </div>

      <button className="custom-btn" onClick={() => setShowCustom(v => !v)}>
        {showCustom ? '✕ Cancelar' : '⚖️ Quantidade personalizada'}
      </button>
      {showCustom && (
        <div className="custom-row fade-in">
          <input className="custom-input" type="number" placeholder="Ex: 350" value={customAmt}
            onChange={e => setCustomAmt(e.target.value)} onKeyDown={e => e.key==='Enter' && doCustom()} />
          <span className="ml-lbl">ml</span>
          <button className="btn-pri small" onClick={doCustom}>+</button>
        </div>
      )}

      {/* Log */}
      {today.logs.length > 0 && <>
        <div className="sec-lbl" style={{marginTop:18}}>REGISTRO DE HOJE</div>
        {[...today.logs].reverse().slice(0,6).map((log,i) => (
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

// ─────────────────────────────────────────────────────────────────────────────
// STATS SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function StatsScreen() {
  const { today, history, profile, game } = useApp()
  const { level } = xpLevel(game.xp)

  const week = [
    ...history.slice(-6),
    { date: todayKey(), consumed: today.consumed, goal: profile.goal }
  ]
  const totalWeek = week.reduce((s, d) => s + d.consumed, 0)
  const avg = Math.round(totalWeek / week.length)
  const best = Math.max(...week.map(d => d.consumed))
  const achieved = week.filter(d => d.consumed >= d.goal).length
  const days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

  return (
    <div className="screen">
      <div className="scr-hdr">
        <h2 className="scr-title">Estatísticas 📊</h2>
        <p className="scr-sub">Sua evolução de hidratação</p>
      </div>

      <div className="stats-grid">
        {[
          { icon:'🔥', val: game.streak, lbl:'Dias seguidos',   cls:'cyan'  },
          { icon:'⭐', val: game.xp,     lbl:'XP Total',        cls:'purple'},
          { icon:'🏆', val: level,       lbl:'Nível atual',     cls:'blue'  },
          { icon:'✅', val:`${achieved}/7`,lbl:'Metas atingidas',cls:'green' },
        ].map((s,i) => (
          <div key={i} className={`stat-card sc-${s.cls}`}>
            <div className="sc-icon">{s.icon}</div>
            <div className="sc-val">{s.val}</div>
            <div className="sc-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="glass-card chart-card">
        <div className="card-title">Consumo Semanal</div>
        <div className="bar-chart">
          {week.map((d, i) => {
            const p = Math.min(100, (d.consumed / d.goal) * 100)
            const isToday = d.date === todayKey()
            const dObj = new Date(d.date + 'T12:00:00')
            return (
              <div key={i} className="bar-col">
                <div className="bar-amt">{fmt(d.consumed)}</div>
                <div className="bar-track">
                  <div className={`bar-fill${p>=100?' complete':''}${isToday?' today':''}`} style={{height:`${Math.max(4,p)}%`}} />
                </div>
                <div className={`bar-day${isToday?' today-lbl':''}`}>{days[dObj.getDay()]}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="glass-card">
        <div className="card-title">Resumo Semanal</div>
        {[
          ['💧 Total da semana', fmt(totalWeek)],
          ['📈 Média diária', fmt(avg)],
          ['🏆 Melhor dia', fmt(best)],
          ['🎯 Meta diária', fmt(profile.goal)],
          ['🔥 Streak atual', `${game.streak} dias`],
        ].map(([k,v],i) => (
          <div key={i} className="sum-row">
            <span>{k}</span><strong>{v}</strong>
          </div>
        ))}
      </div>

      {/* Progress bars */}
      <div className="glass-card">
        <div className="card-title">Progresso vs Meta</div>
        {week.map((d, i) => {
          const p = Math.min(100, (d.consumed / d.goal) * 100)
          const dObj = new Date(d.date + 'T12:00:00')
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

// ─────────────────────────────────────────────────────────────────────────────
// ACHIEVEMENTS SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function AchievementsScreen() {
  const { game } = useApp()
  const { level, title } = xpLevel(game.xp)

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
          <XPBar />
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
        {ACHIEVEMENTS.map(a => {
          const unlocked = game.achievements.includes(a.id)
          return (
            <div key={a.id} className={`ach-card${unlocked?' unlocked':' locked'}`}>
              <div className="ach-icon">{unlocked ? a.icon : '🔒'}</div>
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

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function SettingsScreen() {
  const { profile, saveProfile, dark, setDark, game } = useApp()
  const [localProfile, setLocalProfile] = useState(profile)

  const upd = (k, v) => {
    const np = { ...localProfile, [k]: v }
    setLocalProfile(np)
    saveProfile(np)
  }

  const requestNotifPerm = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission()
      if (perm === 'granted') alert('✅ Notificações ativadas! Você vai receber lembretes divertidos.')
      else alert('❌ Permissão negada. Ative nas configurações do navegador.')
    }
  }

  return (
    <div className="screen">
      <div className="scr-hdr">
        <h2 className="scr-title">Configurações ⚙️</h2>
        <p className="scr-sub">Personalize sua experiência</p>
      </div>

      {/* Avatar */}
      <div className="glass-card">
        <div className="card-title">Meu Avatar</div>
        <div className="cfg-av-grid">
          {AVATARS.map(a => (
            <button key={a.id} className={`ob-av-btn sm${localProfile.avatar===a.id?' sel':''}`} onClick={() => upd('avatar', a.id)}>
              <span style={{fontSize:28}}>{a.emoji}</span>
              <span className="ob-av-label">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Routine */}
      <div className="glass-card">
        <div className="card-title">Rotina & Meta</div>
        <div className="cfg-routines">
          {ROUTINES.map(r => (
            <button key={r.id} className={`ob-routine sm${localProfile.routine===r.id?' sel':''}`} onClick={() => { upd('routine', r.id); upd('goal', r.goal) }}>
              <span style={{fontSize:20}}>{r.icon}</span>
              <div className="ob-rt-info">
                <span className="ob-rt-name">{r.label}</span>
                <span className="ob-rt-desc">{r.desc}</span>
              </div>
              <span className={`ob-rt-goal${localProfile.routine===r.id?' cyan':''}`}>{fmt(r.goal)}/dia</span>
              {localProfile.routine === r.id && <span className="cyan">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card">
        <div className="card-title">Lembretes</div>
        {[
          { lbl: 'Intervalo', key: 'notifInterval', min: 15, max: 120, step: 15, suffix: 'min' },
          { lbl: 'Início',    key: 'notifStart',    min: 5,  max: 12,  step: 1,  suffix: 'h'   },
          { lbl: 'Fim',       key: 'notifEnd',      min: 18, max: 23,  step: 1,  suffix: 'h'   },
        ].map(s => (
          <div key={s.key} className="cfg-slider">
            <span className="cfg-sl-lbl">{s.lbl}</span>
            <input type="range" min={s.min} max={s.max} step={s.step}
              value={localProfile[s.key]}
              onChange={e => upd(s.key, +e.target.value)}
              className="slider" />
            <span className="cfg-sl-val">{localProfile[s.key]}{s.suffix}</span>
          </div>
        ))}
        <button className="btn-outline" onClick={requestNotifPerm} style={{marginTop:12}}>
          🔔 Ativar notificações do navegador
        </button>
      </div>

      {/* Toggles */}
      <div className="glass-card">
        <div className="card-title">Preferências</div>
        {[
          { icon:'🔔', lbl:'Sons suaves',  key:'soundEnabled'     },
          { icon:'📳', lbl:'Vibração',     key:'vibrationEnabled' },
        ].map(t => (
          <div key={t.key} className="toggle-row">
            <span>{t.icon} {t.lbl}</span>
            <button className={`toggle${localProfile[t.key]?' on':' off'}`} onClick={() => upd(t.key, !localProfile[t.key])}>
              <div className="toggle-thumb" />
            </button>
          </div>
        ))}
        <div className="toggle-row">
          <span>{dark?'🌙':'☀️'} Modo escuro</span>
          <button className={`toggle${dark?' on':' off'}`} onClick={() => setDark(d => !d)}>
            <div className="toggle-thumb" />
          </button>
        </div>
      </div>

      {/* Notification preview */}
      <div className="glass-card">
        <div className="card-title">Preview de Notificação</div>
        <div className="notif-prev">
          <div className="notif-prev-app">Hydra+ 💧</div>
          <div className="notif-prev-txt">{NOTIF_MSGS[Math.floor(Math.random()*NOTIF_MSGS.length)].emoji} {NOTIF_MSGS[Math.floor(Math.random()*NOTIF_MSGS.length)].text}</div>
        </div>
      </div>

      {/* Reset */}
      <div className="glass-card">
        <div className="card-title">Dados</div>
        <div className="sum-row"><span>XP Total acumulado</span><strong>{game.xp} XP</strong></div>
        <div className="sum-row"><span>Conquistas</span><strong>{game.achievements.length}/{ACHIEVEMENTS.length}</strong></div>
        <button className="btn-danger" onClick={() => {
          if (confirm('Resetar TODOS os dados do app? Esta ação não pode ser desfeita.')) {
            localStorage.clear(); window.location.reload()
          }
        }}>🗑️ Resetar todos os dados</button>
      </div>
      <div style={{height:24}}/>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function XPBar() {
  const { game } = useApp()
  const { level, progress, next, title } = xpLevel(game.xp)
  return (
    <div className="xp-wrap">
      <div className="xp-hdr">
        <span className="xp-level">Nível {level}</span>
        <span className="xp-title">{title}</span>
        <span className="xp-pts">{game.xp}/{next} XP</span>
      </div>
      <div className="xp-track"><div className="xp-fill" style={{width:`${progress*100}%`}}/></div>
    </div>
  )
}

function AvatarComp({ size = 60 }) {
  const { profile, mood } = useApp()
  const em = AVATARS.find(a => a.id === profile.avatar)?.emoji || '💧'
  const cls = { happy:'av-bounce', normal:'av-float', sad:'av-droop', critical:'av-shake' }[mood]
  const op = mood === 'critical' ? 0.65 : 1
  return (
    <div className={`avatar-wrap ${cls}`} style={{fontSize:size, opacity:op, lineHeight:1, userSelect:'none'}}>
      {em}
      {mood==='happy' && <div className="sparkles"><span className="sp sp0">✨</span><span className="sp sp1">💫</span><span className="sp sp2">⭐</span></div>}
    </div>
  )
}

function RingProgress() {
  const { pct, today, profile, mood } = useApp()
  const size = 178
  const r = (size - 22) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const colors = { happy:'#00d4ff', normal:'#38bdf8', sad:'#93c5fd', critical:'#94a3b8' }
  const stroke = pct >= 100 ? 'url(#rg)' : (colors[mood] || colors.normal)
  return (
    <div className="ring-wrap">
      <svg width={size} height={size} style={{position:'absolute',top:0,left:0}}>
        <defs>
          <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff"/>
            <stop offset="100%" stopColor="#a78bfa"/>
          </linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={stroke} strokeWidth="12"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{transition:'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)'}}
          filter={pct>=80?'url(#glow)':undefined}/>
      </svg>
      <div className="ring-inner">
        <div className="ring-consumed">{fmt(today.consumed)}</div>
        <div className="ring-of">de {fmt(profile.goal)}</div>
        <div className="ring-pct" style={{color: pct>=100?'#34d399':'#00d4ff'}}>{Math.round(pct)}%</div>
      </div>
    </div>
  )
}

function Bottle() {
  const { pct, mood } = useApp()
  const c = Math.max(0, Math.min(100, pct))
  const fillColors = { happy:['#00d4ff','#0099cc'], normal:['#38bdf8','#0ea5e9'], sad:['#93c5fd','#60a5fa'], critical:['#cbd5e1','#94a3b8'] }
  const [c1, c2] = fillColors[mood] || fillColors.normal
  const waterTop = 100 - c
  return (
    <div className="bottle-wrap">
      <div className="bottle-cap" />
      <div className="bottle-body">
        <div className="bottle-water" style={{ top:`${waterTop}%`, background:`linear-gradient(180deg,${c1},${c2})` }}>
          <div className="wave-line" />
        </div>
        <div className="bottle-shine" />
      </div>
      <div className="bottle-pct">{Math.round(c)}%</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TOAST LAYER
// ─────────────────────────────────────────────────────────────────────────────
function ToastLayer() {
  const { toasts, xpPop, celebrate } = useApp()
  return (
    <>
      <div className="toast-layer">
        {toasts.map(t => <ToastItem key={t.id} msg={t} />)}
      </div>
      {xpPop && <div className="xp-pop">+{xpPop} XP ⚡</div>}
      {celebrate && (
        <div className="celebrate-layer" style={{pointerEvents:'none'}}>
          {['🎉','💧','⭐','🏆','✨','🎊','💫','🌊'].map((e,i) => (
            <span key={i} className={`conf conf-${i}`}>{e}</span>
          ))}
        </div>
      )}
    </>
  )
}

function ToastItem({ msg }) {
  return (
    <div className="toast-item">
      <span style={{fontSize:18}}>{msg.emoji}</span>
      <span className="toast-txt">{msg.text}</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
function MainApp() {
  const { dark } = useApp()
  const [tab, setTab] = useState('home')

  const tabs = [
    { id:'home',         icon:'💧', label:'Início'   },
    { id:'stats',        icon:'📊', label:'Stats'    },
    { id:'achievements', icon:'🏆', label:'Conquistas'},
    { id:'settings',     icon:'⚙️', label:'Config'   },
  ]

  return (
    <div className={`app-shell${dark?'':' light'}`}>
      <ToastLayer />
      <div className="app-content">
        {tab === 'home'         && <HomeScreen />}
        {tab === 'stats'        && <StatsScreen />}
        {tab === 'achievements' && <AchievementsScreen />}
        {tab === 'settings'     && <SettingsScreen />}
      </div>
      <nav className="bottom-nav">
        {tabs.map(t => (
          <button key={t.id} className={`nav-tab${tab===t.id?' active':''}`} onClick={() => setTab(t.id)}>
            <span className="nav-icon">{t.icon}</span>
            <span className="nav-lbl">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SPLASH
// ─────────────────────────────────────────────────────────────────────────────
function Splash({ onDone }) {
  useEffect(() => { setTimeout(onDone, 2600) }, [])
  return (
    <div className="splash">
      <div className="splash-inner">
        <div className="splash-drop">💧</div>
        <h1 className="splash-title">Hydra<span>+</span></h1>
        <p className="splash-sub">Seu companheiro de hidratação</p>
      </div>
      <div className="splash-bar"><div className="splash-fill" /></div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
function AppInner() {
  const { profile } = useApp()
  const [splashDone, setSplashDone] = useState(false)
  if (!splashDone) return <Splash onDone={() => setSplashDone(true)} />
  if (!profile.onboarded) return <Onboarding />
  return <MainApp />
}

export default function App() {
  return (
    <>
      <Styles />
      <AppProvider><AppInner /></AppProvider>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES  (single <style> injection — no CSS file needed)
// ─────────────────────────────────────────────────────────────────────────────
function Styles() {
  return (
    <style>{`
/* ── Reset & base ─────────────────────────────── */
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

/* ── Shell ─────────────────────────────────────── */
.app-shell{
  max-width:430px;margin:0 auto;height:100dvh;
  display:flex;flex-direction:column;position:relative;
  background:var(--bg);overflow:hidden;
}
.app-content{
  flex:1;overflow-y:auto;overflow-x:hidden;
  scrollbar-width:none;
}
.app-content::-webkit-scrollbar{display:none}
.screen{padding:12px 16px 0}

/* ── Splash ────────────────────────────────────── */
.splash{
  height:100dvh;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:48px;
  background:radial-gradient(ellipse at center,#051830 0%,#020a14 100%);
}
.splash-inner{text-align:center}
.splash-drop{font-size:88px;display:block;animation:splashDrop .8s cubic-bezier(.34,1.56,.64,1) both}
.splash-title{font-family:'Space Grotesk',sans-serif;font-size:52px;font-weight:700;color:#f0f9ff;letter-spacing:-2px}
.splash-title span{color:var(--cyan)}
.splash-sub{font-size:15px;color:var(--t2);margin-top:8px}
.splash-bar{width:200px;height:3px;background:rgba(255,255,255,.1);border-radius:99px;overflow:hidden}
.splash-fill{height:100%;background:linear-gradient(90deg,var(--cyan),var(--purple));animation:splashLoad 2.2s .4s ease forwards;width:0}
@keyframes splashDrop{from{transform:translateY(-60px) scale(.5);opacity:0}to{transform:none;opacity:1}}
@keyframes splashLoad{to{width:100%}}

/* ── Onboarding ─────────────────────────────────── */
.ob-shell{
  min-height:100dvh;display:flex;flex-direction:column;
  padding:24px 20px 40px;background:var(--bg);
}
.ob-dots{display:flex;gap:8px;justify-content:center;margin-bottom:28px}
.ob-dot{width:8px;height:8px;border-radius:99px;background:rgba(255,255,255,.14);transition:all .3s}
.ob-dot.on{background:rgba(0,212,255,.5)}
.ob-dot.cur{width:26px;background:var(--cyan)}
.ob-body{flex:1}
.ob-step{padding-bottom:12px}
.ob-big-emoji{font-size:88px;display:block;text-align:center;margin-bottom:20px;animation:splashDrop .6s both}
.ob-title{font-family:'Space Grotesk',sans-serif;font-size:32px;font-weight:700;line-height:1.15;margin-bottom:8px}
.ob-sub{font-size:14px;color:var(--t2);margin-bottom:24px;line-height:1.6}
.ob-features{display:flex;flex-direction:column;gap:10px}
.ob-feat{
  padding:14px 16px;background:var(--card);
  border:1px solid var(--border);border-radius:14px;
  font-size:14px;font-weight:600;color:var(--t1)
}
.ob-input{
  width:100%;padding:16px 18px;
  background:var(--card);border:1.5px solid var(--border);
  border-radius:16px;color:var(--t1);font-family:'Nunito',sans-serif;
  font-size:17px;font-weight:600;outline:none;transition:border-color .2s
}
.ob-input:focus{border-color:var(--cyan)}
.ob-input::placeholder{color:var(--t3)}
.ob-avatar-grid{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.ob-av-btn{
  display:flex;flex-direction:column;align-items:center;gap:5px;
  padding:14px;background:var(--card);border:2px solid var(--border);
  border-radius:18px;cursor:pointer;transition:all .2s;color:var(--t1);
  width:calc(33% - 8px);position:relative
}
.ob-av-btn.sm{width:auto;padding:10px 12px}
.ob-av-btn.sel{border-color:var(--cyan);background:rgba(0,212,255,.1)}
.ob-av-emoji{font-size:36px}
.ob-av-label{font-size:11px;color:var(--t2);font-weight:700}
.ob-av-check{position:absolute;top:6px;right:8px;font-size:12px;font-weight:900;color:var(--cyan)}
.ob-routines{display:flex;flex-direction:column;gap:8px}
.ob-routine{
  display:flex;align-items:center;gap:12px;padding:14px 16px;
  background:var(--card);border:2px solid var(--border);
  border-radius:14px;cursor:pointer;color:var(--t1);text-align:left;
  transition:all .2s;width:100%
}
.ob-routine.sm{padding:11px 14px}
.ob-routine.sel{border-color:var(--cyan);background:rgba(0,212,255,.08)}
.ob-rt-info{flex:1}
.ob-rt-name{display:block;font-weight:800;font-size:15px;color:var(--t1)}
.ob-rt-desc{display:block;font-size:11px;color:var(--t2);margin-top:1px}
.ob-rt-goal{font-size:13px;font-weight:700;color:var(--t3)}
.ob-rt-goal.cyan,.cyan{color:var(--cyan)!important}
.ob-actions{display:flex;gap:12px;padding-top:20px}
.btn-pri{
  flex:1;padding:16px;background:linear-gradient(135deg,var(--cyan),#0099ee);
  border:none;border-radius:16px;color:#fff;font-family:'Nunito',sans-serif;
  font-size:16px;font-weight:900;cursor:pointer;transition:transform .15s;
  box-shadow:0 4px 20px rgba(0,212,255,.28)
}
.btn-pri:active{transform:scale(.96)}
.btn-pri.small{flex:0;padding:11px 18px;font-size:14px}
.btn-sec{
  padding:16px 18px;background:var(--card);
  border:1px solid var(--border);border-radius:16px;
  color:var(--t2);font-family:'Nunito',sans-serif;
  font-size:15px;font-weight:700;cursor:pointer
}
.btn-outline{
  width:100%;padding:12px;background:transparent;
  border:1.5px solid var(--border);border-radius:12px;
  color:var(--cyan);font-family:'Nunito',sans-serif;
  font-size:13px;font-weight:700;cursor:pointer;
  transition:border-color .2s
}
.btn-outline:hover{border-color:var(--cyan)}
.btn-danger{
  width:100%;padding:12px;background:rgba(248,113,113,.1);
  border:1.5px solid rgba(248,113,113,.3);border-radius:12px;
  color:var(--red);font-family:'Nunito',sans-serif;
  font-size:13px;font-weight:700;cursor:pointer;margin-top:12px
}

/* ── Glass card ──────────────────────────────────── */
.glass-card{
  background:var(--card);border:1px solid var(--border);
  border-radius:20px;padding:16px;margin-bottom:12px;
}
.card-title{
  font-family:'Space Grotesk',sans-serif;font-size:12px;
  font-weight:600;color:var(--t2);text-transform:uppercase;
  letter-spacing:.6px;margin-bottom:12px
}

/* ── Bottom nav ──────────────────────────────────── */
.bottom-nav{
  display:flex;background:var(--bg2);
  border-top:1px solid var(--border);
  padding:6px 0 max(6px,env(safe-area-inset-bottom));
}
.nav-tab{
  flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;
  padding:8px 4px;background:none;border:none;
  cursor:pointer;color:var(--t3);transition:color .2s
}
.nav-tab.active{color:var(--cyan)}
.nav-tab.active .nav-icon{transform:scale(1.18)}
.nav-icon{font-size:22px;transition:transform .2s;display:block}
.nav-lbl{font-size:10px;font-weight:700}

/* ── Home ────────────────────────────────────────── */
.home-screen{padding-top:max(12px,env(safe-area-inset-top))}
.home-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
.home-greeting{font-size:17px;font-weight:900;color:var(--t1)}
.home-date{font-size:11px;color:var(--t2);text-transform:capitalize;margin-top:2px}
.home-hdr-right{display:flex;align-items:center;gap:7px}
.icon-btn{background:none;border:none;font-size:20px;cursor:pointer;padding:2px}
.level-badge{
  background:linear-gradient(135deg,var(--purple),var(--cyan));
  color:#fff;font-size:11px;font-weight:900;padding:4px 10px;border-radius:99px
}
.streak-badge{
  background:rgba(251,191,36,.14);color:var(--amber);font-size:11px;
  font-weight:900;padding:4px 10px;border-radius:99px;
  border:1px solid rgba(251,191,36,.3)
}
.xp-wrap{margin-bottom:10px}
.xp-hdr{display:flex;align-items:center;gap:7px;margin-bottom:5px}
.xp-level{font-size:11px;font-weight:900;color:var(--cyan)}
.xp-title{font-size:11px;color:var(--t2);flex:1}
.xp-pts{font-size:10px;color:var(--t3)}
.xp-track{height:6px;background:rgba(255,255,255,.07);border-radius:99px;overflow:hidden;border:1px solid var(--border)}
.xp-fill{height:100%;background:linear-gradient(90deg,var(--cyan),var(--purple));border-radius:99px;transition:width 1s ease}
.motiv-card{font-size:12px;color:var(--t2);font-style:italic;padding:11px 14px;margin-bottom:14px}
.dashboard{display:flex;align-items:center;gap:4px;margin-bottom:10px}
.dash-side{width:76px;display:flex;flex-direction:column;align-items:center;gap:5px}
.dash-center{flex:1;display:flex;justify-content:center}
.mood-lbl{font-size:10px;text-align:center;font-weight:700;line-height:1.3}
.remain-row{display:flex;align-items:center;justify-content:center;gap:5px;margin-bottom:16px;flex-wrap:wrap}
.remain-lbl{font-size:13px;color:var(--t2)}
.remain-amt{font-size:19px;font-weight:900;color:var(--cyan);font-family:'Space Grotesk',sans-serif}
.goal-done{font-size:15px;font-weight:900;color:var(--green)}
.sec-lbl{font-size:11px;font-weight:900;color:var(--t2);text-transform:uppercase;letter-spacing:.6px;margin-bottom:9px}
.quick-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px}
.quick-btn{
  display:flex;flex-direction:column;align-items:center;gap:4px;
  padding:12px 4px;background:var(--card);border:1.5px solid var(--border);
  border-radius:16px;cursor:pointer;transition:all .15s;color:var(--t1);
  font-family:'Nunito',sans-serif
}
.quick-btn:active{transform:scale(.93);border-color:var(--cyan);background:rgba(0,212,255,.12)}
.quick-icon{font-size:20px}
.quick-lbl{font-size:12px;font-weight:900}
.custom-btn{
  width:100%;padding:12px;background:var(--card);
  border:1.5px dashed var(--border);border-radius:14px;
  color:var(--t2);font-family:'Nunito',sans-serif;
  font-size:13px;font-weight:700;cursor:pointer;margin-bottom:10px;transition:all .2s
}
.custom-btn:hover{border-color:var(--cyan);color:var(--cyan)}
.custom-row{display:flex;gap:8px;align-items:center;margin-bottom:10px}
.custom-input{
  flex:1;padding:12px 14px;background:var(--card);
  border:1.5px solid var(--border);border-radius:14px;
  color:var(--t1);font-family:'Nunito',sans-serif;font-size:15px;font-weight:600;outline:none
}
.custom-input:focus{border-color:var(--cyan)}
.ml-lbl{color:var(--t2);font-weight:700}
.log-item{display:flex;align-items:center;gap:12px;padding:10px 14px;margin-bottom:6px}
.log-ml{flex:1;font-weight:900;font-size:14px;color:var(--cyan)}
.log-time{font-size:12px;color:var(--t3)}

/* ── Avatar ──────────────────────────────────────── */
.avatar-wrap{position:relative;display:inline-flex;align-items:center;justify-content:center}
.av-float{animation:avFloat 3s ease-in-out infinite}
.av-bounce{animation:avBounce 1s ease-in-out infinite}
.av-droop{animation:avDroop 2.5s ease-in-out infinite}
.av-shake{animation:avShake .5s ease-in-out infinite}
@keyframes avFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes avBounce{0%,100%{transform:translateY(0)}30%{transform:translateY(-12px) rotate(-3deg)}70%{transform:translateY(-6px) rotate(3deg)}}
@keyframes avDroop{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(4px) rotate(4deg)}}
@keyframes avShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
.sparkles{position:absolute;inset:0;pointer-events:none}
.sp{position:absolute;font-size:14px;animation:spAnim 1.6s ease-in-out infinite}
.sp0{top:-8px;right:-8px;animation-delay:0s}
.sp1{top:4px;left:-14px;animation-delay:.5s}
.sp2{bottom:-4px;right:-14px;animation-delay:1s}
@keyframes spAnim{0%,100%{transform:scale(.5) rotate(0);opacity:.5}50%{transform:scale(1.2) rotate(180deg);opacity:1}}

/* ── Progress ring ───────────────────────────────── */
.ring-wrap{position:relative;width:178px;height:178px;display:flex;align-items:center;justify-content:center}
.ring-inner{text-align:center;pointer-events:none}
.ring-consumed{font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:700;color:var(--t1)}
.ring-of{font-size:11px;color:var(--t2)}
.ring-pct{font-size:14px;font-weight:900;margin-top:2px;transition:color .5s}

/* ── Bottle ──────────────────────────────────────── */
.bottle-wrap{display:flex;flex-direction:column;align-items:center;gap:4px}
.bottle-cap{width:22px;height:10px;border-radius:4px;background:rgba(255,255,255,.28)}
.bottle-body{
  width:46px;height:110px;border-radius:12px;
  background:rgba(255,255,255,.06);
  border:1.5px solid rgba(255,255,255,.2);
  overflow:hidden;position:relative
}
.bottle-water{
  position:absolute;left:0;right:0;bottom:0;
  border-radius:10px;
  transition:top 1.4s cubic-bezier(.4,0,.2,1)
}
.wave-line{
  position:absolute;top:0;left:0;right:0;height:8px;
  background:inherit;filter:brightness(1.4);
  border-radius:50% 50% 0 0/100% 100% 0 0;
  animation:waveAnim 2s linear infinite
}
@keyframes waveAnim{0%,100%{transform:scaleX(1) translateX(0)}50%{transform:scaleX(1.06) translateX(-3%)}}
.bottle-shine{position:absolute;left:8px;top:8px;width:5px;bottom:10px;background:rgba(255,255,255,.17);border-radius:3px}
.bottle-pct{font-size:10px;font-weight:900;color:var(--t2)}

/* ── Stats ───────────────────────────────────────── */
.scr-hdr{margin-bottom:14px;padding-top:max(12px,env(safe-area-inset-top))}
.scr-title{font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:700;color:var(--t1)}
.scr-sub{font-size:13px;color:var(--t2);margin-top:2px}
.stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.stat-card{padding:14px;border-radius:18px;text-align:center;border:1.5px solid}
.sc-cyan{background:rgba(0,212,255,.08);border-color:rgba(0,212,255,.25)}
.sc-purple{background:rgba(167,139,250,.08);border-color:rgba(167,139,250,.25)}
.sc-blue{background:rgba(56,189,248,.08);border-color:rgba(56,189,248,.25)}
.sc-green{background:rgba(52,211,153,.08);border-color:rgba(52,211,153,.25)}
.sc-icon{font-size:26px;margin-bottom:6px}
.sc-val{font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:700;color:var(--t1)}
.sc-lbl{font-size:11px;color:var(--t2);font-weight:700;margin-top:2px}
.chart-card{padding:16px}
.bar-chart{display:flex;align-items:flex-end;gap:6px;height:120px;padding-top:22px}
.bar-col{flex:1;display:flex;flex-direction:column;align-items:center;height:100%}
.bar-amt{font-size:7px;color:var(--t3);margin-bottom:3px;text-align:center}
.bar-track{flex:1;width:100%;background:rgba(255,255,255,.05);border-radius:6px;overflow:hidden;display:flex;align-items:flex-end;border:1px solid var(--border)}
.bar-fill{width:100%;border-radius:5px;background:linear-gradient(180deg,var(--blue),var(--cyan2));transition:height 1s ease}
.bar-fill.complete{background:linear-gradient(180deg,#34d399,#059669)}
.bar-fill.today{background:linear-gradient(180deg,var(--cyan),var(--purple));box-shadow:0 0 10px rgba(0,212,255,.35)}
.bar-day{font-size:10px;color:var(--t2);margin-top:4px;font-weight:700}
.today-lbl{color:var(--cyan)}
.sum-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);font-size:13px;color:var(--t2)}
.sum-row:last-of-type{border-bottom:none}
.sum-row strong{color:var(--t1);font-size:14px}
.pr-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.pr-day{font-size:12px;font-weight:900;color:var(--t2);width:28px}
.pr-track{flex:1;height:8px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden}
.pr-fill{height:100%;border-radius:99px;transition:width 1s ease}
.pr-fill.c{background:var(--green)}
.pr-fill.g{background:var(--cyan)}
.pr-fill.l{background:var(--purple)}
.pr-pct{font-size:11px;font-weight:700;color:var(--t2);width:32px;text-align:right}

/* ── Achievements ────────────────────────────────── */
.level-show{display:flex;align-items:center;gap:14px}
.ls-info{flex:1}
.ls-level{font-family:'Space Grotesk',sans-serif;font-size:19px;font-weight:700;color:var(--t1)}
.ls-title{font-size:12px;color:var(--cyan);font-weight:700;margin-bottom:8px}
.streak-show{display:flex;align-items:center;gap:14px;background:rgba(251,191,36,.08);border-color:rgba(251,191,36,.25)}
.ss-num{font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:700;color:var(--amber)}
.ss-lbl{font-size:12px;color:var(--t2)}
.ss-quote{font-size:11px;color:var(--t3);font-style:italic;margin-top:4px}
.ach-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.ach-card{
  padding:14px;border-radius:18px;text-align:center;
  border:1.5px solid var(--border);background:var(--card);
  position:relative;overflow:hidden;transition:all .2s
}
.ach-card.unlocked{border-color:rgba(0,212,255,.3);background:rgba(0,212,255,.05)}
.ach-card.locked{opacity:.55}
.ach-icon{font-size:30px;display:block;margin-bottom:6px}
.ach-lbl{font-size:12px;font-weight:900;color:var(--t1);margin-bottom:2px}
.ach-desc{font-size:10px;color:var(--t2);margin-bottom:4px;line-height:1.3}
.ach-xp{font-size:10px;font-weight:900;color:var(--cyan)}

/* ── Settings ────────────────────────────────────── */
.cfg-av-grid{display:flex;flex-wrap:wrap;gap:8px}
.cfg-routines{display:flex;flex-direction:column;gap:7px}
.cfg-slider{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)}
.cfg-slider:last-of-type{border-bottom:none}
.cfg-sl-lbl{font-size:13px;color:var(--t2);width:64px}
.slider{flex:1;accent-color:var(--cyan);cursor:pointer}
.cfg-sl-val{font-size:13px;font-weight:700;color:var(--cyan);width:44px;text-align:right}
.toggle-row{display:flex;align-items:center;justify-content:space-between;padding:13px 0;border-bottom:1px solid var(--border);font-size:14px;color:var(--t1)}
.toggle-row:last-child{border-bottom:none}
.toggle{width:50px;height:28px;border-radius:99px;border:none;cursor:pointer;position:relative;transition:background .3s}
.toggle.on{background:var(--cyan)}
.toggle.off{background:rgba(255,255,255,.15)}
.toggle-thumb{position:absolute;top:4px;width:20px;height:20px;background:#fff;border-radius:50%;transition:left .3s}
.toggle.on .toggle-thumb{left:26px}
.toggle.off .toggle-thumb{left:4px}
.notif-prev{background:rgba(255,255,255,.07);border:1px solid var(--border);border-radius:14px;padding:12px 16px;margin-top:4px}
.notif-prev-app{font-size:11px;font-weight:900;color:var(--cyan);margin-bottom:4px}
.notif-prev-txt{font-size:13px;color:var(--t1)}

/* ── Toast / overlays ────────────────────────────── */
.toast-layer{position:fixed;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;z-index:9999;padding-top:max(14px,env(safe-area-inset-top));pointer-events:none;display:flex;flex-direction:column;align-items:center;gap:8px}
.toast-item{
  display:flex;align-items:center;gap:10px;
  padding:11px 20px;
  background:rgba(5,13,26,.97);
  border:1px solid var(--cyan);border-radius:99px;
  box-shadow:0 6px 28px rgba(0,212,255,.22);
  animation:toastIn .35s cubic-bezier(.34,1.56,.64,1);
  max-width:calc(100% - 32px)
}
.toast-txt{font-size:13px;font-weight:700;color:var(--t1)}
@keyframes toastIn{from{opacity:0;transform:translateY(-20px) scale(.88)}to{opacity:1;transform:none}}
.xp-pop{
  position:fixed;right:20px;top:90px;
  background:linear-gradient(135deg,var(--purple),var(--cyan));
  color:#fff;font-size:14px;font-weight:900;padding:8px 16px;
  border-radius:99px;z-index:9998;pointer-events:none;
  animation:xpPop 2.1s ease forwards
}
@keyframes xpPop{0%{opacity:0;transform:translateY(10px) scale(.8)}15%{opacity:1;transform:none}80%{opacity:1}100%{opacity:0;transform:translateY(-44px)}}
.celebrate-layer{position:fixed;inset:0;z-index:9997;overflow:hidden}
.conf{position:absolute;font-size:30px;animation:confFall 3s ease-in both}
.conf-0{left:6%;animation-delay:.0s}
.conf-1{left:20%;animation-delay:.15s}
.conf-2{left:37%;animation-delay:.05s}
.conf-3{left:52%;animation-delay:.2s}
.conf-4{left:66%;animation-delay:.0s}
.conf-5{left:79%;animation-delay:.1s}
.conf-6{left:89%;animation-delay:.25s}
.conf-7{left:46%;animation-delay:.3s}
@keyframes confFall{from{top:-60px;transform:rotate(0)}to{top:110vh;transform:rotate(720deg) scale(.4)}}

/* ── Utils ────────────────────────────────────────── */
.fade-in{animation:fadeUp .35s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
`}</style>
  )
}
