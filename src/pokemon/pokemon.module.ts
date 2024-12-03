import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    ConfigModule, //ConfigModule para variables de entorno
    //Importar forFeature para indicar a mongoose que esquema enlazar
    MongooseModule.forFeature([
      {
        name: Pokemon.name, //Name proviene no de la clase si no de extends Document
        schema: PokemonSchema, //Esquema exportado desde pokemon.entity
      }
    ])
  ],
  exports: [PokemonService, MongooseModule]//Exportación del modelo
})
export class PokemonModule {}
