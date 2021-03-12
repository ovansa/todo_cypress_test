class CommonPageFields {
    getHeaderTitleField() {
        return cy.get('h3');
    }

    getDescriptionField() {
        return cy.get(':nth-child(1) > .form-control');
    }

    getResponsibleField() {
        return cy.get(':nth-child(2) > .form-control');
    }

    getPriorityLevelField(priorityValue) {
        const priorityTag = '#priority'+ priorityValue
        return cy.get(priorityTag);
    }

    getCreateButton() {
        return cy.get('.btn');
    }

    getActionButton(name) {
        return cy.get('.btn').contains(name);
    }
}

export default CommonPageFields;