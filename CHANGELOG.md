# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive README documentation with architecture diagrams
- Contributing guidelines and development workflow
- API documentation with command format specifications
- Troubleshooting guide with common solutions
- Performance optimization recommendations
- Security considerations guide

### Changed
- Improved project structure documentation
- Enhanced code quality guidelines

### Fixed
- None yet

---

## [0.0.0] - 2026-04-11

### Added

#### Features
- **Real-time Control Dashboard**
  - Manual joystick-style movement control (Forward, Back, Left, Right)
  - Emergency stop button with visual prominence
  - Hold-to-move functionality with continuous movement intervals
  - Auto/Manual mode toggle

- **Telemetry Monitoring**
  - Real-time ultrasonic sensor distance readings (cm)
  - Temperature monitoring (°C)
  - Pressure sensor data (hPa)
  - Robot position tracking (X, Y coordinates)
  - Heading/direction information
  - System state monitoring

- **Motor Control**
  - Independent PWM speed control for drive motors (0-255)
  - Roller mechanism speed control (0-255)
  - Quick preset buttons (0, 100, 140, 200, 255)
  - Speed value clamping and validation

- **Roller System Management**
  - Toggle roller on/off
  - Independent speed control
  - Visual active/idle status indicator

- **Communication System**
  - WebSocket-based real-time bi-directional communication
  - Automatic connection establishment
  - Event logging (TX/RX/SYS message tracking)
  - Connection status indicator (Online/Offline)
  - Log history (capped at 100 entries)

- **User Interface**
  - Responsive design optimized for desktop and tablet
  - Modern card-based layout
  - Real-time connection status in header
  - Organized control panels with clear sections
  - Color-coded message logs (Blue=TX, Cyan=RX, Gray=System)
  - Tailwind CSS styling

#### Technical
- React 19.2+ with TypeScript
- Vite 6.2+ build configuration
- React Hooks for state management
- Socket.io-client 4.8+ for WebSocket communication
- Lucide React icons library
- Full TypeScript strict mode compliance

#### Documentation
- Initial project structure
- Type definitions (TelemetryData, LogEntry, Command)
- Basic metadata.json configuration
- Vite and TypeScript configuration files

### Changed
- N/A (Initial release)

### Fixed
- N/A (Initial release)

### Removed
- N/A (Initial release)

### Security
- Input validation for PWM values (0-255)
- Command format validation
- Event handler cleanup on component unmount

### Known Issues
- Single robot connection only (multi-robot planned)
- No persistent data storage
- Limited offline functionality

---

## Versioning Policy

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

### Release Schedule
- Alpha/Beta: As features are completed
- Stable: Quarterly releases or when major features are complete

---

## Future Releases

### v0.1.0 - Foundation Improvements
- [ ] Enhanced error handling and recovery
- [ ] Improved logging and debugging tools
- [ ] Performance monitoring dashboard
- [ ] User preference persistence
- [ ] Light/Dark theme support

### v0.2.0 - Advanced Features
- [ ] Multi-robot support
- [ ] Telemetry data recording and playback
- [ ] Historical data visualization
- [ ] Autonomous route planning UI
- [ ] System diagnostics enhanced

### v0.3.0 - Integration & Analytics
- [ ] Real-time video feed integration
- [ ] AI-powered performance analytics
- [ ] Export telemetry data (CSV, JSON)
- [ ] API authentication and security
- [ ] Role-based access control

### v1.0.0 - Production Release
- [ ] Mobile app (iOS/Android)
- [ ] Voice command integration
- [ ] Collaborative multi-user control
- [ ] Advanced scheduling and automation
- [ ] Enterprise security features

---

## Migration Guides

### Upgrading from 0.0.0 to 0.1.0
No breaking changes. Simply pull latest code and rebuild:
```bash
git pull origin main
npm install
npm run build
```

---

## Contributors

- **Initial Development**: ARECAbot Team
- See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines

---

## How to Report Issues

Found a bug? Have a suggestion? 

Please open an issue on [GitHub Issues](https://github.com/samartha-hm/ARECAbot/issues) with:
- Clear description of the issue
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Environment details (browser, OS, versions)

---

## License

All changes and contributions are licensed under the MIT License.
See [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Built with [React](https://react.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Bundled with [Vite](https://vitejs.dev)
- Icons from [Lucide React](https://lucide.dev)
- Template from [Google AI Studio](https://aistudio.google.com)
