describe('Theme tests', () => {
  it('checks cookies and stylings after theme change', () => {
    cy.visit('/')

    cy.get('.cursor-pointer').last().find('svg').click()
    cy.getCookie('theme').should('have.property', 'value', 'dark')
    cy.contains('Tanulószobák').should(
      'css',
      'background-color',
      'rgb(79, 70, 229)'
    )
    cy.contains('Foglalás').should(
      'css',
      'background-color',
      'rgb(167, 139, 250)'
    )

    cy.get('.cursor-pointer').last().find('svg').click()
    cy.getCookie('theme').should('have.property', 'value', 'light')
    cy.contains('Tanulószobák').should(
      'css',
      'background-color',
      'rgb(249, 250, 251)'
    )
    cy.contains('Foglalás').should(
      'css',
      'background-color',
      'rgb(254, 215, 170)'
    )
  })
})
