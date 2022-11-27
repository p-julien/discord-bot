import { ClientImpl } from '../clients/client.impl';
import { ClientMock } from '../clients/client.mock';
import { ClientConfiguration } from './configuration';

export const createDiscordApp = (configuration: ClientConfiguration): Client =>
  configuration.production ? new ClientImpl(configuration) : new ClientMock();

export interface Client {
  listen(): void;
}
