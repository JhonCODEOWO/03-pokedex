export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    mongodb: process.env.MONGODB,
    port: process.env.PORT || 3002, //Si no hay un puerto entonces se recibe 3002
    defaultLimit: +process.env.DEFAULT_LIMIT || 7 //Si no esta declarado en .env será 7
});