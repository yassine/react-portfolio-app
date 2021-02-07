### Requisites
* Java (developed under JDK 12 installed with sdkman)
* docker, docker-compose


### Coverage
To generate coverage reports run:

`./gradlew clean :stord-shortener-service:test :stord-shortener-app:app:ci`

Coverage reports will be available under:

1. backend: 
   `./stord-shortener-service/build/reports/jacoco/test/html`
1. front-end: 
   `./stord-shortener-app/app/coverage/lcov-report/index.html`


### Run
To run the application (It may take around 2 minutes):
(Make sure to have 9080 & 9081 ports available, or edit the template file
`./stord-shortener-deployment/docker-compose-template.yml` to your convenience)

`./gradlew clean :stord-shortener-deployment:dockerComposeUp`

The front-end application will available at the [http://127.0.0.1:9080]()
