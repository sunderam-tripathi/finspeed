import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DesignApp } from '@/components/design-app';
import { designPathMetadata, routeServerMetadata } from '@/design/route-metadata';

type DesignRouteParams = { designPath: string[] };

export async function generateMetadata({
  params,
}: {
  params: Promise<DesignRouteParams>;
}): Promise<Metadata> {
  const { designPath } = await params;
  return designPathMetadata(designPath) ?? routeServerMetadata('not-found');
}

export default async function DesignedRoutePage({
  params,
}: {
  params: Promise<DesignRouteParams>;
}) {
  const { designPath } = await params;
  if (!designPathMetadata(designPath)) notFound();
  return <DesignApp />;
}
