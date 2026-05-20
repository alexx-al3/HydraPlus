// ─── Shared face parts ────────────────────────────────────────────────────────
function Eyes({ mood }) {
  const h=mood==='happy', c=mood==='critical', s=mood==='sad'
  return (
    <div className="eyes-row">
      {[0,1].map(i=>(
        <div key={i} className={`eye${h?' eye-happy':c?' eye-x':s?' eye-sad':''}`}>
          {h && <div className="eye-gleam"/>}
          {c && <span className="eye-x-mark">✕</span>}
        </div>
      ))}
    </div>
  )
}
function Face({ mood, cls }) {
  const h=mood==='happy', s=mood==='sad', c=mood==='critical', n=mood==='normal'
  return (
    <div className={`drop-face ${cls||''}`}>
      <Eyes mood={mood}/>
      {(h||n) && <><div className="cheek cheek-l"/><div className="cheek cheek-r"/></>}
      <div className={`mouth mouth-${mood}`}/>
      {(s||c) && <><div className="tear tear-l"/><div className="tear tear-r"/></>}
    </div>
  )
}

// ─── Gotinha ──────────────────────────────────────────────────────────────────
export function CharDrop({ mood }) {
  const h=mood==='happy', s=mood==='sad', c=mood==='critical', n=mood==='normal'
  return (
    <div className={`char-wrap char-${mood}`}>
      {h && <div className="splash-ring"/>}
      {h && [0,1,2,3,4,5].map(i=><div key={i} className={`splash-drop sp${i}`}>💧</div>)}
      <div className="drop-body">
        <div className="drop-shine"/>
        <Face mood={mood}/>
        <div className="body-water" style={{height:`${h?88:n?62:s?32:10}%`}}/>
        {h && <><div className="bubble b1"/><div className="bubble b2"/><div className="bubble b3"/></>}
      </div>
      <div className={`arm arm-l arm-${mood}`}/>
      <div className={`arm arm-r arm-${mood}`}/>
      {h && <><div className="star s1">✨</div><div className="star s2">⭐</div><div className="star s3">💫</div></>}
      {n && <div className="zzz-badge">💤</div>}
      {c && <div className="sweat-drop">💦</div>}
    </div>
  )
}

// ─── Dino ─────────────────────────────────────────────────────────────────────
export function CharDino({ mood }) {
  const h=mood==='happy', s=mood==='sad', c=mood==='critical', n=mood==='normal'
  return (
    <div className={`char-wrap char-${mood}`}>
      {h && <><div className="star s1">✨</div><div className="star s2">💫</div><div className="star s3">⭐</div></>}
      <div className="dino-spikes">
        {[0,1,2,3].map(i=><div key={i} className={`dino-spike ds${i}${h?' spike-happy':''}`}/>)}
      </div>
      <div className="dino-body">
        <div className="dino-shine"/>
        <Face mood={mood} cls="dino-face"/>
        <div className="body-water dino-water" style={{height:`${h?85:n?58:s?28:8}%`,background:'linear-gradient(0deg,rgba(80,220,80,.5),rgba(120,255,100,.2))'}}/>
      </div>
      <div className={`arm arm-l arm-${mood} dino-arm`}/>
      <div className={`arm arm-r arm-${mood} dino-arm`}/>
      <div className={`dino-tail${h?' tail-wag':''}`}/>
      {c && <div className="sweat-drop">💦</div>}
      {n && <div className="zzz-badge">💤</div>}
    </div>
  )
}

// ─── Baleia ───────────────────────────────────────────────────────────────────
export function CharWhale({ mood }) {
  const h=mood==='happy', s=mood==='sad', c=mood==='critical', n=mood==='normal'
  return (
    <div className={`char-wrap char-${mood} whale-wrap`}>
      {h && <div className="whale-spout">💦<br/>💦</div>}
      {h && <><div className="star s1">🌊</div><div className="star s2">✨</div></>}
      <div className="whale-body">
        <div className="whale-shine"/>
        <div className="whale-belly"/>
        <Face mood={mood} cls="whale-face"/>
        <div className="body-water" style={{height:`${h?80:n?52:s?22:5}%`,background:'linear-gradient(0deg,rgba(50,100,255,.4),rgba(100,180,255,.15))',borderRadius:'0 0 50px 50px'}}/>
        {n && <div className="zzz-badge whale-zzz">💤</div>}
      </div>
      <div className={`whale-tail${h?' tail-wag':''}`}/>
      {c && <div className="sweat-drop">💦</div>}
    </div>
  )
}

// ─── Plantinha ────────────────────────────────────────────────────────────────
export function CharPlant({ mood }) {
  const h=mood==='happy', s=mood==='sad', c=mood==='critical', n=mood==='normal'
  const leaves = h?3:n?2:s?1:0
  return (
    <div className={`char-wrap char-${mood}`}>
      {h && <><div className="star s1">✨</div><div className="star s2">💫</div><div className="star s3">⭐</div></>}
      <div className="plant-top">
        {h && <div className="plant-flower">🌸</div>}
        {Array.from({length:Math.max(1,leaves)}).map((_,i)=>(
          <div key={i} className={`plant-leaf pl${i}${h?' leaf-bounce':''}`}/>
        ))}
        <div className="plant-stem"/>
      </div>
      <div className="plant-body">
        <div className="plant-shine"/>
        <Face mood={mood} cls="plant-face"/>
        <div className="body-water" style={{height:`${h?85:n?55:s?25:8}%`,
          background:c?'linear-gradient(0deg,#92400e,#78350f)':s?'linear-gradient(0deg,#a16207,#92400e)':'linear-gradient(0deg,rgba(100,220,80,.5),rgba(150,255,100,.2))'}}/>
      </div>
      <div className="plant-pot"/>
      {c && <div className="sweat-drop">🥀</div>}
    </div>
  )
}

// ─── Robô ─────────────────────────────────────────────────────────────────────
export function CharRobot({ mood }) {
  const h=mood==='happy', s=mood==='sad', c=mood==='critical', n=mood==='normal'
  return (
    <div className={`char-wrap char-${mood}`}>
      {h && <><div className="star s1">⚡</div><div className="star s2">✨</div><div className="star s3">💡</div></>}
      <div className="robot-antenna">
        <div className={`antenna-ball${h?' aball-happy':c?' aball-crit':' aball-idle'}`}/>
      </div>
      <div className="robot-head">
        <div className="robot-ear robot-ear-l"/><div className="robot-ear robot-ear-r"/>
        <div className="robot-screen">
          <div className="robot-eyes-row">
            {[0,1].map(i=>(
              <div key={i} className={`robot-eye-led${h?' led-cyan':c?' led-red':s?' led-blue':' led-white'}`}>
                {h?'◉':c?'✕':s?'◔':'●'}
              </div>
            ))}
          </div>
          <div className={`robot-display-mouth rdm-${mood}`}>
            {h&&'▲▲▲'}{n&&'━━━'}{s&&'▽▽▽'}{c&&'×××'}
          </div>
          <div className="robot-water-bar">
            <div className="robot-water-fill" style={{width:`${h?90:n?60:s?30:8}%`}}/>
          </div>
        </div>
        {(h||n) && <><div className="cheek cheek-l robot-cheek"/><div className="cheek cheek-r robot-cheek"/></>}
      </div>
      <div className="robot-body">
        <div className="robot-chest-light" style={{background:h?'#00d4ff':c?'#f87171':'#475569'}}/>
        <div className="body-water robot-fill" style={{height:`${h?75:n?50:s?22:5}%`,background:'linear-gradient(0deg,rgba(0,212,255,.35),rgba(0,150,200,.1))',borderRadius:'0 0 8px 8px'}}/>
      </div>
      <div className={`arm arm-l arm-${mood} robot-arm`}/>
      <div className={`arm arm-r arm-${mood} robot-arm`}/>
      <div className="robot-legs"><div className="robot-leg"/><div className="robot-leg"/></div>
      {c && <div className="sweat-drop robot-smoke">💨</div>}
    </div>
  )
}

// ─── Fantasminha ──────────────────────────────────────────────────────────────
export function CharGhost({ mood }) {
  const h=mood==='happy', s=mood==='sad', c=mood==='critical', n=mood==='normal'
  return (
    <div className={`char-wrap char-${mood} ghost-wrap`}>
      {h && <><div className="star s1">✨</div><div className="star s2">👻</div><div className="star s3">💜</div></>}
      {h && [0,1,2].map(i=><div key={i} className={`bat bat${i}`}>🦇</div>)}
      <div className="ghost-body">
        <div className="ghost-shine"/>
        <Face mood={mood} cls="ghost-face"/>
        <div className="ghost-bottom"/>
        <div className="body-water ghost-water" style={{height:`${h?80:n?52:s?25:6}%`,background:'linear-gradient(0deg,rgba(167,139,250,.5),rgba(196,181,253,.18))'}}/>
        {n && <div className="zzz-badge">💤</div>}
      </div>
    </div>
  )
}

// ─── Foguinho ─────────────────────────────────────────────────────────────────
export function CharFire({ mood }) {
  const h=mood==='happy', s=mood==='sad', c=mood==='critical', n=mood==='normal'
  return (
    <div className={`char-wrap char-${mood} fire-wrap`}>
      {h && <><div className="star s1">⭐</div><div className="star s2">✨</div><div className="star s3">💛</div></>}
      <div className="fire-outer">
        <div className="fire-middle">
          <div className="fire-inner">
            <div className="drop-face fire-face">
              <div className="eyes-row">
                {[0,1].map(i=>(
                  <div key={i} className={`eye${h?' eye-happy':c?' eye-sunglass':s?' eye-sad':''}`}>
                    {h && <div className="eye-gleam"/>}
                    {c && <span className="sunglass">🕶</span>}
                  </div>
                ))}
              </div>
              {(h||n) && <><div className="cheek cheek-l fire-cheek"/><div className="cheek cheek-r fire-cheek"/></>}
              <div className={`mouth mouth-${mood}`}/>
              {s && <><div className="tear tear-l"/><div className="tear tear-r"/></>}
            </div>
          </div>
        </div>
      </div>
      {h && <><div className="spark sp0">✦</div><div className="spark sp1">✦</div><div className="spark sp2">✦</div></>}
      {c && <div className="sweat-drop fire-smoke">💨</div>}
    </div>
  )
}

// ─── Nuvem ────────────────────────────────────────────────────────────────────
export function CharCloud({ mood }) {
  const h=mood==='happy', s=mood==='sad', c=mood==='critical', n=mood==='normal'
  return (
    <div className={`char-wrap char-${mood} cloud-wrap`}>
      {h && <><div className="star s1">☀️</div><div className="star s2">✨</div></>}
      <div className="cloud-body">
        <div className="cloud-bump cb1"/><div className="cloud-bump cb2"/><div className="cloud-bump cb3"/>
        <div className="cloud-shine"/>
        <Face mood={mood} cls="cloud-face"/>
        {n && <div className="zzz-badge cloud-zzz">💤</div>}
        {c && <div className="lightning">⚡</div>}
        {(s||c) && [0,1,2,3].map(i=><div key={i} className={`rain-drop rd${i}`}>💧</div>)}
      </div>
    </div>
  )
}

// ─── Router ───────────────────────────────────────────────────────────────────
const MAP = { drop:CharDrop, dino:CharDino, whale:CharWhale, plant:CharPlant,
              robot:CharRobot, ghost:CharGhost, fire:CharFire, cloud:CharCloud }

export function TamaCharacter({ avatarId, mood, size=120 }) {
  const Comp = MAP[avatarId] || CharDrop
  return (
    <div style={{transform:`scale(${size/120})`,transformOrigin:'center bottom',display:'inline-block'}}>
      <Comp mood={mood}/>
    </div>
  )
}
