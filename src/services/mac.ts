import { exec } from 'child_process';
import * as fs from 'fs';
import { isWindows } from '../utils/system';
import { colors } from '../utils/colors';

export const getCurrentMAC = (): Promise<string | null> => {
  return new Promise((resolve) => {
    const command = isWindows() ? 'getmac' : 'ifconfig';
    
    exec(command, (error, stdout) => {
      if (error) {
        console.log(colors.RED(`Error getting current MAC: ${error}`));
        resolve(null);
        return;
      }
      
      let match;
      if (isWindows()) {
        const lines = stdout.split('\n');
        match = lines.length > 3 ? lines[3] : null;
      } else {
        match = stdout.match(/ether\s+([0-9a-fA-F:]+)/);
      }
      
      resolve(match ? (isWindows() ? String(match) : match[1]) : null);
    });
  });
};

export const generateRandomMAC = (): string => {
  // Generate random MAC address
  const mac = Array(6)
    .fill(0)
    .map(() => Math.floor(Math.random() * 256).toString(16).padStart(2, '0'))
    .join(':');
  
  return mac;
};

export const changeMAC = (interfaceName: string = 'eth0'): Promise<string> => {
  return new Promise((resolve, reject) => {
    // First get vendor list
    const command = isWindows() ? 'getmac -l' : 'macchanger -l';
    
    exec(command, (error, stdout) => {
      if (error) {
        console.log(colors.YELLOW('Could not get vendor list, generating random MAC instead'));
        const randomMac = generateRandomMAC();
        
        // Now change the MAC address
        const changeCommand = isWindows()
          ? `getmac -m ${randomMac} ${interfaceName}`
          : `macchanger -m ${randomMac} ${interfaceName}`;
        
        exec(changeCommand, (changeError) => {
          if (changeError) {
            console.log(colors.RED(`Error changing MAC address: ${changeError}`));
            reject(changeError);
            return;
          }
          resolve(randomMac);
        });
        
        return;
      }
      
      // If we can get vendor list, use it
      fs.writeFileSync('vendor_list.txt', stdout);
      const macList = fs.readFileSync('vendor_list.txt', 'utf8').split('\n');
      
      let mac1;
      try {
        const randomLine = macList[Math.floor(Math.random() * macList.length)];
        mac1 = randomLine.split(' ')[2];
      } catch (e) {
        mac1 = Array(3)
          .fill(0)
          .map(() => Math.floor(Math.random() * 256).toString(16).padStart(2, '0'))
          .join(':');
      }
      
      const mac2 = Array(3)
        .fill(0)
        .map(() => Math.floor(Math.random() * 256).toString(16).padStart(2, '0'))
        .join(':');
      
      const newMAC = `${mac1}:${mac2}`;
      
      // Change MAC
      const changeCommand = isWindows()
        ? `getmac -m ${newMAC} ${interfaceName}`
        : `macchanger -m ${newMAC} ${interfaceName}`;
      
      exec(changeCommand, (changeError) => {
        if (changeError) {
          console.log(colors.RED(`Error changing MAC address: ${changeError}`));
          reject(changeError);
          return;
        }
        resolve(newMAC);
      });
    });
  });
};

export const revertMAC = (interfaceName: string = 'eth0'): Promise<void> => {
  return new Promise((resolve, reject) => {
    const command = isWindows()
      ? `getmac -p ${interfaceName}`
      : `macchanger -p ${interfaceName}`;
    
    exec(command, (error) => {
      if (error) {
        console.log(colors.RED(`Error reverting MAC address: ${error}`));
        reject(error);
        return;
      }
      resolve();
    });
  });
};