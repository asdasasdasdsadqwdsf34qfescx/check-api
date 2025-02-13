import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  getData,
  updateDbOnlineStatus,
  updateDbOnlineStatusToFalse,
} from 'src/supa-api.service';
const cbApi =
  'https://chaturbate.com/affiliates/api/onlinerooms/?format=json&wm=3YHSK';
const logsOnline: {
  model: string;
  date: Date;
  status: 'online'|'offline'
}[] = []
@Injectable()
export class RecursiveService implements OnModuleInit {
  // Funcția recursivă
  private async chekModelOnline(): Promise<void> {
    console.log("\n                    🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽NEW CHECK SESSION🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽")
    const models = await getData();
    const cbData = await this.getCbData();
    let currentModelOnline: string[] = [];
    await Promise.all(
      models.map(async (model) => {
        const wasOnline = model.isOnline;
        const isOnline = await this.checkIfModelIsOnline(model.name, cbData);
        if (isOnline) {
          currentModelOnline.push(model.name);
        }

        if (wasOnline !== isOnline) {
          if (isOnline) {
            console.log(`🟢${model.name} is ONLINE`);
            console.log('%c────────────────────────────', 'color: #e0e0e0;');
            console.log('\n')
            await updateDbOnlineStatus(model.id!, model.onlineCount!);
            logsOnline.push({
              model: model.name,
              date: new Date,
              status: "online"
            })
          } else {
            console.log(`🔴${model.name}  goes OFFLINE`);
            console.log('%c────────────────────────────', 'color: #e0e0e0;');
            console.log('\n')
            await updateDbOnlineStatusToFalse(model.id!);
            logsOnline.push({
              model: model.name,
              date: new Date,
              status: "offline"
            })
          }
        }
      }),
    );
    
    console.log(
      '%c🚀 Current Model Online - %s',
      'background: #e3fcec; color: #0a8150; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
      new Date().toLocaleTimeString()
    );
    
    currentModelOnline.forEach((model, index) => {
      // Inițializare buffer pentru fiecare grup de 5
      if (index % 5 === 0 && index !== 0) {
        console.log('\n────────────────────────────────────────────────────────────────────────────────────────────────────────────────');
      }
    
      process.stdout.write(`| ${model || 'N/A'} |`)
     
    });
    console.log('\n')
    console.log(`                              ⚠️⚠️⚠️⚠️⚠️             LOGS             ⚠️⚠️⚠️⚠️⚠️`)
    logsOnline.forEach(element => {
      console.log('\n') 
      if(element.status === 'online'){
        console.log(`🟢 ${element.model} start stream ${element.date}`) 
      }else (
        console.log(`🔴 ${element.model} stop stream ${element.date}`) 
      )
    });
    console.log('\n') 
    console.log('\n')
    setTimeout(() => this.chekModelOnline(), 10000);
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

      return model ? true : false;
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
