import { SPRITES } from './sprites.js'

// ── TamaCharacter ─────────────────────────────────────────────────────────────
// Uses the real reference sprites extracted from the design image.
// Animations are applied as CSS classes on top of the images.

export function TamaCharacter({ avatarId, mood, size = 120 }) {
  const id   = avatarId || 'drop'
  const moodKey = mood === 'happy'    ? 'happy'
                : mood === 'normal'   ? 'normal'
                : mood === 'sad'      ? 'sad'
                : mood === 'critical' ? 'critical'
                : 'normal'

  const src = SPRITES[id]?.[moodKey] || SPRITES['drop']?.[moodKey]
  if (!src) return null

  // Scale factor (base sprite is 140×110)
  const scale = size / 120
  const w = Math.round(140 * scale)
  const h = Math.round(110 * scale)

  // Pick animation class based on mood
  const animClass = mood === 'happy'    ? 'tama-bounce'
                  : mood === 'normal'   ? 'tama-float'
                  : mood === 'sad'      ? 'tama-droop'
                  : mood === 'critical' ? 'tama-shake'
                  : 'tama-float'

  // Extra effect overlays
  const showSparkle = mood === 'happy'
  const showSweat   = mood === 'critical'

  return (
    <div
      className={`tama-wrapper ${animClass}`}
      style={{ width: w, height: h, position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* Main sprite image */}
      <img
        src={src}
        alt={id}
        width={w}
        height={h}
        style={{
          imageRendering: 'auto',
          filter: mood === 'critical'
            ? 'brightness(.75) saturate(.4) contrast(1.1)'
            : mood === 'sad'
            ? 'brightness(.85) saturate(.7)'
            : mood === 'happy'
            ? 'brightness(1.08) saturate(1.2) drop-shadow(0 0 8px rgba(255,255,255,.4))'
            : 'none',
          transition: 'filter .5s ease',
          userSelect: 'none',
          pointerEvents: 'none',
          display: 'block',
        }}
      />

      {/* Glow ring when happy */}
      {showSparkle && (
        <>
          <div className="tama-glow-ring" style={{ width: w * 0.85, height: h * 0.85 }} />
          <span className="tama-star ts1">✨</span>
          <span className="tama-star ts2">⭐</span>
          <span className="tama-star ts3">💫</span>
        </>
      )}

      {/* Critical: sweat drop + warning */}
      {showSweat && (
        <>
          <span className="tama-sweat">💦</span>
          <span className="tama-warn">!</span>
        </>
      )}
    </div>
  )
}

// ── Onboarding avatar preview (static, happy) ─────────────────────────────────
export function AvatarPreview({ avatarId, selected }) {
  const src = SPRITES[avatarId]?.happy
  if (!src) return null
  return (
    <img
      src={src}
      alt={avatarId}
      style={{
        width: 72,
        height: 56,
        objectFit: 'contain',
        filter: selected ? 'brightness(1.1) drop-shadow(0 0 6px rgba(0,212,255,.6))' : 'brightness(.9)',
        transition: 'filter .2s',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    />
  )
}
