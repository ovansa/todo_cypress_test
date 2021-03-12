/// <reference types="Cypress" />
import CommonPageFields from '../../support/page_objects/CommonPageFields'
import UpdateTodoPage from '../../support/page_objects/UpdateTodoPage'

const updateButton = 'Update Todo';
const createButton = 'Create Todo';

function generateRandomText(prefix) {
    return prefix + Math.random().toString(36).substring(2, 10)
}

describe('UPDATE TODO SCENARIOS', function () {
    it('Scenario 1: The details of the todo selected by clicking edit button is prefilled in todo update page: \
    Verify that the prefilled Description, Responsible, and Priority is the same as that selected from the todo list table', function () {
        const commonPageFields = new CommonPageFields()

        // Generate random values to fill the Todo form
        const randomDescriptionText = generateRandomText('Description')
        const randomResponsibleText = generateRandomText('Responsible')
        const priorityTypes = ['Low', 'Medium', 'High'];
        const randomPriority = priorityTypes[Math.floor(Math.random() * priorityTypes.length)];

        var selectedDescription = ''
        var selectedResponsible = ''
        var selectedPriority = ''

        cy.navigateToAddTodoPage()

        // Create a todo
        cy.fillTodoFormAndSubmit(randomDescriptionText, randomResponsibleText, randomPriority, createButton);

        // Search for todo in Todo List table and click the edit link

        cy.get('tr td:nth-child(1)').contains(randomDescriptionText).should('have.length', 1).then(
            function () {
                cy.get('tr td:nth-child(1)').each(($e1, index, $list) => {
                    const text = $e1.text()
                    if (text.includes(randomDescriptionText)) {
                        // Gets the description text from the table
                        cy.get('tr td:nth-child(1)').eq(index).then(function (value) {
                            const description = value.text()
                            selectedDescription = description
                        }).then(function () {
                            // Checks that Responsible field is the same as created and gets the text
                            cy.get('tr td:nth-child(1)').eq(index).next().then(function (value) {
                                const responsible = value.text()
                                expect(responsible).to.equal(randomResponsibleText)
                                selectedResponsible = responsible
                            })
                        }).then(function () {
                            // Checks that Priority field is the same as created and gets the text
                            cy.get('tr td:nth-child(2)').eq(index).next().then(function (value) {
                                const priorityText = value.text()
                                expect(priorityText).to.equal(randomPriority)
                                selectedPriority = priorityText
                            })
                        }).then(function () {
                            // Click the edit link of todo 
                            cy.get('tr td:nth-child(3)').eq(index).next().contains('Edit').click()
                        }).then(function () {
                            // Verify that the texts in the text fields matches the selected todo from the Todo list table
                            commonPageFields.getDescriptionField().should('have.value', selectedDescription)
                            commonPageFields.getResponsibleField().should('have.value', selectedResponsible)
                            commonPageFields.getPriorityLevelField(selectedPriority).should('be.checked')
                        })
                    }
                })
            }
        )
    })


    it('Scenario 2: Todo can be completed i.e closed successfully: Validate that completed todo i.e. \
    Description, Responsible and Priority texts are crossed out in Todo List table', function () {
        const updateTodoPage = new UpdateTodoPage()
        const commonPageFields = new CommonPageFields()

        // Generate random values to fill the Todo form
        const randomDescriptionText = generateRandomText('Description')
        const randomResponsibleText = generateRandomText('Responsible')
        const priorityTypes = ['Low', 'Medium', 'High'];
        const randomPriority = priorityTypes[Math.floor(Math.random() * priorityTypes.length)];

        cy.navigateToAddTodoPage()

        // Create a todo
        cy.fillTodoFormAndSubmit(randomDescriptionText, randomResponsibleText, randomPriority, createButton);

        // Search for todo in Todo List table and click the edit link

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

                        // Click the edit link of todo 
                        cy.get('tr td:nth-child(3)').eq(index).next().contains('Edit').click()
                    }
                })
            }
        )

        // Click on completed checkbox
        updateTodoPage.getCompletedCheckBox().check()

        // Click on update button
        commonPageFields.getActionButton(updateButton).click()

        // Search for todo in Todo List table and verify that the texts are crossed-out.
        cy.get('tr td:nth-child(1)').contains(randomDescriptionText).should('have.length', 1).then(
            function () {
                cy.get('tr td:nth-child(1)').each(($e1, index, $list) => {
                    const text = $e1.text()
                    if (text.includes(randomDescriptionText)) {

                        // Checks that Description text is crossed
                        cy.get('tr td:nth-child(1)').eq(index).should('have.class', 'completed')

                        // Checks that Responsible text is crossed
                        cy.get('tr td:nth-child(1)').eq(index).next().should('have.class', 'completed')

                        // Checks that Priority text is crossed
                        cy.get('tr td:nth-child(2)').eq(index).next().should('have.class', 'completed')
                    }
                })
            }
        )
    })


    it('Scenario 3: Todo can be updated successfully: Validate that Description, Responsible and Priority \
    is the same as the updated values', function () {

        // Generate random values to fill the Todo form
        const randomDescriptionText = generateRandomText('Description')
        const randomResponsibleText = generateRandomText('Responsible')
        const randomDescriptionTextforUpdate = generateRandomText('Description')
        const randomResponsibleTextforUpdate = generateRandomText('Responsible')
        const priorityTypes = ['Low', 'Medium', 'High'];
        const randomPriority = priorityTypes[Math.floor(Math.random() * priorityTypes.length)];
        const randomPriorityToUpdate = priorityTypes[Math.floor(Math.random() * priorityTypes.length)];

        cy.navigateToAddTodoPage()

        // Create a todo
        cy.fillTodoFormAndSubmit(randomDescriptionText, randomResponsibleText, randomPriority, createButton);

        // Search for todo and click to edit

        cy.get('tr td:nth-child(1)').contains(randomDescriptionText).should('have.length', 1).then(
            function () {
                cy.get('tr td:nth-child(1)').each(($e1, index, $list) => {
                    const text = $e1.text()
                    if (text.includes(randomDescriptionText)) {
                        // Click the edit link of todo 

                        cy.get('tr td:nth-child(3)').eq(index).next().contains('Edit').click().then(
                            function () {
                                // Update the Description, Responsible, Priority fields; and Update form        
                                cy.clearForm()
                                cy.fillTodoFormAndSubmit(randomDescriptionTextforUpdate, randomResponsibleTextforUpdate,
                                    randomPriorityToUpdate, updateButton).then(
                                        function () {
                                            cy.get('tr td:nth-child(1)').each(($e1, index, $list) => {
                                                const text = $e1.text()
                                                if (text.includes(randomDescriptionTextforUpdate)) {

                                                    // Checks that Responsible field is the same as updated
                                                    cy.get('tr td:nth-child(1)').eq(index).next().then(function (value) {
                                                        const responsible = value.text()
                                                        expect(responsible).to.equal(randomResponsibleTextforUpdate)
                                                    })

                                                    // Checks that Priority field is the same as updated
                                                    cy.get('tr td:nth-child(2)').eq(index).next().then(function (value) {
                                                        const priorityText = value.text()
                                                        expect(priorityText).to.equal(randomPriorityToUpdate)
                                                    })
                                                }
                                            })
                                        }
                                    );
                            }
                        )
                    }
                })
            }
        )
    })
})