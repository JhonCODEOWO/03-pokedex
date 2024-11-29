import { IsInt, isInt, IsPositive, IsString, isString, Min, min, MinLength } from "class-validator";

export class CreatePokemonDto {
    @IsInt()
    @IsPositive()
    @Min(1)
    no: number;

    @IsString()
    @MinLength(1)
    name: string;
}
