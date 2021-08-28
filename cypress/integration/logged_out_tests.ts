describe('Logged out tests', () => {
  it('checks responses when the user is not logged in', () => {
    const loggedOutText = 'Az oldal megtekintéséhez bejelentkezés szükséges!'
    
    cy.visit('/')

    cy.contains('Foglalás').click()
    cy.url().should('include', '/groups/new/?roomId=3')
    cy.contains(loggedOutText)

    cy.contains('Csoportok').click()
    cy.url().should('include', '/groups')
    cy.contains(loggedOutText)

    cy.contains('Hibajegyek').click()
    cy.url().should('include', '/tickets')
    cy.contains(loggedOutText)

    cy.contains('TanulóSCH').click()
    cy.contains('Naptár').click()
    cy.url().should('include', '/rooms/')
    cy.get('.fc-timegrid-slot-lane').first().click()
    cy.url().should('include', '/groups/new?start=')
    cy.contains(loggedOutText)
  })
})
  