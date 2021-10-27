import { SocketIoConfig } from 'ng-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };


export const environment = {
  socketConfig: config,
  production: true,
  urlSocket: "http://localhost:3000",
  url: "https://backpublihazclick.herokuapp.com",
  urlFront: "https://publihazclik.com",
  keyEpayco: "fd1fee1f6f008ddf010440f8c092a2cb",
  URLFILE: "https://backlocompro.herokuapp.com",
  estadoPruebaPagos: false
};
