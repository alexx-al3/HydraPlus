import { SPRITES, SPRITE_SIZE } from './sprites.js'

// Frames per mood:
// Sheet column order: 0=idle, 1=happy, 2=laugh, 3=wink, 4=sad, 5=cry
// We animate subsets of frames depending on mood

const MOOD_FRAMES = {
  happy:    { start: 1, count: 3, fps: 4 },  // frames 1,2,3 → happy, laugh, wink
  normal:   { start: 0, count: 1, fps: 1 },  // frame 0 → idle (static float)
  sad:      { start: 4, count: 1, fps: 1 },  // frame 4 → sad (static droop)
  critical: { start: 5, count: 1, fps: 1 },  // frame 5 → cry/hurt
}

export function TamaCharacter({ avatarId, mood, size = 120 }) {
  const id   = avatarId || 'drop'
  const sheet = SPRITES[id] || SPRITES['drop']
  if (!sheet) return null

  const { start, count, fps } = MOOD_FRAMES[mood] || MOOD_FRAMES.normal

  // Scale from sheet's native 140px to requested size
  const scale     = size / SPRITE_SIZE
  const frameW    = Math.round(SPRITE_SIZE * scale)
  const frameH    = Math.round(SPRITE_SIZE * scale)
  const sheetW    = Math.round(SPRITE_SIZE * 6 * scale)  // 6 frames total

  // CSS animation: step through frames using background-position
  // Each step shifts background-position-x by -frameW
  const animDur   = count / fps
  const animName  = `tama_${id}_${mood}`

  // Body animation (bounce/float/droop/shake) depending on mood
  const bodyAnim  = mood === 'happy'    ? 'tamaBodyBounce'
                  : mood === 'normal'   ? 'tamaBodyFloat'
                  : mood === 'sad'      ? 'tamaBodyDroop'
                  : mood === 'critical' ? 'tamaBodyShake'
                  : 'tamaBodyFloat'

  const bodyDur   = mood === 'happy'    ? '0.6s'
                  : mood === 'normal'   ? '3s'
                  : mood === 'sad'      ? '2s'
                  : '0.3s'

  // Build inline keyframes for the sprite stepping
  const startX    = -(start * frameW)
  const endX      = -(start * frameW) - (count * frameW)

  const keyframes = count > 1
    ? `@keyframes ${animName} { from { background-position-x: ${startX}px } to { background-position-x: ${endX}px } }`
    : ''

  const showGlow  = mood === 'happy'
  const showSweat = mood === 'critical'

  return (
    <div className={`tama-outer tama-${mood}`}
      style={{
        width: frameW,
        height: frameH,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: `${bodyAnim} ${bodyDur} ease-in-out infinite`,
      }}
    >
      {/* Inject keyframes */}
      {keyframes && <style>{keyframes}</style>}

      {/* Sprite display */}
      <div style={{
        width: frameW,
        height: frameH,
        backgroundImage: `url("${sheet}")`,
        backgroundSize: `${sheetW}px ${frameH}px`,
        backgroundPositionX: `${startX}px`,
        backgroundPositionY: '0px',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'auto',
        animation: count > 1
          ? `${animName} ${animDur}s steps(${count}, end) infinite`
          : 'none',
        filter: mood === 'critical' ? 'brightness(.75) saturate(.5)'
              : mood === 'sad'      ? 'brightness(.85) saturate(.7)'
              : mood === 'happy'    ? 'brightness(1.05) drop-shadow(0 0 6px rgba(255,255,255,.35))'
              : 'none',
        transition: 'filter .4s ease',
      }} />

      {/* Happy glow ring */}
      {showGlow && (
        <>
          <div className="tama-glow-ring" style={{width: frameW*0.9, height: frameH*0.9}} />
          <span className="tama-star ts1">✨</span>
          <span className="tama-star ts2">⭐</span>
          <span className="tama-star ts3">💫</span>
        </>
      )}

      {/* Critical sweat */}
      {showSweat && (
        <>
          <span className="tama-sweat">💦</span>
          <span className="tama-warn">!</span>
        </>
      )}
    </div>
  )
}

// Simple static preview (used in avatar selector)
export function AvatarPreview({ avatarId, selected }) {
  const sheet = SPRITES[avatarId] || SPRITES['drop']
  if (!sheet) return null
  const sz = 68
  const sheetW = Math.round(SPRITE_SIZE * 6 * (sz / SPRITE_SIZE))
  return (
    <div style={{
      width: sz, height: sz,
      backgroundImage: `url("${sheet}")`,
      backgroundSize: `${sheetW}px ${sz}px`,
      backgroundPositionX: '0px',
      backgroundRepeat: 'no-repeat',
      imageRendering: 'auto',
      filter: selected ? 'brightness(1.1) drop-shadow(0 0 6px rgba(0,212,255,.6))' : 'brightness(.9)',
      transition: 'filter .2s',
    }} />
  )
}
