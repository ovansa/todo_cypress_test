/// <reference types="Cypress" />

function generateRandomText(prefix) {
    return prefix + Math.random().toString(36).substring(2, 10)
}

describe('DELETE TODO ENDPOINT SCENARIOS', () => {
    it('Scenario 1: A todo can be deleted successfully - verify that deleted \
    todo is not in todo list', () => {
        // Generate a random unique Responsible text
        const descriptionText = generateRandomText('Responsible');
        var todo_id = ''

        // Create a todo
        cy.request({
            method: "POST", url: Cypress.env('backend_url') + 'add', failOnStatusCode: false, body: {
                "todo_description": descriptionText
            }, headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            expect(response.status).to.eql(200)
            expect(response.body.todo).to.eql("todo added successfully")
        }).then((response) => {
            // Fetch the list of todos via get todos endpoint
            cy.request({
                method: "GET", url: Cypress.env('backend_url'), failOnStatusCode: false, headers: {
                    "Content-Type": "application/json"
                }
            }).then((response) => {
                let todos = response.body
                let description_list = []

                // Search for the created description in todo list and get the todo id
                todos.forEach(todo => {
                    description_list.push(todo.todo_description)
                    if (todo.todo_description == descriptionText) {
                        todo_id = todo._id
                    }
                })
                expect(description_list).to.include(descriptionText);
            }).then(() => {
                // Delete the todo
                cy.request({
                    method: "DELETE", url: Cypress.env('backend_url') + 'delete/' + todo_id, failOnStatusCode: false, headers: {
                        "Content-Type": "application/json"
                    }
                }).then((response) => {
                    expect(response.body).to.equal('Todo deleted')
                })
            }).then(() => {
                // Fetch the list of todos via get todos endpoint
                cy.request({
                    method: "GET", url: Cypress.env('backend_url'), failOnStatusCode: false, headers: {
                        "Content-Type": "application/json"
                    }
                }).then((response) => {
                    let todos = response.body
                    let description_list = []
                    let todo_ids = []

                    // Loops through response to fetch todo descriptions and ids
                    todos.forEach(todo => {
                        description_list.push(todo.todo_description)
                        todo_ids.push(todo._id)
                    })

                    // Checks that the deleted id and todo description does not exist in list of todos
                    expect(todo_ids).not.to.include(todo_id)
                    expect(description_list).not.to.include(descriptionText);
                })
            })
        })
    })
})