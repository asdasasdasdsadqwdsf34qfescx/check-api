import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  getData,
  updateDbOnlineStatus,
  updateDbOnlineStatusToFalse,
} from 'src/supa-api.service';
const cbApi =
  'https://chaturbate.com/affiliates/api/onlinerooms/?format=json&wm=3YHSK';

@Injectable()
export class RecursiveService implements OnModuleInit {
  // Funcția recursivă
  private async chekModelOnline(): Promise<void> {
    console.clear();
    console.log(
      '\n                    🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽NEW CHECK SESSION🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽',
    );
    const models = await getData();
    const cbData = await this.getCbData();
    await Promise.all(
      models.map(async (model) => {
        if (
          model.name === 'tender_diana' ||
          model.name === 'agnieszkabanana' ||
          model.name === 'swt_shadow'
        ) {
          const wasOnline = model.isOnline;
          // console.log('was online:', wasOnline)
          const isOnline = await this.getCBhtml(model.name);
          // console.log('now is online?: ', wasOnline)
          if (wasOnline !== isOnline) {
            if (isOnline) {
              await updateDbOnlineStatus(model.id!, model.onlineCount!);
            } else {
              await updateDbOnlineStatusToFalse(model.id!);
            }
          }
        } else {
          const wasOnline = model.isOnline;
          const isOnline = await this.checkIfModelIsOnline(model.name, cbData)

          if (wasOnline !== isOnline) {
            if (isOnline) {
              await updateDbOnlineStatus(model.id!, model.onlineCount!);
            } else {
              await updateDbOnlineStatusToFalse(model.id!);
            }
          }
        }
      }),
    );

    setTimeout(() => this.chekModelOnline(), 60000);
  }

  async getCbData() {
    try {
      const response = await fetch(cbApi);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data from cbApi:', error);
      return [];
    }
  }

  async getCBhtml(name: string): Promise<boolean> {
    const url = `https://chaturbate.com/${name}`;
    const options = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      },
    };
  
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.text();
  
      // Verificăm dacă sunt prezente meta tag-urile:
      // <meta name="twitter:card" content="summary_large_image" /> 
      // și un meta tag pentru "twitter:image" (indiferent de conținut)
      const hasTwitterCard = data.includes(
        '<meta name="twitter:card" content="summary_large_image"'
      );
      const hasTwitterImage = data.includes('<meta name="twitter:image"');
  
      if (hasTwitterCard && hasTwitterImage) {
        console.log("Twitter meta tags found for model", name);
        return true;
      } else {
        console.log("Twitter meta tags NOT found for model", name);
        return false;
      }
    } catch (error) {
      console.error('Error fetching data from cbApi:', error);
      return false;
    }
  }
  
  
  

  async checkIfModelIsOnline(modelUsername: string, data: any) {
    try {
      const model = data.find(
        (item: any) =>
          item.username.toLowerCase() === modelUsername.toLowerCase(),
      );

      if (model) {
        if (model.current_show && model.current_show === 'public') {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking model status:', error);
      return false;
    }
  }

  // Pornire automată la inițializarea modulului
  onModuleInit(): void {
    console.log('RecursiveService inițializat!');
    this.chekModelOnline(); // Apelul inițial
  }
}
