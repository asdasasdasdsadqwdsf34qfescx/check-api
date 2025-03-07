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
        {
          const wasOnline = model.isOnline;
          const isOnline = await this.checkIfModelIsOnline(model.name, cbData);

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
