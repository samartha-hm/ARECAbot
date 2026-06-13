# Contributing to ARECAbot

Thank you for your interest in contributing to ARECAbot! We welcome contributions from the community and appreciate your help in making this project better.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please read and adhere to our Code of Conduct:

- **Be Respectful**: Treat all community members with respect and dignity
- **Be Inclusive**: Welcome people of all backgrounds and experiences
- **Be Collaborative**: Work together constructively
- **Be Professional**: Keep discussions focused and productive
- **Report Issues**: If you witness unacceptable behavior, please report it

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: Latest stable version
- **Code Editor**: VS Code (recommended) with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint
  - TypeScript Vue Plugin

### Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR-USERNAME/ARECAbot.git
cd ARECAbot

# Add upstream remote
git remote add upstream https://github.com/samartha-hm/ARECAbot.git

# Verify remotes
git remote -v
# origin    https://github.com/YOUR-USERNAME/ARECAbot.git (fetch)
# origin    https://github.com/YOUR-USERNAME/ARECAbot.git (push)
# upstream  https://github.com/samartha-hm/ARECAbot.git (fetch)
# upstream  https://github.com/samartha-hm/ARECAbot.git (push)
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

---

## Development Workflow

### 1. Create Feature Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch with descriptive name
git checkout -b feature/add-robot-battery-indicator
# or
git checkout -b fix/websocket-reconnection-issue
# or
git checkout -b docs/update-api-documentation
```

**Branch Naming Convention:**
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions
- `perf/description` - Performance improvements

### 2. Make Changes

```bash
# Make your changes
# Keep commits small and focused

# Stage changes
git add .

# Commit with descriptive message (see Commit Guidelines)
git commit -m "feat: add battery level indicator to telemetry dashboard"
```

### 3. Keep Branch Updated

```bash
# Before submitting PR, sync with upstream
git fetch upstream
git rebase upstream/main

# If conflicts occur, resolve them manually
# Then continue rebase
git rebase --continue
```

### 4. Test Your Changes

```bash
# Run type checking
npx tsc --noEmit

# Build for production
npm run build

# Test the build
npm run preview
```

### 5. Push to Your Fork

```bash
git push origin feature/add-robot-battery-indicator
```

### 6. Create Pull Request

Go to GitHub and create a pull request from your fork to the main repository.

---

## Commit Guidelines

Follow conventional commit format for clear, semantic commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **refactor**: Code refactoring without feature/fix changes
- **perf**: Performance improvement
- **test**: Adding missing tests
- **chore**: Changes to build process, dependencies, etc.
- **style**: Code style changes (formatting, semicolons, etc.)
- **ci**: CI/CD configuration changes

### Scope

The area affected:
- `api` - WebSocket API client
- `ui` - User interface components
- `types` - Type definitions
- `telemetry` - Telemetry-related features
- `control` - Control features
- `docs` - Documentation
- `build` - Build configuration

### Subject

- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period (.) at the end
- Limit to 50 characters

### Body

- Explain what and why, not how
- Wrap at 72 characters
- Separate from subject with blank line
- Include any breaking changes

### Footer

- Reference issues: `Closes #123`, `Fixes #456`
- Include breaking changes: `BREAKING CHANGE: description`

### Examples

```
feat(ui): add battery level indicator

Display current battery percentage in telemetry dashboard.
Update telemetry data structure to include battery level.

Closes #42
```

```
fix(api): resolve websocket reconnection issue

Previously, connection would not automatically reconnect on network loss.
Now implements exponential backoff reconnection strategy.

Fixes #89
```

```
docs(readme): update installation instructions

Add Node.js version requirements and clarify setup steps.

BREAKING CHANGE: Requires Node.js 18.0.0 or higher
```

---

## Pull Request Process

### Before Submitting

1. **Update your fork**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Type check**
   ```bash
   npx tsc --noEmit
   ```

3. **Build and test**
   ```bash
   npm run build
   npm run preview
   ```

4. **Review your own changes** - Read through your code as if you're reviewing someone else's

### Creating the PR

1. **Title**: Use the same format as commit messages
   - ✅ `feat: add battery level indicator to telemetry`
   - ❌ `Update dashboard`
   - ❌ `Fixed stuff`

2. **Description**: Include:
   - What changes were made
   - Why these changes were needed
   - How to test the changes
   - Any breaking changes
   - Related issues

### Example PR Description

```markdown
## Description
Adds a real-time battery level indicator to the telemetry dashboard, allowing operators to monitor power status during operation.

## Motivation
Operators need to know battery status without switching to separate monitoring tools. This improves operational safety and efficiency.

## Changes
- Added `battery: number` to `TelemetryData` interface
- Created `BatteryIndicator` component with visual indicator
- Integrated battery data normalization in `App.tsx`
- Updated WebSocket protocol documentation

## Testing
1. Connect to robot and verify battery data is received
2. Confirm battery indicator displays correctly (0-100%)
3. Test low battery warning (< 20%)
4. Verify responsive layout on mobile devices

## Checklist
- [x] Code follows TypeScript strict mode
- [x] Changes are documented
- [x] Type checking passes
- [x] Build succeeds
- [x] No console errors

## Related Issues
Closes #42
Relates to #38
```

### During Review

- **Be responsive**: Address review comments promptly
- **Ask questions**: If feedback is unclear, ask for clarification
- **Be open**: Consider suggestions with an open mind
- **Request re-review**: After making changes, request another review

### Approval & Merge

- [ ] At least one approval from maintainers
- [ ] All CI checks pass
- [ ] No conflicting changes
- [ ] All conversations resolved

---

## Coding Standards

### TypeScript

**Strict Mode**: All code must pass TypeScript strict mode
```bash
npx tsc --noEmit
```

**Type Definitions**:
```typescript
// ✅ Good: Explicit types
interface TelemetryData {
  us: number | null;
  temp: number | null;
  pressure: number | null;
  state: string;
  pos: [number, number] | null;
  dir: string;
}

function processTelemetry(data: TelemetryData): void {
  // ...
}

// ❌ Bad: Using any
function processTelemetry(data: any): void {
  // ...
}
```

**Naming Conventions**:
```typescript
// Variables and functions: camelCase
const motorSpeed = 140;
function calculateDistance(): number {}

// Classes and interfaces: PascalCase
interface TelemetryData {}
class RobotController {}

// Constants: UPPER_SNAKE_CASE
const ROBOT_HOST = '192.168.4.1';
const ROBOT_PORT = 8765;

// React components: PascalCase
function MovementControl() {}
function TelemetryDisplay() {}
```

### React

**Hooks Usage**:
```typescript
// ✅ Good: Proper hook usage
function Component() {
  const [state, setState] = useState(0);
  
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    };
  }, [dependencies]);
}

// ❌ Bad: Hooks in conditional
function Component() {
  if (condition) {
    const [state, setState] = useState(0);
  }
}
```

**Component Structure**:
```typescript
// ✅ Good organization
interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function SpeedControl({ label, value, onChange }: Props) {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = useCallback((newValue: number) => {
    setLocalValue(newValue);
    onChange(newValue);
  }, [onChange]);

  return (
    <div className="speed-control">
      {/* JSX */}
    </div>
  );
}
```

**Props Destructuring**:
```typescript
// ✅ Good: Destructure with types
function Button({ label, onClick, disabled = false }: Props) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}

// ❌ Avoid: Passing full props object
function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### Styling

Use Tailwind CSS classes:
```tsx
// ✅ Good: Tailwind utilities
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-lg font-bold text-gray-900">Title</h2>
</div>

// ❌ Avoid: Inline styles
<div style={{ backgroundColor: 'white', padding: '24px' }}>
  <h2 style={{ fontSize: '18px' }}>Title</h2>
</div>
```

### Comments

```typescript
// ✅ Good: Clear, useful comments
// Calculate distance using ultrasonic sensor reading
const distanceInCm = (sensorReading * 340) / 2;

// Normalize telemetry field names from different firmware versions
const normalizeTelemetry = (d: any): Partial<TelemetryData> => {
  return {
    us: d.us ?? d.US,      // us or US field
    temp: d.temp ?? d.T,   // temp or T field
    // ...
  };
};

// ❌ Bad: Obvious or unhelpful comments
// Set variable
const x = 5;

// Loop through array
for (let i = 0; i < items.length; i++) {
  // Do something
}
```

---

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

```bash
# 1. Development build
npm run dev
# - Verify feature works as expected
# - Check browser console for errors
# - Test on multiple browsers/devices

# 2. Production build
npm run build
npm run preview
# - Confirm build succeeds
# - Test functionality in production build
# - Verify no console errors
# - Check performance is acceptable

# 3. Type checking
npx tsc --noEmit
# - Ensure all types are correct
# - No implicit any types
```

### Feature Testing Template

```markdown
## Testing Checklist

### [Feature Name]
- [ ] Feature works as intended
- [ ] Works on Chrome (latest)
- [ ] Works on Firefox (latest)
- [ ] Works on Safari (latest)
- [ ] Works on mobile (iOS/Android)
- [ ] No console errors
- [ ] No console warnings
- [ ] TypeScript strict mode passes
- [ ] Build succeeds
- [ ] Production build works

### Edge Cases
- [ ] Handles null/undefined data
- [ ] Works with slow network
- [ ] Handles connection loss gracefully
- [ ] Responsive layout works correctly
```

---

## Documentation

### When to Document

- New features
- API changes
- Configuration options
- Complex logic
- Breaking changes

### Documentation Levels

#### 1. Code Comments
```typescript
/**
 * Sends a command to the robot via WebSocket.
 * 
 * @param cmd - Command string (e.g., 'F', 'STOP', 'LSPD 255')
 * @throws Error if connection is not established
 * @example
 * api.sendCmd('F');  // Move forward
 */
function sendCmd(cmd: string): void {
  // ...
}
```

#### 2. README Updates
Update relevant sections in `README.md` for:
- New features
- API changes
- Configuration updates
- Troubleshooting additions

#### 3. CHANGELOG
Document breaking changes and major features in version sections

### Documentation Standards

- **Clarity**: Write for users who are unfamiliar with the code
- **Examples**: Include code examples for complex features
- **Completeness**: Document all parameters and return values
- **Accuracy**: Keep documentation in sync with code
- **Structure**: Use clear headings and organization

---

## Issue Reporting

### Before Creating an Issue

- Search existing issues to avoid duplicates
- Check if the issue is mentioned in documentation
- Try to reproduce the issue locally

### Creating an Issue

Use the appropriate template:

#### Bug Report

```markdown
## Description
[Clear description of the bug]

## Steps to Reproduce
1. [First step]
2. [Second step]
3. [Additional steps...]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Node.js Version: [e.g., 18.0.0]
- ARECAbot Version: [e.g., 0.0.0]

## Screenshots
[If applicable]

## Additional Context
[Any other relevant information]
```

#### Feature Request

```markdown
## Description
[Clear description of the feature]

## Motivation
[Why is this feature needed?]

## Proposed Solution
[How should this feature work?]

## Alternatives Considered
[Other approaches you've considered]

## Additional Context
[Any other relevant information]
```

---

## Questions & Support

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and discussions
- **Email**: For sensitive matters

---

## Recognition

Contributors are recognized in:
- Pull request thank-you comments
- Monthly contributor highlights
- Project CHANGELOG

Thank you for contributing to ARECAbot! 🎉

