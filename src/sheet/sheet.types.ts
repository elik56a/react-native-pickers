import type React from 'react';

export interface SheetContentProps {
  children: React.ReactNode;
  /** Narrower side padding, for content with its own inner spacing (e.g. a calendar). */
  compact?: boolean;
}
