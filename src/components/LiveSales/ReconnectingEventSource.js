class EventSourceNotAvailableError extends Error {
  constructor() {
    super(
      'EventSource not available.\n' +
        'Consider loading an EventSource polyfill and making it available globally as EventSource, ' +
        'or passing one in as eventSourceClass to the ReconnectingEventSource constructor.'
    );
  }
}

export class ReconnectingEventSource {
  constructor(url, configuration) {
    this._configuration =
      configuration != null ? Object.assign({}, configuration) : null;

    this._eventSource = null;
    this._lastEventId = null;
    this._timer = null;
    this._listeners = {};

    this.url = url;
    this.readyState = 0;
    this.max_retry_time = 3000;
    this.eventSourceClass = EventSource;

    if (this._configuration != null) {
      if (this._configuration.lastEventId) {
        this._lastEventId = this._configuration.lastEventId;
        delete this._configuration['lastEventId'];
      }

      if (this._configuration.max_retry_time) {
        this.max_retry_time = this._configuration.max_retry_time;
        delete this._configuration['max_retry_time'];
      }

      if (this._configuration.eventSourceClass) {
        this.eventSourceClass = this._configuration.eventSourceClass;
        delete this._configuration['eventSourceClass'];
      }
    }

    if (
      this.eventSourceClass == null ||
      typeof this.eventSourceClass !== 'function'
    ) {
      throw new EventSourceNotAvailableError();
    }

    this._onevent_wrapped = (event) => {
      this._onevent(event);
    };

    this._start();
  }

  _start() {
    // console.log('Starting EventSource..');
    let url = this.url;

    if (this._lastEventId) {
      if (url.indexOf('?') === -1) {
        url += '?';
      } else {
        url += '&';
      }
      url += 'lastEventId=' + encodeURIComponent(this._lastEventId);
    }

    this._eventSource = new this.eventSourceClass(url, this._configuration);

    this._eventSource.onopen = (event) => {
      this._onopen(event);
    };
    this._eventSource.onerror = (event) => {
      this._onerror(event);
    };
    this._eventSource.onmessage = (event) => {
      this.onmessage(event);
    };

    // apply listen types
    for (const type of Object.keys(this._listeners)) {
      this._eventSource.addEventListener(type, this._onevent_wrapped);
    }
  }

  _onopen(event) {
    if (this.readyState === 0) {
      this.readyState = 1;
      this.onopen(event);
    }
  }

  _onerror(event) {
    if (this.readyState === 1) {
      this.readyState = 0;
      this.onerror(event);
    }

    if (this._eventSource) {
      if (this._eventSource.readyState === 2) {
        // reconnect with new object
        this._eventSource.close();
        this._eventSource = null;

        // reconnect after random timeout < max_retry_time
        const timeout = Math.round(this.max_retry_time * Math.random());
        this._timer = setTimeout(() => this._start(), timeout);
      }
    }
  }

  _onevent(event) {
    this.readyState = 1;

    if (event.lastEventId) {
      this._lastEventId = event.lastEventId;
    }

    const listenersForType = this._listeners[event.type];
    if (listenersForType != null) {
      // operate on a copy
      for (const listener of [...listenersForType]) {
        listener(event);
      }
    }

    if (event.type === 'message') {
      this.onmessage(event);
    }
  }

  onopen(event) {
    // may be overridden
  }

  onerror(event) {
    // may be overridden
  }

  onmessage(event) {
    // may be overridden
  }

  close() {
    // console.log('Closing EventSource..');
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }

    if (this._eventSource) {
      this._eventSource.close();
      this._eventSource = null;
    }

    this.readyState = 2;
  }

  addEventListener(inType, callback) {
    // console.log('Added EventSource Listener', inType);
    const type = inType.toString();

    if (!(type in this._listeners)) {
      this._listeners[type] = [];
      if (this._eventSource) {
        this._eventSource.addEventListener(type, this._onevent_wrapped);
      }
    }

    const listenersForType = this._listeners[type];
    if (!listenersForType.includes(callback)) {
      this._listeners[type] = [...listenersForType, callback];
    }
  }

  removeEventListener(inType, callback) {
    // console.log('Removed EventSource Listener', inType);

    const type = inType.toString();

    if (type in this._listeners) {
      const listenersForType = this._listeners[type];

      const updatedListenersForType = listenersForType.filter(
        (l) => l !== callback
      );

      if (updatedListenersForType.length > 0) {
        this._listeners[type] = updatedListenersForType;
      } else {
        delete this._listeners[type];
        if (this._eventSource) {
          this._eventSource.removeEventListener(type, this._onevent_wrapped);
        }
      }
    }
  }
}
