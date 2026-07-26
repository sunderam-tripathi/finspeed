import type { Metadata } from 'next';
import { DesignApp } from '@/components/design-app';
import { routeServerMetadata } from '@/design/route-metadata';

export const metadata: Metadata = routeServerMetadata('support');

export default function SupportPage() {
  return <DesignApp />;
}
