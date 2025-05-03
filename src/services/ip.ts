import { exec } from 'child_process';
import axios from 'axios';
import { isWindows } from '../utils/system';
import { colors } from '../utils/colors';

export const getInternalIP = (): Promise<string | null> => {
  return new Promise((resolve) => {
    if (isWindows()) {
      exec('ipconfig', (error, stdout) => {
        if (error) {
          console.log(colors.RED(`Error getting internal IP: ${error}`));
          resolve(null);
          return;
        }
        
        const match = stdout.match(/IPv4 Address[^\n:]*: ([\d.]+)/);
        resolve(match ? match[1] : null);
      });
    } else {
      exec('hostname -I', (error, stdout) => {
        if (error) {
          console.log(colors.RED(`Error getting internal IP: ${error}`));
          resolve(null);
          return;
        }
        
        resolve(stdout.trim());
      });
    }
  });
};

export const getExternalIP = async (): Promise<string | null> => {
  try {
    const response = await axios.get('https://api.ipify.org');
    return response.data.trim();
  } catch (e) {
    console.log(colors.RED(`Error fetching external IP: ${e}`));
    return null;
  }
};

export const renewIP = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isWindows()) {
      // Need to run commands separately for Windows
      exec('ipconfig /release', (error) => {
        if (error) {
          console.log(colors.RED(`Error releasing IP: ${error}`));
          reject(error);
          return;
        }
        
        exec('ipconfig /renew', (error) => {
          if (error) {
            console.log(colors.RED(`Error renewing IP: ${error}`));
            reject(error);
            return;
          }
          resolve();
        });
      });
    } else {
      exec('dhclient -r && dhclient', (error) => {
        if (error) {
          console.log(colors.RED(`Error renewing IP: ${error}`));
          reject(error);
          return;
        }
        resolve();
      });
    }
  });
};