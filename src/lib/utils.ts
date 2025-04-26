import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAccentColor(accentColor: string): string {
  const colors: Record<string, string> = {
    'perx-blue': '#b7d0f7',
    'perx-canopy': '#b9f0df',
    'perx-rust': '#fadac8',
    'perx-gold': '#eddfc5',
    'perx-azalea': '#f0c7db',
    'perx-navy': '#b6c7e3',
  };
  return colors[accentColor] || '#FFFFFF'; // Default to white if color is not found
}

export function getPrimaryAccentColor(accentColor: string): string {
  const primaryColors: Record<string, string> = {
    'perx-blue': '#0061FE',
    'perx-canopy': '#0F503C',
    'perx-rust': '#BE4B0A',
    'perx-gold': '#9B6400',
    'perx-azalea': '#CD2F7B',
    'perx-navy': '#283750',
  };

  return primaryColors[accentColor] || '#FFFFFF';
}
