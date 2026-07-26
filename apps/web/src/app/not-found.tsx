import type { Metadata } from 'next';
import Link from 'next/link';
import { routeServerMetadata } from '@/design/route-metadata';

export const metadata: Metadata = routeServerMetadata('not-found');

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '2rem',
        textAlign: 'center',
        background: 'var(--fs-page-gradient, var(--fs-bg-dark, #050509))',
        color: 'var(--fs-text-primary, #f5f7fb)',
      }}
    >
      <p
        style={{
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          fontSize: '0.75rem',
          color: 'var(--fs-primary, #40b0d0)',
        }}
      >
        404
      </p>
      <h1 style={{ fontSize: '2rem', lineHeight: 1.2, maxWidth: '28rem' }}>
        This page does not exist.
      </h1>
      <p style={{ color: 'var(--fs-text-muted, rgba(230, 235, 248, 0.75))', maxWidth: '28rem' }}>
        The address may be mistyped, or the page may have moved.
      </p>
      <Link
        href="/"
        style={{
          marginTop: '0.5rem',
          padding: '0.75rem 1.5rem',
          border: '1px solid var(--fs-border, #252637)',
          borderRadius: '999px',
          color: 'var(--fs-text-primary, #f5f7fb)',
          textDecoration: 'none',
        }}
      >
        Back to the storefront
      </Link>
    </main>
  );
}
