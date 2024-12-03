import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';

@Module({
    providers: [AxiosAdapter], //Declaramos un provider en el módulo
    exports: [AxiosAdapter] //Exportamos el provider para que pueda ser utilizado por otros módulos
})
export class CommonModule {}
