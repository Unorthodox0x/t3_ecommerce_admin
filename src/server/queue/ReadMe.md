## Queue Worker

Background worker for high loaded processes
* worker makes 2 attempts
* each attempt interval takes more time
* if worker did more than configured count of attempts it will be closed

### config.js
  	This file has all needed data for queue job run
* redis connection config
* queue job names
* queue job run configurations

### producer.js
    Responsible for processing and launching queue jobs
* createBill
* updateBill
* createTransaction
* updateTransaction

### queue-processes.js
    File with all existing types of queue processes