describe('shortener', () => {

  beforeEach(() => cy.visit('127.0.0.1:9000/'))

  describe('When I switch the theme', () => {

    it.only('Colors must change', () => {

      cy.get('#app__viewport').should((elem) => {
        expect(elem).to.not.have.css('background-color', 'rgb(255, 255, 255)')
      })

      cy.waitUntil( () => cy.get('#app__viewport__theme__switch__label'), { interval: 100 })
      cy.get('#app__viewport__theme__switch__label').click()

      cy.get('#app__viewport').should((elem) => {
        expect(elem).to.have.css('background-color', 'rgb(7, 9, 18)')
      })

    })

  })

})
