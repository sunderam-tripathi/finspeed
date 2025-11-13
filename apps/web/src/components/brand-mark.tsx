import Image from 'next/image';
import wordmarkLight from '@/assets/brand/finspeed-wordmark-light.svg';
import wordmarkDark from '@/assets/brand/finspeed-wordmark-dark.svg';
import markLight from '@/assets/brand/finspeed-mark-light.svg';
import markDark from '@/assets/brand/finspeed-mark-dark.svg';

type BrandMarkProps = {
  tone?: 'light' | 'dark';
  label?: string;
  className?: string;
  textClassName?: string;
  priority?: boolean;
};

export function BrandMark({
  tone = 'light',
  label = 'Finspeed',
  className = '',
  textClassName = 'text-sm font-semibold tracking-tight text-[var(--foreground)]',
  priority
}: BrandMarkProps) {
  const mark = tone === 'dark' ? markDark : markLight;
  const wordmark = tone === 'dark' ? wordmarkDark : wordmarkLight;
  const container = ['inline-flex items-center gap-3', className].filter(Boolean).join(' ');
  return (
    <span className={container} aria-label={label} role="img">
      <Image src={mark} alt="" aria-hidden width={32} height={32} className="h-8 w-8" priority={priority} />
      <Image src={wordmark} alt="" aria-hidden width={140} height={36} className="h-6 w-auto" priority={priority} />
      <span className={textClassName}>{label}</span>
    </span>
  );
}
