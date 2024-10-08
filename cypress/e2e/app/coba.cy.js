/// <reference types="cypress" />

describe('coba coba dulu', () => {
   beforeEach(() => {
      cy.visit('http://localhost:3000/coba')
   })
   it('can type in disabled input', () => {
      cy.contains('Nama:').parent().find('input').type('asdf').should('have.value', 'asdf')
   })
});