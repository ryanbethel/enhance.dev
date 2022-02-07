export default function handleFlash({ session, context, newFlash }) {
  let sessionFlash = Array.isArray(session?.flash) ? session.flash : []
  if (newFlash) sessionFlash = sessionFlash.concat(newFlash)
  const flashHere = sessionFlash.filter((i) => i?.context === context)
  const flashLeft = sessionFlash.filter((i) => i?.context !== context)
  const newSession = { ...session, flash: flashLeft }
  return { flashHere, newSession, flashLeft }
}
