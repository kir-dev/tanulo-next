describe('My First Test', () => {
  it('Visits TanuloSCH', () => {
    cy.visit('http://localhost:3000/')

    cy.contains('Naptár').click()

    cy.url().should('include', '/rooms/3')
  })
})
