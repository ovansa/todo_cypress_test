/// <reference types="Cypress" />

import UpdateTodoPage from "../../support/page_objects/UpdateTodoPage";

const createButton = 'Create Todo';

function generateRandomText(prefix) {
    return prefix + Math.random().toString(36).substring(2, 10)
}

describe('DELETE TODO SCENARIOS', function () {
    it('Scenario 1: A todo can be deleted successfully: Verify that the deleted todo \
    is not present in the todo list table', function () {
        const updateTodoPage = new UpdateTodoPage()

        // Generate random values to fill the Todo form
        const randomDescriptionText = generateRandomText('Description')
        const randomResponsibleText = generateRandomText('Responsible')
        const priorityTypes = ['Low', 'Medium', 'High'];
        const randomPriority = priorityTypes[Math.floor(Math.random() * priorityTypes.length)];

        cy.navigateToAddTodoPage()

        // Create a new todo
        cy.fillTodoFormAndSubmit(randomDescriptionText, randomResponsibleText, randomPriority, createButton);

        /** Searches the list of table and validates that the entry i.e. Description, Responsible, and Priority
         in the form is the same as in table and click edit.
         */
        cy.get('tr td:nth-child(1)').contains(randomDescriptionText).should('have.length', 1).then(
            function () {
                cy.get('tr td:nth-child(1)').each(($e1, index, $list) => {
                    const text = $e1.text()
                    if (text.includes(randomDescriptionText)) {
                        // Checks that Responsible field is the same as created
                        cy.get('tr td:nth-child(1)').eq(index).next().then(function (value) {
                            const responsible = value.text()
                            expect(responsible).to.equal(randomResponsibleText)
                        })

                        // Checks that Priority field is the same as created
                        cy.get('tr td:nth-child(2)').eq(index).next().then(function (value) {
                            const priorityText = value.text()
                            expect(priorityText).to.equal(randomPriority)
                        })

                        // Click the edit link of selected todo 
                        cy.get('tr td:nth-child(3)').eq(index).next().contains('Edit').click().then(function () {

                            // Delete the new todo
                            updateTodoPage.getDeleteButton().click().then(function () {
                                cy.get('tr td').should('be.visible').then(function () {
                                    // Confirm the deleted todo is not in the todo list table
                                    cy.get('tr td:nth-child(1)').contains(randomDescriptionText).should('have.length', 0)
                                })
                            })
                        })
                    }
                })
            }
        )
    })
})