describe('Calendar page test', () => {
  it('interacts with the calendar', () => {
    cy.visit('/')

    cy.contains('Naptár').click()

    cy.url().should('include', '/rooms/3')

    const today = new Date()

    cy.get('.fc-today').find('span')
      .should('include.text', `${today.getMonth() + 1}. ${today.getDate()}.`)

    cy.get('.fc-icon-chevron-right').click()
    cy.contains('ma').click()

    cy.get('.fc-today').find('span')
      .should('include.text', `${today.getMonth() + 1}. ${today.getDate()}.`)

  })
})
