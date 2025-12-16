"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the actual map display component
const MapDisplay = dynamic(() => import('./MapDisplay'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-500">Loading map...</div>,
});

export default function ClientMapContent(props: React.ComponentProps<typeof MapDisplay>) {
  return <MapDisplay {...props} />;
}