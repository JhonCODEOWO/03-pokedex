import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.setGlobalPrefix('api/v2');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //Elimina del body las propiedades que no corresponden a un DTO y permite lo que el DTO espera.
    forbidNonWhitelisted: true, //Da una excepçión si el body tiene propiedades que el DTO no tiene.
    transform: true, //Habilitamos las transformaciones
    //Colocamos las optiones de transformación
    transformOptions: { 
      enableImplicitConversion: true //Se transformarán todos los datos hacia las reglas de los DTO
    }
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
