const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const environment = process.env.NODE_ENV || 'development';
const envFilePath = path.join(__dirname, `src/environments/environment${environment === 'production' ? '.prod' : ''}.ts`);

const requiredEnvVars = [
  'GEMINI_API_KEY',
  'POKEAPI_BASE_URL',
  'POKEAPI_IMG_URL',
  'GEMINI_API_URL'
];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    console.error(`ERRO: A variável de ambiente ${varName} não está definida no ficheiro .env`);
    process.exit(1);
  }
}

const envFileContent = `
// Este ficheiro é gerado automaticamente pelo script set-env.js. NÃO O EDITE MANUALMENTE.
export const environment = {
  production: ${environment === 'production'},
  pokeApiBaseUrl: '${process.env.POKEAPI_BASE_URL}',
  pokeApiImageUrl: '${process.env.POKEAPI_IMG_URL}',
  geminiApiUrl: '${process.env.GEMINI_API_URL}',
  geminiApiKey: '${process.env.GEMINI_API_KEY}'
};
`;

try {
  fs.writeFileSync(envFilePath, envFileContent);
  console.log(`Sucesso: O ficheiro ${envFilePath} foi gerado com as variáveis de ambiente.`);
} catch (error) {
  console.error(`ERRO ao escrever no ficheiro ${envFilePath}:`, error);
  process.exit(1);
}
