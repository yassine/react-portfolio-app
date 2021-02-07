const text = require('../../resources/text.json');

describe('shortener', () => {
  const USER_URL  = 'http://127.0.0.1:9000/#/?hello=qa'
  const MOCK_HASH = 'myMockedHash'

  describe('When I visit the redirect view with a non existing key', () => {


    beforeEach(() => {
      cy.intercept('GET', `http://127.0.0.1:9000/api/${MOCK_HASH}`, {
        statusCode: 404
      })
      cy.visit('127.0.0.1:9000/#/NO_KEY')
    })

    it.only('I should a message indicating an error', () => {

      cy.waitUntil( () => cy.get('#app__shortener__redirect__wait'), { interval: 10 })

      cy.get('#app__shortener__redirect__wait').should((elem) => {
        expect(elem.text().toLowerCase())
          .to.contain('resolving your url')
      })

      cy.waitUntil( () => cy.get('#app__shortener__redirect__error'), { interval: 100 })

      cy.get('#app__shortener__redirect__error').should((elem) => {
        expect(elem.text().toLowerCase())
          .to.contain('wrong url')
      })

    })


  })

  describe('When I visit the redirect view with a an existing key', () => {

    beforeEach(() => {
      cy.intercept('GET', `http://127.0.0.1:9000/api/${MOCK_HASH}`, {
        statusCode: 200,
        body: `"${USER_URL}"`
      })
      cy.visit('127.0.0.1:9000/#/' + MOCK_HASH)
    })

    it.only('I should a message indicating I\'m being redirected', () => {

      cy.waitUntil( () => cy.get('#app__shortener__redirect__wait'), { interval: 10 })

      cy.get('#app__shortener__redirect__wait').should((elem) => {
        expect(elem.text().toLowerCase())
          .to.contain('resolving your url')
      })

      cy.waitUntil( () => cy.get('#app__shortener__redirect__redirect'), { interval: 100 })

      cy.get('#app__shortener__redirect__redirect').should((elem) => {
        expect(elem.text())
          .to.contain(text['app.shortener.redirect.redirecting'])
      })

    })


  })

})
