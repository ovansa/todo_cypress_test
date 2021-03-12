/// <reference types="Cypress" />

function generateRandomText(prefix) {
    return prefix + Math.random().toString(36).substring(2, 10)
}

describe('ADD TODO ENDPOINT SCENARIOS', () => {

    it('Scenario 1: Todo can be created successfully with only Descaription \
    field - validate status code, success message', function() {
        // Generate a random unique description text
        const descriptionText = generateRandomText('Description');

        cy.request({
            method: "POST", url: Cypress.env('backend_url') + 'add', failOnStatusCode: false, body: {
                "todo_description": descriptionText
            }, headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            expect(response.status).to.eql(200);
            expect(response.body.todo).to.eql("todo added successfully")
        })
    })

    it('Scenario 2: Todo can be created successfully with only Responsible \
    field - validate status code, success message', () => {
        // Generate a random unique Responsible text
        const responsibleText = generateRandomText('Responsible');

        cy.request({
            method: "POST", url: Cypress.env('backend_url') + 'add', failOnStatusCode: false, body: {
                "todo_responsible": responsibleText
            }, headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.todo).to.eql("todo added successfully")
        })
    })

    it('Scenario 3: Todo can be created successfully with only Description - validate that the created todo\
     is returned in list of todos', () => {
        // Generate a random unique description text
        const descriptionText = generateRandomText('Description');

        // Create a todo with the generated description via create todo endpoint
        cy.request({
            method: "POST", url: Cypress.env('backend_url') + 'add', failOnStatusCode: false, body: {
                "todo_description": descriptionText
            }, headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.todo).to.eql("todo added successfully")
        }).then(() => {
            // Fetch the list of todos via get todos endpoint
            cy.request({
                method: "GET", url: Cypress.env('backend_url'), failOnStatusCode: false, headers: {
                    "Content-Type": "application/json"
                }
            }).then((response) => {
                let todos = response.body
                let description_list = []
                
                // Search for the created description in todo list
                todos.forEach(todo => {
                    description_list.push(todo.todo_description)
                })
                expect(description_list).to.include(descriptionText);
            })
        })
    })
})