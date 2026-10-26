import type { ReactNode } from 'react';

import type { ValueOf } from '../home.types';
import type { PLATFORM } from './device.constants';

export type Platform = ValueOf<typeof PLATFORM>;

/** Renders the app inside the device; `screenHeight` is the inner height of the mock screen once measured. */
export type RenderScreen = (platform: Platform, screenHeight?: number) => ReactNode;
