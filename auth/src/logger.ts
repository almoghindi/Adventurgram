import * as winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { format } from 'logform';

const esTransportOpts = {
  level: 'info',
  clientOpts: { node: 'http://elasticsearch:9200' },
};

const logger = winston.createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new winston.transports.Console(),
    new ElasticsearchTransport(esTransportOpts),
  ],
});

export default logger;
