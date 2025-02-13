import { Injectable, OnModuleInit } from '@nestjs/common';
import { getData } from 'src/supa-api.service';

@Injectable()
export class RecursiveService implements OnModuleInit {
  // Funcția recursivă
  private async callRecursiveFunction(): Promise<void> {
    console.log('Funcție recursivă apelată la fiecare secundă!');
    const models = await getData();
    console.log(models[0])
    setTimeout(() => this.callRecursiveFunction(), 10000);
  }

  // Pornire automată la inițializarea modulului
  onModuleInit(): void {
    console.log('RecursiveService inițializat!');
    this.callRecursiveFunction(); // Apelul inițial
  }
}
