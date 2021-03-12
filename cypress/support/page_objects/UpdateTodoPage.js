class UpdateTodoPage {
    getCompletedCheckBox() {
        return cy.get('#completedCheckbox');
    }

    getDeleteButton() {
        return cy.get(':nth-child(7) > .btn');
    }
}

export default UpdateTodoPage;