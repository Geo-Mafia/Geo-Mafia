let enabled = false;
let _categories = {};
const _writers = [];
const _eventListeners = [];
let _errorHandler;
export var Trace;
(function (Trace) {
    /**
     * Enables the trace module.
     */
    function enable() {
        enabled = true;
    }
    Trace.enable = enable;
    /**
     * Disables the trace module.
     */
    function disable() {
        enabled = false;
    }
    Trace.disable = disable;
    /**
     * A function that returns whether the tracer is enabled and there is a point in writing messages.
     * Check this to avoid writing complex string templates.
     * Send error messages even if tracing is disabled.
     */
    function isEnabled() {
        return enabled;
    }
    Trace.isEnabled = isEnabled;
    /**
     * Adds a TraceWriter instance to the trace module.
     * @param writer The TraceWriter instance to add.
     */
    function addWriter(writer) {
        _writers.push(writer);
    }
    Trace.addWriter = addWriter;
    /**
     * Removes a TraceWriter instance from the trace module.
     * @param writer The TraceWriter instance to remove.
     */
    function removeWriter(writer) {
        const index = _writers.indexOf(writer);
        if (index >= 0) {
            _writers.splice(index, 1);
        }
    }
    Trace.removeWriter = removeWriter;
    /**
     * Clears all the writers from the trace module.
     */
    function clearWriters() {
        if (_writers.length > 0) {
            _writers.splice(0, _writers.length);
        }
    }
    Trace.clearWriters = clearWriters;
    /**
     * Sets the categories the module will trace.
     * @param categories The comma-separated list of categories. If not specified all messages from all categories will be traced.
     */
    function setCategories(categories) {
        _categories = {};
        addCategories(categories);
    }
    Trace.setCategories = setCategories;
    /**
     * Adds categories to existing categories the module will trace.
     * @param categories The comma-separated list of categories. If not specified all messages from all categories will be traced.
     */
    function addCategories(categories) {
        const split = categories.split(',');
        for (let i = 0; i < split.length; i++) {
            _categories[split[i].trim()] = true;
        }
    }
    Trace.addCategories = addCategories;
    /**
     * Check if category is already set in trace module.
     * @param category The category to check.
     */
    function isCategorySet(category) {
        return category in _categories;
    }
    Trace.isCategorySet = isCategorySet;
    /**
     * Writes a message using the available writers.
     * @param message The message to be written.
     * @param category The category of the message.
     * @param type Optional, the type of the message - info, warning, error.
     */
    function write(message, category, type) {
        // print error no matter what
        let i;
        if (type === messageType.error) {
            for (i = 0; i < _writers.length; i++) {
                _writers[i].write(message, category, type);
            }
            return;
        }
        if (!enabled) {
            return;
        }
        if (!(category in _categories)) {
            return;
        }
        for (i = 0; i < _writers.length; i++) {
            _writers[i].write(message, category, type);
        }
    }
    Trace.write = write;
    /**
     * Notifies all the attached listeners for an event that has occurred in the sender object.
     * @param object The Object instance that raised the event.
     * @param name The name of the raised event.
     * @param data An optional parameter that passes the data associated with the event.
     */
    function notifyEvent(object, name, data) {
        if (!enabled) {
            return;
        }
        let i, listener, filters;
        for (i = 0; i < _eventListeners.length; i++) {
            listener = _eventListeners[i];
            if (listener.filter) {
                filters = listener.filter.split(',');
                filters.forEach((value) => {
                    if (value.trim() === name) {
                        listener.on(object, name, data);
                    }
                });
            }
            else {
                listener.on(object, name, data);
            }
        }
    }
    Trace.notifyEvent = notifyEvent;
    function addEventListener(listener) {
        _eventListeners.push(listener);
    }
    Trace.addEventListener = addEventListener;
    function removeEventListener(listener) {
        const index = _eventListeners.indexOf(listener);
        if (index >= 0) {
            _eventListeners.splice(index, 1);
        }
    }
    Trace.removeEventListener = removeEventListener;
    let messageType;
    (function (messageType) {
        messageType.log = 0;
        messageType.info = 1;
        messageType.warn = 2;
        messageType.error = 3;
    })(messageType = Trace.messageType || (Trace.messageType = {}));
    /**
     * all predefined categories.
     */
    let categories;
    (function (categories) {
        categories.Accessibility = 'Accessibility';
        categories.VisualTreeEvents = 'VisualTreeEvents';
        categories.Layout = 'Layout';
        categories.Style = 'Style';
        categories.ViewHierarchy = 'ViewHierarchy';
        categories.NativeLifecycle = 'NativeLifecycle';
        categories.Debug = 'Debug';
        categories.Navigation = 'Navigation';
        categories.Test = 'Test';
        categories.Binding = 'Binding';
        categories.BindingError = 'BindingError';
        categories.Error = 'Error';
        categories.Animation = 'Animation';
        categories.Transition = 'Transition';
        categories.Livesync = 'Livesync';
        categories.ModuleNameResolver = 'ModuleNameResolver';
        categories.separator = ',';
        categories.All = [categories.VisualTreeEvents, categories.Layout, categories.Style, categories.ViewHierarchy, categories.NativeLifecycle, categories.Debug, categories.Navigation, categories.Test, categories.Binding, categories.Error, categories.Animation, categories.Transition, categories.Livesync, categories.ModuleNameResolver].join(categories.separator);
        function concat(...args) {
            let result;
            for (let i = 0; i < args.length; i++) {
                if (!result) {
                    result = args[i];
                    continue;
                }
                result = result.concat(categories.separator, args[i]);
            }
            return result;
        }
        categories.concat = concat;
    })(categories = Trace.categories || (Trace.categories = {}));
    class ConsoleWriter {
        write(message, category, type) {
            if (!console) {
                return;
            }
            let msgType;
            if (type === undefined) {
                msgType = messageType.log;
            }
            else {
                msgType = type;
            }
            switch (msgType) {
                case messageType.log:
                    console.log(category + ': ' + message);
                    break;
                case messageType.info:
                    console.info(category + ': ' + message);
                    break;
                case messageType.warn:
                    console.warn(category + ': ' + message);
                    break;
                case messageType.error:
                    console.error(category + ': ' + message);
                    break;
            }
        }
    }
    // register a ConsoleWriter by default
    addWriter(new ConsoleWriter());
    class DefaultErrorHandler {
        handlerError(error) {
            throw error;
        }
    }
    Trace.DefaultErrorHandler = DefaultErrorHandler;
    setErrorHandler(new DefaultErrorHandler());
    function getErrorHandler() {
        return _errorHandler;
    }
    Trace.getErrorHandler = getErrorHandler;
    function setErrorHandler(handler) {
        _errorHandler = handler;
    }
    Trace.setErrorHandler = setErrorHandler;
    /**
     * Passes an error to the registered ErrorHandler
     * @param error The error to be handled.
     */
    function error(error) {
        if (!_errorHandler) {
            return;
        }
        if (typeof error === 'string') {
            error = new Error(error);
        }
        _errorHandler.handlerError(error);
    }
    Trace.error = error;
})(Trace || (Trace = {}));
//# sourceMappingURL=index.js.map