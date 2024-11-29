import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon> //Inyección del modelo
  ){}

  //Instancia necesaria para utiilizar axios.
  private readonly axios: AxiosInstance = axios;


  async executeSeed(){

    await this.pokemonModel.deleteMany({}); // Esto es igual a un DELETE * FROM Pokemons en sql

    //Consumir endpoint de terceros
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=1000');

    const pokemonToInsert: CreatePokemonDto[] = []

    //Recorrer los resultados 
    data.results.forEach(({name, url})=>{
      //Obtener un arreglo de strings donde sabemos que la penúltima posición es el número del pokemon.
      const segments = url.split('/');
      const no:number = +segments[segments.length - 2] //Tomamos la penultima posición.

      pokemonToInsert.push({name, no}); //Llenar el arreglo de objetos
    })

    //Realizar insersión por lotes
    await this.pokemonModel.insertMany(pokemonToInsert);

    return `Seed executed`;
  }

  //Hace un seed utilizando un array de promesas que se resuelven al final simultaneamente
  async executeSeedWithArray(){

    await this.pokemonModel.deleteMany({}); // Esto es igual a un DELETE * FROM Pokemons en sql

    //Consumir endpoint de terceros
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=20');

    const insertPromisesArray = [];

    //Recorrer los resultados 
    data.results.forEach(({name, url})=>{
      //Obtener un arreglo de strings donde sabemos que la penúltima posición es el número del pokemon.
      const segments = url.split('/');
      const no:number = +segments[segments.length - 2] //Tomamos la penultima posición.

      //Guardamos el pokemon en nuestra base de datos.
      // const pokemon = this.pokemonModel.create({name, no});
      insertPromisesArray.push(this.pokemonModel.create({name, no})); //Insertar todas las promesas sin ejecutarlas en un arreglo
    })

    await Promise.all(insertPromisesArray); //Ejecuta todas las promesas del arreglo al mismo tiempo

    return `Seed executed`;
  }
}
