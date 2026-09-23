import { GLYPH } from '@/lib/phosphor';
export function Icon({ name, size = 16 }: { name: string; size?: number }) { return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 256 256" dangerouslySetInnerHTML={{ __html: GLYPH[name] ?? GLYPH['file-text'] }} />; }
