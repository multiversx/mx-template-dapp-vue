// import { EnvironmentsEnum } from '@multiversx/sdk-dapp/out/types/enums.types';

const environment = 'devnet'; // Mock for now

function getEnvironment() {
  return environment;
}

export function useEnvironment() {
  return {
    environment,
    getEnvironment
  };
} 