const text = require('../../resources/text.json');

describe('view-shortener-prompt-non-valid-urls', () => {

  beforeEach(function() {
    cy.visit('127.0.0.1:9000')
  })

  describe('When I enter a invalid URL and click on Submit', () => {
    it.only('I should get an error indicating a malformed url', () => {
      cy.get('#app__shortener__prompt__input').type('Hello')
      cy.get('#app__shortener__shorten__button').click()
      cy.get('#app__shortener__shorten__callout')
      cy.waitUntil(() => cy.get('#app__shortener__shorten__callout') )
      cy.get('#app__shortener__shorten__callout').should((elem) => {
        expect(elem.text()).to.equal(text['app.shortener.validation.url_syntax'])
      })
    })
  })

  describe('When I enter a no URL and click on Submit', () => {
    it.only('I should get an error indicating a missing url', () => {
      cy.get('#app__shortener__prompt__input').clear()
      cy.get('#app__shortener__shorten__button').click()
      cy.get('#app__shortener__shorten__callout')
      cy.waitUntil(() => cy.get('#app__shortener__shorten__callout') )
      cy.get('#app__shortener__shorten__callout').should((elem) => {
        expect(elem.text()).to.equal(text['app.shortener.validation.no_url'])
      })
    })
  })

})
