export function getSafeNextPath(next: string | null) {
  if (!next) return "/"
  if (!next.startsWith("/")) return "/"
  if (next.startsWith("//")) return "/"
  return next
}

