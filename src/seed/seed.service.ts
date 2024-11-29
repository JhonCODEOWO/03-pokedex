import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  //Instancia necesaria para utiilizar axios.
  private readonly axios: AxiosInstance = axios;

  async executeSeed(){
    //Consumir endpoint de terceros
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

    //Recorrer los resultados 
    data.results.forEach(({name, url})=>{
      //Obtener un arreglo de strings donde sabemos que la penúltima posición es el número del pokemon.
      const segments = url.split('/');
      const no:number = +segments[segments.length - 2] //Tomamos la penultima posición.

      //Guardamos el pokemon en nuestra base de datos.
      const pokemon = this.pokemonModel.create({name, no});
    })

    return `Seed executed`;
  }
}
