const hasOwn = {}.hasOwnProperty;

export default class EventEmitter {
    constructor(opts){
        const self = this;

        opts = opts || {};

        self._events = {};

        self._listenerCount = 0;

        self._maxListeners = opts.maxListeners || 10;
    }

    addEvent(eventName) {
        const self = this;

        if (!self.hasEvent(eventName)) {
            self._events[eventName] = [];
        }
    }

    emit(eventName, ...args) {
        const self = this;

        if (!self._events || !self.hasEvent(eventName)) {
            return false;
        }

        const handlers = self.getListeners(eventName);

        for(let i = 0, len = handlers.length; i < len; i++) {
            handlers[i](self, ...args);
        }

        return true;
    }

    _eventIndex(eventName, listener) {
        const self = this;

        if(!self.hasEvent(eventName)) {
            return - 1;
        } else {
            return self._events[eventName].indexOf(listener)
        }
    }

    getEvents() {
        const self = this;

        return Object(self._events).keys();
    }

    getListeners(eventName) {
        const self = this;

        if(!self.hasEvent(eventName)){
            return [];
        }

        return self._events[eventName].slice(0);
    }

    getListenerCount(){
        const self = this;

        return self._listenerCount;
    }

    getMaxListeners() {
        const self = this;

        return self._maxListeners;
    }

    hasEvent(eventName) {
        const self = this;

        return hasOwn.call(self.events, eventName);
    }

    hasListener(eventName, listener) {
        const self = this;

        return self._eventIndex(eventName, listener) > 0;
    }

    on(eventName, listener) {
        const self = this;

        self.addEvent(eventName);

        if(self.hasListener(eventName, listener)) {
            return self;
        }

        self._listenerCount++;

        self._events[eventName].push(listener);

        return self;
    }

    once(eventName, listener) {
        const self = this;

        self.on(eventName, function onceWrap(ctx, ...args){
            self.removeListener(eventName, onceWrap);
            listener(ctx, ...args);
        });

        return self;
    }

    prependListener(eventName, listener) {
        const self = this;

        self.addEvent(eventName);

        if(self.hasListener(eventName, listener)) {
            return self;
        }

        self._listenerCount++;

        self._events[eventName].unshift(listener);

        return self;
    }

    prependListenerOnce(eventName, listener) {
        const self = this;

        self.prependListener(eventName, function onceWrap(ctx, ...args){
            self.removeListener(eventName, onceWrap);
            listener(ctx, ...args);
        });

        return self;
    }

    removeListener(eventName, listener) {
        const self = this;

        if (!self._events || !self.hasEvent(eventName)) {
            return self;
        }

        const index = self._eventIndex(eventName, listener);

        if(index > 0) {
            self._events[eventName].splice(index, 1);
        }

        return self;
    }

    setMaxListeners(maxListeners) {
        const self = this;

        self._maxListeners = maxListeners;

        return self;
    }
}