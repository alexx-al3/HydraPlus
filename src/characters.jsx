// ═══════════════════════════════════════════════════════════════════════
// HYDRA+ ANIMATED TAMAGOTCHI CHARACTERS
// 8 characters × 4 moods: happy | normal | sad | critical
// All animations pure CSS — no images needed
// ═══════════════════════════════════════════════════════════════════════

// ── Shared face parts ────────────────────────────────────────────────
function Eyes({ mood }) {
  const h = mood === 'happy'
  const c = mood === 'critical'
  const s = mood === 'sad'
  return (
    <div className="eyes-row">
      {[0, 1].map(i => (
        <div key={i} className={`eye${h ? ' eye-happy' : c ? ' eye-x' : s ? ' eye-sad' : ''}`}>
          {h && <div className="eye-gleam" />}
          {c && <span className="eye-x-mark">✕</span>}
        </div>
      ))}
    </div>
  )
}

function Face({ mood, cls = '' }) {
  const h = mood === 'happy'
  const n = mood === 'normal'
  const s = mood === 'sad'
  const c = mood === 'critical'
  return (
    <div className={`face ${cls}`}>
      <Eyes mood={mood} />
      {(h || n) && <><div className="cheek cl" /><div className="cheek cr" /></>}
      <div className={`mouth mouth-${mood}`} />
      {(s || c) && <><div className="tear tl" /><div className="tear tr" /></>}
    </div>
  )
}

// ── 1. GOTINHA 💧 ─────────────────────────────────────────────────────
export function CharDrop({ mood }) {
  const h = mood === 'happy', n = mood === 'normal'
  const s = mood === 'sad',   c = mood === 'critical'
  return (
    <div className={`char char-${mood}`}>
      {/* Splash rings when happy */}
      {h && <div className="splash-ring" />}
      {h && [0,1,2,3,4,5].map(i => <div key={i} className={`splash-drop sp${i}`}>💧</div>)}

      {/* Main body */}
      <div className="drop-body">
        <div className="body-shine" />
        <Face mood={mood} />
        {/* Water fill level */}
        <div className="water-fill" style={{height:`${h?88:n?60:s?30:8}%`}} />
        {/* Bubbles when happy */}
        {h && [1,2,3].map(i => <div key={i} className={`bubble b${i}`} />)}
      </div>

      {/* Arms */}
      <div className={`arm arm-l arm-${mood}`} />
      <div className={`arm arm-r arm-${mood}`} />

      {/* Accessories */}
      {h && <><div className="star st1">✨</div><div className="star st2">⭐</div><div className="star st3">💫</div></>}
      {n && <div className="zzz">💤</div>}
      {c && <div className="sweat">💦</div>}
    </div>
  )
}

// ── 2. DINO 🦕 ───────────────────────────────────────────────────────
export function CharDino({ mood }) {
  const h = mood === 'happy', n = mood === 'normal'
  const s = mood === 'sad',   c = mood === 'critical'
  return (
    <div className={`char char-${mood}`}>
      {h && <><div className="star st1">✨</div><div className="star st2">💫</div><div className="star st3">⭐</div></>}

      {/* Spikes */}
      <div className="dino-spikes">
        {[0,1,2,3].map(i => <div key={i} className={`dino-spike ds${i}${h?' spike-h':''}`} />)}
      </div>

      <div className="dino-body">
        <div className="body-shine dino-shine" />
        <Face mood={mood} cls="dino-face" />
        <div className="water-fill dino-wf" style={{
          height:`${h?85:n?55:s?26:7}%`,
          background:'linear-gradient(0deg,rgba(80,220,80,.5),rgba(120,255,100,.2))'
        }} />
      </div>

      <div className={`arm arm-l arm-${mood} dino-arm`} />
      <div className={`arm arm-r arm-${mood} dino-arm`} />
      <div className={`dino-tail${h?' tail-wag':''}`} />
      {c && <div className="sweat">💦</div>}
      {n && <div className="zzz">💤</div>}
    </div>
  )
}

// ── 3. BALEIA 🐋 ─────────────────────────────────────────────────────
export function CharWhale({ mood }) {
  const h = mood === 'happy', n = mood === 'normal'
  const s = mood === 'sad',   c = mood === 'critical'
  return (
    <div className={`char char-${mood} whale-char`}>
      {h && <div className="whale-spout">💦<br/>💦</div>}
      {h && <><div className="star st1">🌊</div><div className="star st2">✨</div></>}

      <div className="whale-body">
        <div className="body-shine whale-shine" />
        <div className="whale-belly" />
        <Face mood={mood} cls="whale-face" />
        <div className="water-fill" style={{
          height:`${h?80:n?50:s?20:5}%`,
          background:'linear-gradient(0deg,rgba(50,100,255,.4),rgba(100,180,255,.15))',
          borderRadius:'0 0 50px 50px'
        }} />
        {n && <div className="zzz whale-zzz">💤</div>}
      </div>

      <div className={`whale-tail${h?' tail-wag':''}`} />
      {c && <div className="sweat">💦</div>}
    </div>
  )
}

// ── 4. PLANTINHA 🌱 ──────────────────────────────────────────────────
export function CharPlant({ mood }) {
  const h = mood === 'happy', n = mood === 'normal'
  const s = mood === 'sad',   c = mood === 'critical'
  const leaves = h ? 3 : n ? 2 : s ? 1 : 0
  return (
    <div className={`char char-${mood}`}>
      {h && <><div className="star st1">✨</div><div className="star st2">💫</div><div className="star st3">⭐</div></>}

      {/* Leaves + flower */}
      <div className="plant-top">
        {h && <div className="plant-flower">🌸</div>}
        {Array.from({ length: Math.max(1, leaves) }).map((_, i) => (
          <div key={i} className={`plant-leaf pl${i}${h ? ' leaf-bounce' : ''}`} />
        ))}
        <div className="plant-stem" />
      </div>

      <div className="plant-body">
        <div className="body-shine plant-shine" />
        <Face mood={mood} cls="plant-face" />
        <div className="water-fill plant-wf" style={{
          height: `${h?85:n?55:s?25:7}%`,
          background: c ? 'linear-gradient(0deg,#92400e,#78350f)'
                    : s ? 'linear-gradient(0deg,#a16207,#92400e)'
                    : 'linear-gradient(0deg,rgba(100,220,80,.5),rgba(150,255,100,.2))'
        }} />
      </div>

      <div className="plant-pot" />
      {c && <div className="sweat">🥀</div>}
    </div>
  )
}

// ── 5. ROBÔ 🤖 ───────────────────────────────────────────────────────
export function CharRobot({ mood }) {
  const h = mood === 'happy', n = mood === 'normal'
  const s = mood === 'sad',   c = mood === 'critical'
  return (
    <div className={`char char-${mood}`}>
      {h && <><div className="star st1">⚡</div><div className="star st2">✨</div><div className="star st3">💡</div></>}

      {/* Antenna */}
      <div className="robot-ant">
        <div className={`ant-ball${h?' aball-on':c?' aball-err':' aball-off'}`} />
      </div>

      {/* Head */}
      <div className="robot-head">
        <div className="robot-ear re-l" /><div className="robot-ear re-r" />
        <div className="robot-screen">
          <div className="robot-eyes-row">
            {[0,1].map(i => (
              <div key={i} className={`r-led${h?' led-c':c?' led-r':s?' led-b':' led-w'}`}>
                {h?'◉':c?'✕':s?'◔':'●'}
              </div>
            ))}
          </div>
          <div className={`r-mouth rm-${mood}`}>
            {h&&'▲▲▲'}{n&&'━━━'}{s&&'▽▽▽'}{c&&'×××'}
          </div>
          <div className="r-water-bar">
            <div className="r-water-fill" style={{width:`${h?90:n?60:s?28:7}%`}} />
          </div>
        </div>
        {(h||n) && <><div className="cheek cl r-cheek" /><div className="cheek cr r-cheek" /></>}
      </div>

      {/* Body */}
      <div className="robot-body">
        <div className="r-chest-light" style={{background:h?'#00d4ff':c?'#f87171':'#475569'}} />
        <div className="water-fill r-wf" style={{
          height:`${h?75:n?50:s?22:5}%`,
          background:'linear-gradient(0deg,rgba(0,212,255,.35),rgba(0,150,200,.1))',
          borderRadius:'0 0 8px 8px'
        }} />
      </div>

      <div className={`arm arm-l arm-${mood} r-arm`} />
      <div className={`arm arm-r arm-${mood} r-arm`} />
      <div className="robot-legs"><div className="r-leg" /><div className="r-leg" /></div>
      {c && <div className="sweat r-smoke">💨</div>}
    </div>
  )
}

// ── 6. FANTASMINHA 👻 ────────────────────────────────────────────────
export function CharGhost({ mood }) {
  const h = mood === 'happy', n = mood === 'normal'
  const s = mood === 'sad',   c = mood === 'critical'
  return (
    <div className={`char char-${mood} ghost-char`}>
      {h && <><div className="star st1">✨</div><div className="star st2">👻</div><div className="star st3">💜</div></>}
      {h && [0,1,2].map(i => <div key={i} className={`bat bat${i}`}>🦇</div>)}

      <div className="ghost-body">
        <div className="body-shine ghost-shine" />
        <Face mood={mood} cls="ghost-face" />
        <div className="ghost-bottom" />
        <div className="water-fill ghost-wf" style={{
          height:`${h?80:n?50:s?24:5}%`,
          background:'linear-gradient(0deg,rgba(167,139,250,.5),rgba(196,181,253,.18))'
        }} />
        {n && <div className="zzz">💤</div>}
      </div>
    </div>
  )
}

// ── 7. FOGUINHO 🔥 ───────────────────────────────────────────────────
export function CharFire({ mood }) {
  const h = mood === 'happy', n = mood === 'normal'
  const s = mood === 'sad',   c = mood === 'critical'
  return (
    <div className={`char char-${mood} fire-char`}>
      {h && <><div className="star st1">⭐</div><div className="star st2">✨</div><div className="star st3">💛</div></>}

      <div className="fire-outer">
        <div className="fire-mid">
          <div className="fire-inner">
            <div className="face fire-face">
              <div className="eyes-row">
                {[0,1].map(i => (
                  <div key={i} className={`eye${h?' eye-happy':c?' eye-sg':s?' eye-sad':''}`}>
                    {h && <div className="eye-gleam" />}
                    {c && <span className="sg">🕶</span>}
                  </div>
                ))}
              </div>
              {(h||n) && <><div className="cheek cl f-cheek" /><div className="cheek cr f-cheek" /></>}
              <div className={`mouth mouth-${mood}`} />
              {s && <><div className="tear tl" /><div className="tear tr" /></>}
            </div>
          </div>
        </div>
      </div>

      {h && <><div className="spark sp0">✦</div><div className="spark sp1">✦</div><div className="spark sp2">✦</div></>}
      {c && <div className="sweat f-smoke">💨</div>}
    </div>
  )
}

// ── 8. NUVEM ☁️ ──────────────────────────────────────────────────────
export function CharCloud({ mood }) {
  const h = mood === 'happy', n = mood === 'normal'
  const s = mood === 'sad',   c = mood === 'critical'
  return (
    <div className={`char char-${mood} cloud-char`}>
      {h && <><div className="star st1">☀️</div><div className="star st2">✨</div></>}

      <div className="cloud-body">
        <div className="cloud-bump cb1" /><div className="cloud-bump cb2" /><div className="cloud-bump cb3" />
        <div className="cloud-shine" />
        <Face mood={mood} cls="cloud-face" />
        {n && <div className="zzz cloud-zzz">💤</div>}
        {c && <div className="lightning">⚡</div>}
        {(s||c) && [0,1,2,3].map(i => <div key={i} className={`rain rd${i}`}>💧</div>)}
      </div>
    </div>
  )
}

// ── Router ────────────────────────────────────────────────────────────
const MAP = {
  drop: CharDrop, dino: CharDino, whale: CharWhale, plant: CharPlant,
  robot: CharRobot, ghost: CharGhost, fire: CharFire, cloud: CharCloud,
}

export function TamaCharacter({ avatarId, mood, size = 120 }) {
  const Comp = MAP[avatarId] || CharDrop
  return (
    <div style={{ transform:`scale(${size/120})`, transformOrigin:'center bottom', display:'inline-block' }}>
      <Comp mood={mood} />
    </div>
  )
}
