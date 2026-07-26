import type { Metadata } from 'next';
import { DesignApp } from '@/components/design-app';
import { routeServerMetadata } from '@/design/route-metadata';

export const metadata: Metadata = routeServerMetadata('about');

export default function BrandStoryPage() {
  return <DesignApp />;
}
