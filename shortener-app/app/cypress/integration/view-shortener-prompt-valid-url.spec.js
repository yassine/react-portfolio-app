describe('view-shortener-prompt-valid-urls', () => {

  const USER_URL  = 'http://127.0.0.1:9000/#/?hello=qa'
  const MOCK_HASH = 'myMockedHash'

  beforeEach(function() {
    cy.visit('127.0.0.1:9000')
    cy.intercept('POST','http://127.0.0.1:9000/api', {
      statusCode: 200,
      body: `"${MOCK_HASH}"`
    })
    cy.intercept('GET', `http://127.0.0.1:9000/api/${MOCK_HASH}`, {
      statusCode: 200,
      body: `"${USER_URL}"`
    })
  })

  describe('When I enter a valid URL and click on Submit', () => {
    let url;

    it.only('I should get a shortened url to use', () => {

      cy.get('#app__shortener__prompt__input').type(USER_URL)
      cy.get('#app__shortener__shorten__button').click()

      // make sure the button get the loading class
      cy.waitUntil( () =>
          cy.get('#app__shortener__shorten__button')
            .then($elem => $elem.hasClass('loading'))
        , { interval: 10 }
      )

      // make sure the button get the success class
      cy.waitUntil( () =>
          cy.get('#app__shortener__shorten__button')
            .then($elem => $elem.hasClass('success'))
        , { interval: 10 }
      )

      // make sure the input containing the shortened url has some text in it
      cy.waitUntil( () =>
        cy.get('#app__shortener__result__url_input')
          .invoke('val')
          .then(value => value && value.length > 0), { interval: 300 }
      )

      // make sure the input containing the shortened url has a token in it
      cy.get('#app__shortener__result__url_input')
        .invoke('val')
        .then((value) => {
          //extract the token from the url
          const token = value.replaceAll('http://127.0.0.1:9000/#/', '')
          expect(token).to.match(/^[0-9a-zA-Z]+$/)
          url = value;
        })

    })

    it.only('I should be redirected to the original url if I use the shortened one', () => {
      if (url) {
        cy.visit(url)
        cy.location().should((loc) => {
          expect(loc.hash).to.eq('#/?hello=qa')
          expect(loc.host).to.eq('127.0.0.1:9000')
          expect(loc.hostname).to.eq('127.0.0.1')
        });
      } else {
        throw 'No url'
      }
    })

  })

})
