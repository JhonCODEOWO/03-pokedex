import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{
    @IsOptional()
    @IsPositive()
    @Min(1)
    limit?: number; //Es opcional, positivo y su valor mínimo es de 1

    @IsOptional()
    @IsPositive()
    offset?: number; //Es opcional y debe ser positivo
}