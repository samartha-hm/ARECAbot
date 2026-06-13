# ARECAbot Code Style Guide

This document outlines the code style and conventions used in the ARECAbot project to ensure consistency and maintainability.

## Table of Contents

- [TypeScript](#typescript)
- [React](#react)
- [File Organization](#file-organization)
- [Naming Conventions](#naming-conventions)
- [Comments & Documentation](#comments--documentation)
- [Imports & Exports](#imports--exports)
- [Error Handling](#error-handling)
- [Testing](#testing)

---

## TypeScript

### Strict Mode

All code must pass TypeScript strict mode:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

### Type Annotations

Always provide explicit type annotations:

```typescript
// ✅ Good
const motorSpeed: number = 140;
const isConnected: boolean = false;
function calculateDistance(value: number): number {
  return value * 100;
}

// ❌ Bad - Implicit any
const motorSpeed = 140;
function calculateDistance(value) {
  return value * 100;
}
```

### Interface Definitions

Use interfaces for object shapes:

```typescript
// ✅ Good
interface TelemetryData {
  us: number | null;
  temp: number | null;
  pressure: number | null;
  state: string;
  pos: [number, number] | null;
  dir: string;
}

// ❌ Bad - Object without interface
const telemetry: any = {};
const telemetry: Record<string, any> = {};
```

### Union Types

Be specific with union types:

```typescript
// ✅ Good
type CommandType = 'FORWARD' | 'BACK' | 'LEFT' | 'RIGHT' | 'STOP';
type MessageType = 'tx' | 'rx' | 'sys';

// ❌ Bad - Too generic
type CommandType = string;
type MessageType = any;
```

### Null Handling

Use optional chaining and nullish coalescing:

```typescript
// ✅ Good
const distance = telemetry.us ?? 0;
const temperature = data?.temperature ?? null;

// ❌ Bad
const distance = telemetry.us || 0;  // Fails for 0 values
const temperature = data.temperature || null;
```

---

## React

### Component Declaration

Use functional components with TypeScript:

```typescript
// ✅ Good
interface SpeedControlProps {
  label: string;
  value: number;
  onCommit: (value: number) => void;
}

export function SpeedControl({ label, value, onCommit }: SpeedControlProps) {
  const [localVal, setLocalVal] = useState<string>(value.toString());
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// ❌ Bad - Default export, unclear props
export default function SpeedControl(props) {
  return <div>{props.label}</div>;
}
```

### Hooks Usage

Follow hooks rules:

```typescript
// ✅ Good - Hooks at top level
function Component() {
  const [state, setState] = useState<number>(0);
  
  useEffect(() => {
    return () => {
      // Cleanup
    };
  }, [dependency]);
}

// ❌ Bad - Conditional hooks
function Component() {
  if (condition) {
    const [state, setState] = useState(0);  // ❌ Wrong!
  }
}
```

### useCallback and useMemo

Use to optimize performance where necessary:

```typescript
// ✅ Good - Memoized callback
const handleCommand = useCallback((cmd: string) => {
  api.sendCmd(cmd);
}, []);

// ✅ Good - Expensive computation
const normalizedData = useMemo(() => {
  return normalizeTelemetry(data);
}, [data]);
```

### Props Pattern

Always destructure props with types:

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

function Button({ label, onClick, disabled = false, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}

// ❌ Bad
function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### Key Prop

Always provide stable keys for lists:

```typescript
// ✅ Good
{logs.map((log) => (
  <div key={log.id}>{log.message}</div>
))}

// ❌ Bad - Using index as key
{logs.map((log, index) => (
  <div key={index}>{log.message}</div>
))}
```

---

## File Organization

### Directory Structure

```
src/
├── App.tsx              # Main component
├── index.tsx            # Entry point
├── types.ts             # Type definitions
├── components/          # Reusable components
│   ├── Button.tsx
│   ├── Card.tsx
│   └── index.ts         # Barrel exports
├── services/            # Business logic
│   ├── api.ts
│   └── telemetry.ts
├── hooks/               # Custom hooks
│   ├── useWebSocket.ts
│   └── useRobot.ts
└── utils/               # Utility functions
    ├── formatting.ts
    └── validation.ts
```

### File Naming

- **Components**: PascalCase: `Button.tsx`, `TelemetryCard.tsx`
- **Services**: camelCase: `api.ts`, `telemetry.ts`
- **Types**: camelCase: `types.ts`, `constants.ts`
- **Tests**: Same as source + `.test.ts`: `Button.test.tsx`

### Exports

Use barrel exports for cleaner imports:

```typescript
// components/index.ts
export { Button } from './Button';
export { Card } from './Card';
export type { ButtonProps } from './Button';

// Usage
import { Button, Card } from './components';  // ✅ Clean
// vs
import { Button } from './components/Button';  // Still fine
```

---

## Naming Conventions

### Variables & Functions

Use camelCase:

```typescript
// ✅ Good
const motorSpeed = 140;
const isConnected = false;
function calculateDistance() {}
const handleButtonClick = () => {};

// ❌ Bad
const motor_speed = 140;
const MotorSpeed = 140;
const MOTOR_SPEED = 140;
function Calculate_Distance() {}
```

### Classes & Interfaces

Use PascalCase:

```typescript
// ✅ Good
interface TelemetryData {}
class RobotController {}
type CommandType = 'FORWARD' | 'BACK';

// ❌ Bad
interface telemetryData {}
class robotController {}
```

### Constants

Use UPPER_SNAKE_CASE:

```typescript
// ✅ Good
const ROBOT_HOST = '192.168.4.1';
const ROBOT_PORT = 8765;
const MAX_SPEED = 255;
const MIN_SPEED = 0;

// ❌ Bad
const robotHost = '192.168.4.1';
const RobotPort = 8765;
```

### React Components

Always PascalCase:

```typescript
// ✅ Good
function SpeedControl() {}
function MovementButton() {}
function TelemetryCard() {}

// ❌ Bad
function speedControl() {}
function movement_button() {}
```

### Event Handlers

Prefix with `handle` or `on`:

```typescript
// ✅ Good
const handleButtonClick = () => {};
const handleMotorSpeedChange = (value: number) => {};
const onConnectionChange = (connected: boolean) => {};

// ❌ Bad
const click = () => {};
const motorSpeedChange = () => {};
const connection = () => {};
```

---

## Comments & Documentation

### JSDoc Comments

Document public functions and interfaces:

```typescript
// ✅ Good
/**
 * Sends a command to the robot via WebSocket.
 * 
 * @param cmd - Command string (e.g., 'F', 'STOP')
 * @throws Error if connection is not established
 * @example
 * api.sendCmd('F');
 */
export function sendCmd(cmd: string): void {
  // ...
}

/**
 * Telemetry data from robot sensors
 * @property us - Ultrasonic distance in centimeters
 * @property temp - Temperature in Celsius
 * @property pos - Robot position [x, y]
 */
export interface TelemetryData {
  us: number | null;
  temp: number | null;
  pos: [number, number] | null;
}
```

### Inline Comments

Use for non-obvious logic:

```typescript
// ✅ Good - Explains why
// Normalize telemetry field names from different firmware versions
const normalizeTelemetry = (d: any): Partial<TelemetryData> => {
  return {
    us: d.us ?? d.US,    // us or US field depending on firmware
    temp: d.temp ?? d.T, // temp or T field
  };
};

// ❌ Bad - Obvious
// Set x to 5
const x = 5;

// ❌ Bad - Too much
// Loop through items starting at 0 and going to length
for (let i = 0; i < items.length; i++) {
  // Do something
}
```

### Section Comments

Use to organize large files:

```typescript
// ✅ Good
// =============================================
// STATE MANAGEMENT
// =============================================
const [connected, setConnected] = useState(false);

// =============================================
// EVENT HANDLERS
// =============================================
const handleMotorSpeed = (speed: number) => {};
```

---

## Imports & Exports

### Import Order

Follow this order:

```typescript
// 1. React/External libraries
import React, { useState, useCallback } from 'react';
import { Activity, Navigation } from 'lucide-react';

// 2. Internal imports (absolute)
import { api } from './services/api';
import { TelemetryData } from './types';

// 3. Relative imports
import { Button } from './components';

// Blank line between groups
```

### Named vs Default Exports

Prefer named exports:

```typescript
// ✅ Good - Named exports
export function Button() {}
export interface ButtonProps {}

// Requires explicit import
import { Button, ButtonProps } from './Button';

// ❌ Less preferred - Default export
export default function Button() {}

// Can import with any name
import MyButton from './Button';
```

---

## Error Handling

### Try-Catch

Use for async operations:

```typescript
// ✅ Good
try {
  await api.connect();
  setConnected(true);
} catch (error) {
  console.error('Connection failed:', error);
  setError(error instanceof Error ? error.message : 'Unknown error');
}

// Handle specific errors
try {
  await api.sendCmd(cmd);
} catch (error) {
  if (error instanceof ConnectionError) {
    // Handle connection error
  } else if (error instanceof ValidationError) {
    // Handle validation error
  }
}
```

### Error Boundaries (React)

Create for UI sections:

```typescript
// ✅ Good
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <div>Something went wrong</div>;
  }

  return children;
}
```

---

## Testing

### Test File Structure

```typescript
// ✅ Good structure
describe('Button Component', () => {
  describe('rendering', () => {
    it('should render with label', () => {
      // Test
    });

    it('should render with disabled state', () => {
      // Test
    });
  });

  describe('interactions', () => {
    it('should call onClick when clicked', () => {
      // Test
    });
  });
});
```

### Naming Tests

```typescript
// ✅ Good - Clear intent
it('should call api.sendCmd with "F" when forward button is clicked', () => {});
it('should display connected status when websocket connects', () => {});
it('should handle null telemetry data gracefully', () => {});

// ❌ Bad - Unclear
it('works', () => {});
it('test button', () => {});
it('handles data', () => {});
```

---

## Summary Checklist

Before committing code:

- [ ] TypeScript strict mode passes (`npx tsc --noEmit`)
- [ ] All functions/interfaces have type annotations
- [ ] Component props are destructured with types
- [ ] Comments explain "why", not "what"
- [ ] Naming follows conventions (camelCase, PascalCase, UPPER_SNAKE_CASE)
- [ ] Imports are organized by group
- [ ] No `any` types without good reason
- [ ] Error handling is implemented
- [ ] Files are well-organized in appropriate directories
- [ ] Build succeeds (`npm run build`)

