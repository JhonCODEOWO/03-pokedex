import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { json } from 'node:stream/consumers';

@Injectable()
export class PokemonService {

  //Inyectar las dependencias
  constructor(
    
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>

  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      //Creación del registro.
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      //Devolver pokemon creado
      return pokemon;
    } catch (error) {
      console.log(error);
      this.hanldeExceptions(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    //Si el id es un número
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({no: term}); //Busca por la propiedad no usando el termino de búsqueda
    }

    //Mongo ID
    if (!pokemon && isValidObjectId(term)) { //Si no existe pokemon y el term es un mongoid valido
      pokemon = await this.pokemonModel.findById( term );
    }

    //Name
    if (!pokemon) { //Si hasta este punto aún no hay un pokemon entonces...
      pokemon = await this.pokemonModel.findOne({name: term.toLowerCase().trim()}); //Busca por medio de la columna name eliminando espacios en term y aplicando lowercase
    }

    //Manejar un pokemon no encontrado.
    if(!pokemon) throw new NotFoundException(`Pokemon with ${term} not found dude.)`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    //Reutilizamos la búsqueda
    const pokemon = await this.findOne(term);

    //Si el nombre viene en el dto.
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }
    try {
      //Actualiza el documento pokemon y con new: true devuelve los cambios inmediatamente al modelo.
      await pokemon.updateOne(updatePokemonDto);
    } catch (error) {
      this.hanldeExceptions(error);
    }

    return {...pokemon.toJSON(), ...updatePokemonDto}; //Propiedades esparcidas desde pokemon hacia updatePokemonDto para reemplazar nuevos datos
  }

  async remove(id: string) {
    //const pokemon = await this.pokemonModel.findByIdAndDelete(id);

    //Elimina el documento dentro de la colección que coincida con la condición (Puede eliminar más de 1 registro si no se usa con cuidado)
    const {deletedCount, acknowledged} = await this.pokemonModel.deleteOne({_id: id});

    if(deletedCount == 0) throw new BadRequestException(`No one pokemon was deleted, the id don't matches with one document in the collection`);

    return ;
  }

  private hanldeExceptions(error: any){
    //Errores conocidos
    if (error.code == 11000) {
      throw new BadRequestException(`The value ${JSON.stringify(error.keyValue)} received actually exists in a pokemom`);
    }

    //Imprimir errores no encontrados aún
    console.log(error);
    throw new InternalServerErrorException(`New error no considerated inside Pokemon service`);
  }
}
