//    Estructura de un HttpAdapter
export interface HttpAdapter{
    get<T>(url: string): Promise<T>; //Método get que resuelve una promesa con un tipo de dato genérico.
    
}