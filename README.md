# Network Privacy Tool

A TypeScript port of the M474 privacy tool to change MAC addresses and renew IP addresses.

## Features

- Change MAC address to a random MAC address
- Revert MAC address to permanent MAC address
- Renew IP address
- Display internal and external IP addresses
- Cross-platform support (Windows and Unix-like systems)

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/network-privacy-tool.git
cd network-privacy-tool

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

The tool requires administrator/root privileges to change network settings.

### Change MAC address and renew IP

```bash
# On Windows (run as Administrator)
npm start

# On Unix-like systems
sudo npm start
```

### Revert MAC address to permanent MAC address

```bash
# On Windows (run as Administrator)
npm run revert

# On Unix-like systems
sudo npm run revert
```

### Specify a network interface

```bash
# On Windows (run as Administrator)
npm start -- --interface wlan0

# On Unix-like systems
sudo npm start -- --interface wlan0
```

## Requirements

- Node.js 14.x or higher
- For MAC address functionality:
  - On Windows: getmac utility
  - On Unix-like systems: macchanger utility

## Disclaimer

This tool is created for educational purposes only. Use it responsibly and legally. The author is not responsible for any misuse or damage caused by this tool.

## License

This project is licensed under the AGPL-3.0 License.