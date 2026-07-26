import type { Metadata } from 'next';
import { DesignApp } from '@/components/design-app';
import { routeServerMetadata } from '@/design/route-metadata';

export const metadata: Metadata = {
  ...routeServerMetadata('shop'),
  alternates: { canonical: '/shop' },
};

export default function CatalogPage() {
  return <DesignApp />;
}
