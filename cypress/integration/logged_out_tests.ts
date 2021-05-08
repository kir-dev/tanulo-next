describe('Logged out tests', () => {
  it('checks responses when the user is not logged in', () => {
    cy.visit('/')

    cy.contains('Foglalás').click()
    cy.url().should('include', '/groups/new/?roomId=3')
    cy.contains('Az oldal megtekintéséhez bejelentkezés szükséges!')

    cy.contains('Csoportok').click()
    cy.url().should('include', '/groups')
    cy.contains('Az oldal megtekintéséhez bejelentkezés szükséges!')

    cy.contains('Hibajegyek').click()
    cy.url().should('include', '/tickets')
    cy.contains('Az oldal megtekintéséhez bejelentkezés szükséges!')
  })
})
  