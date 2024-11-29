import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

//Como vamos a desear almacenar en la base de datos una colección (En mongo DB)
@Schema() //Decorador que permite indicar que es un esquema de base de datos
export class Pokemon extends Document{ //Document añade las funcionalidades para que se trabaje con Pokemon como una colección de mongo

    //id: string Mongo lo da y no es necesario especificarlo

    //Configuración de la propiedad mediante mongo
    @Prop({
        unique: true,
        index: true,
    })
    name: string;


    @Prop({
        unique: true,
        index: true,
    })
    no: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon); //Exporta un esquema basado en la clase
