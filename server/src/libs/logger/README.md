## Logger

This logger library uses one worker thread to write the logs.

There is the concept of a **logger**, which is basically an **object identified by an id**, containing **configurations** regarding where to **write the logs to** and how to **group logs**.

It is possible to have as many logger objects as wanted. The concept of logger is independent of the writing mechanism, in the sense that, there is only one worker thread which handles all log writing.

### Supported functionalities:
- Writing logs to files and console, however it is simple to add different data-sources (take a look at the [interface](./driven/repositories/logsRepository.ts) and a possible [implementation](./driven/data-sources/logsFileAdapter.ts)).
- Grouping logs
- Different log levels
- Log files rotation (set by default to intervals of 1h) 
- Traceability via specified or auto-generated ids

### How to use:

Available logging functions:
```Typescript
logInfo(message?: any, ...optionalParams: any[])
logDebug(message?: any, ...optionalParams: any[])
logWarn(message?: any, ...optionalParams: any[])
logError(message?: any, ...optionalParams: any[])
```
Currently they are only used to prefix the log message with the log level. Nothing else changes in the behavior.

---

Function used to register a logger:
```Typescript
wrapWithLogger<T>(fn: (...args: any[]) => T, options: LoggerOptions): ((...args: any[]) => T)
```

Available configurations for a logger:
```Typescript
type LoggerOptions = {
  // depends on implementation:
  // - File output -> each group will correspond to a file with the logGroup as name
  // - Console output -> the message will be prefixed with the logGroup
  // multiple simultaneous logGroups supported
  // defaults to 'general'
  logGroups?: string[];

  // specify where to output the log
  // multiple simultaneous outputs supported
  // defaults to FILE
  outputTypes?: LoggerOutputType[];

  // in case the id is not specified, the id of a parent logger is used
  // and if one cannot be found, a new id is generated
  // if the id already exists (i.e., either because the specified one 
  // already existed or a parent logger id was found), the logger associated
  // with that id will be updated by adding the logGroups and outputTypes specified here
  id?: string;

  // specifies if the function being wrapped by this logger is async
  // defaults to false
  isAsyncFn?: boolean;
};

enum LoggerOutputType {
  CONSOLE = 'CONSOLE',
  FILE = 'FILE'
}
```
Any log written in the scope of the function wrapped (including nested calls of any depth), will comply with the configurations specified by *LoggerOptions*.

Logs written will be associated with the most immeadiate logger (i.e., the logger that was created closer to the log call, in the call stack).
Keep in mind that although you may have multiple wrapWithLogger calls in a given call stack, you may have only one logger, or multiple loggers, depending whether an id is specified for each.

Example:
```Typescript
const fn1 = () => logDebug("Hello. I'm a debug log!")

const fn2 = wrapWithLogger(fn1)()

const fn3 = wrapWithLogger(fn2, { id: 'some_logger_id' })()
fn3()

// Only 1 logger is created here, which is a result of calling fn3
// fn2 will inherit the parent logger id (i.e., 'some_logger_id')
// even if no id had been specified in fn3, an id would have been generated
// and the behavior would have been exactly the same
```

```Typescript
const fn1 = () => logDebug("Hello. I'm a debug log!")

const fn2 = wrapWithLogger(fn1, { id: 'child_logger_id' })()

const fn3 = wrapWithLogger(fn2, { id: 'parent_logger_id' })()
fn3()

// In this case 2 loggers are created, as both fn3 and fn2 specify their own id
```

### Improvements:
- Support a version that does not use worker threads