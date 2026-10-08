import { EventEmitter } from 'events';

class EventBus extends EventEmitter {}
const eventBus = new EventBus();

// Increase limit if many concurrent clients
eventBus.setMaxListeners(100);

export default eventBus;
