import { Provider } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';

export const MessagesGatewayProvider: Provider = {
  provide: 'GATEWAY_INIT',
  useFactory: (gateway: MessagesGateway, service: MessagesService) => {
    service.setGateway(gateway);
    return true;
  },
  inject: [MessagesGateway, MessagesService],
};
