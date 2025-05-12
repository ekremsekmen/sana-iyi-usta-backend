"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesGatewayProvider = void 0;
const messages_gateway_1 = require("./messages.gateway");
const messages_service_1 = require("./messages.service");
exports.MessagesGatewayProvider = {
    provide: 'GATEWAY_INIT',
    useFactory: (gateway, service) => {
        service.setGateway(gateway);
        return true;
    },
    inject: [messages_gateway_1.MessagesGateway, messages_service_1.MessagesService],
};
//# sourceMappingURL=messages-gateway.provider.js.map