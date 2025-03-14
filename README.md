# Map to Safari Extension

A Safari extension that automatically converts Google Maps links to Apple Maps links, providing a seamless navigation experience for macOS and iOS users.

## Features

- Automatically detects clicks on Google Maps links
- Converts Google Maps URLs to their Apple Maps equivalents
- Works on any webpage containing Google Maps links
- Seamless integration with Safari's toolbar
- Background processing ensures smooth user experience

## Technical Details

### Architecture

The extension consists of several components:

- **Content Script**: Monitors webpage interactions and detects Google Maps links
- **Background Script**: Handles URL conversion and navigation
- **Popup Interface**: Provides user controls and settings
- **Swift App**: Hosts the Safari web extension

### Permissions

The extension requires the following permissions:

- `webRequest`: For monitoring web requests
- `webNavigation`: For handling navigation events
- `tabs`: For managing browser tabs

### Host Permissions

Access is limited to Google Maps domains:
- `*://www.google.com/maps/*`
- `*://maps.google.com/*`

## Installation

1. Download the latest release from the App Store
2. Open the app
3. Enable the Safari extension in Safari's preferences:
   - Open Safari
   - Go to Preferences > Extensions
   - Enable "Map to Safari Extension"

## Development

This project is built using:

- Swift for the host application
- JavaScript for the extension logic
- HTML/CSS for the popup interface
- Safari Web Extension framework

### Project Structure

```
Map to safari/
├── App (Swift)
│   ├── AppDelegate.swift
│   ├── SceneDelegate.swift
│   └── ViewController.swift
└── Extension
    ├── Resources
    │   ├── background.js
    │   ├── content.js
    │   ├── popup.html
    │   └── manifest.json
    └── SafariWebExtensionHandler.swift
```

## Requirements

- macOS 11.0 or later
- Safari 14.0 or later

## Version

Current version: 1.0

## License

All rights reserved.