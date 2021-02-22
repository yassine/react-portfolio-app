### Requisites
* Java (developed under JDK 12)
* docker, docker-compose

### Performance
Backend average latency is less than 1ms ( logged in microseconds 😇 ).
e2e average latency : 452 µs
e2e max latency : 12918 µs
e2e min latency : 17 µs
throughput: 8688 requests /s

### Coverage
To generate coverage reports run:

`./gradlew clean test ci`

Coverage reports will be available under:

1. backend: 
   `./shortener-service/build/reports/jacoco/test/html/index.html`
2. front-end: 
   `./shortener-app/app/coverage/lcov-report/index.html`


### Run
To run the application (It may take a couple of minutes):

`./gradlew clean dockerComposeUp`

Note: make sure to have 9080 & 9081 ports available, or edit the template file `./shortener-deployment/docker-compose-template.yml` to your convenience.

The front-end application will available at the [http://127.0.0.1:9080]()
