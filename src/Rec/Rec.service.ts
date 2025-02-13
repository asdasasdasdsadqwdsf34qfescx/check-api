import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class RecursiveService implements OnModuleInit {
  // Funcția recursivă
  private callRecursiveFunction(): void {
    console.log('Funcție recursivă apelată la fiecare secundă!');
    
    // Logica ta aici...
    setTimeout(() => this.callRecursiveFunction(), 60000);
  }

  // Pornire automată la inițializarea modulului
  onModuleInit(): void {
    console.log('RecursiveService inițializat!');
    this.callRecursiveFunction(); // Apelul inițial
  }
}
