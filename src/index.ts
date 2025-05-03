import { Command } from 'commander';
import { colors } from './utils/colors';
import { isWindows, checkRoot } from './utils/system';
import { getInternalIP, getExternalIP, renewIP } from './services/ip';
import { getCurrentMAC, changeMAC, revertMAC } from './services/mac';

// Create ASCII Art
const asciiArt = `
    ...     ..      ..                                                   
  x*8888x.:*8888: -"888:           xeee    dL ud8Nu  :8c         xeee    
 X   48888X 8888H  8888          d888R    8Fd888888L %8        d888R    
X8x.  8888X  8888X  !888>        d8888R    4N88888888cuR       d8888R    
X8888 X8888  88888   "*8%-      @ 8888R    4F   ^""%""d       @ 8888R    
'*888!X8888> X8888  xH8>      .P  8888R    d       .z8      .P  8888R    
  ?8 8888  X888X X888>     :F   8888R    ^     z888      :F   8888R    
  -^  '888"  X888  8888>    x"    8888R        d8888'     x"    8888R    
   dx '88~x. !88~  8888>   d8eeeee88888eer    888888     d8eeeee88888eer 
 .8888Xf.888x:!    X888X.:        8888R      :888888            8888R    
:""888":~"888"     888*"         8888R       888888            8888R    
    "~'    "~        ""        "*%%%%%%**~    '%**%          "*%%%%%%**~
`;

// Program class
class NetworkPrivacyTool {
  private program: Command;
  private interfaceName: string;
  
  constructor() {
    this.program = new Command();
    this.interfaceName = 'eth0'; // Default interface
    this.setupProgram();
  }
  
  private setupProgram(): void {
    this.program
      .version('1.0.0')
      .option('-r, --revert', 'Revert MAC address to permanent MAC address')
      .option('-i, --interface <interface>', 'Network interface to use', 'eth0')
      .parse(process.argv);
      
    const options = this.program.opts();
    if (options.interface) {
      this.interfaceName = options.interface;
    }
  }
  
  public async run(): Promise<void> {
    console.log(colors.YELLOW(asciiArt));
    console.log(colors.GREEN('==================================================================='));
    
    // Check if running as root on Unix-like systems
    if (!isWindows() && !checkRoot()) {
      console.log(colors.RED('This script must be run as root'));
      process.exit(1);
    }
    
    const options = this.program.opts();
    
    // If revert option is provided
    if (options.revert) {
      await this.revertMacAddress();
      return;
    }
    
    await this.showCurrentInfo();
    await this.renewIPAddress();
    await this.changeMacAddress();
    await this.showNewInfo();
    
    console.log(colors.YELLOW('To revert MAC address to the permanent MAC address, run the script with the argument \'--revert\'.'));
  }
  
  private async revertMacAddress(): Promise<void> {
    console.log(colors.GREEN('Reverting MAC address to permanent MAC address...'));
    try {
      await revertMAC(this.interfaceName);
      console.log(colors.GREEN('MAC address reverted successfully!'));
    } catch (error) {
      console.error(colors.RED(`Failed to revert MAC address: ${error}`));
    }
  }
  
  private async showCurrentInfo(): Promise<void> {
    try {
      // Get current MAC and IP addresses
      const currentMAC = await getCurrentMAC();
      const internalIP = await getInternalIP();
      const externalIP = await getExternalIP();
      
      console.log(`Current MAC address: ${colors.GREEN(currentMAC || 'Unknown')}`);
      if (internalIP) {
        console.log(`Internal IP address: ${colors.GREEN(internalIP)}`);
      }
      if (externalIP) {
        console.log(`External IP address: ${colors.GREEN(externalIP)}`);
      }
    } catch (error) {
      console.error(colors.RED(`Error showing current information: ${error}`));
    }
  }
  
  private async renewIPAddress(): Promise<void> {
    try {
      console.log('Renewing IP address...');
      await renewIP();
      console.log(colors.GREEN('IP address renewed successfully!'));
    } catch (error) {
      console.error(colors.RED(`Failed to renew IP address: ${error}`));
    }
  }
  
  private async changeMacAddress(): Promise<void> {
    try {
      console.log(colors.GREEN('==================================================================='));
      console.log('Changing MAC address...');
      const newMAC = await changeMAC(this.interfaceName);
      console.log(`New MAC address: ${colors.GREEN(newMAC)}`);
    } catch (error) {
      console.error(colors.RED(`Failed to change MAC address: ${error}`));
    }
  }
  
  private async showNewInfo(): Promise<void> {
    try {
      console.log(colors.GREEN('==================================================================='));
      
      // Get new IP addresses
      const newInternalIP = await getInternalIP();
      const newExternalIP = await getExternalIP();
      
      if (newInternalIP) {
        console.log(`New internal IP address: ${colors.GREEN(newInternalIP)}`);
      }
      if (newExternalIP) {
        console.log(`New external IP address: ${colors.GREEN(newExternalIP)}`);
      }
    } catch (error) {
      console.error(colors.RED(`Error showing new information: ${error}`));
    }
  }
}

// Run the application
const app = new NetworkPrivacyTool();
app.run().catch(error => {
  console.error(colors.RED(`An unexpected error occurred: ${error}`));
  process.exit(1);
});