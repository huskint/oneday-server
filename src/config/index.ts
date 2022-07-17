import 'dotenv/config';

export interface ProcessEnv {
    [key: string]: string | undefined
}

const config: ProcessEnv = {
    PORT: process.env.PORT,
};

export default config;
