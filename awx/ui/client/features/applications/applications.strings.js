function ApplicationsStrings (BaseString) {
    BaseString.call(this, 'applications');

    const { t } = this;
    const ns = this.applications;

    ns.state = {
        LIST_BREADCRUMB_LABEL: t.s('APPLICATIONS'),
        ADD_BREADCRUMB_LABEL: t.s('CREATE APPLICATION'),
        EDIT_BREADCRUMB_LABEL: t.s('EDIT APPLICATION')
    };

    ns.tab = {
        DETAILS: t.s('Details'),
        PERMISSIONS: t.s('Permissions'),
        USERS: t.s('Users')
    };

    ns.inputs = {
        // TODO: update with docs' suggestion.
        URI_HELP_TEXT: t.s('Application URI with which to authenticate')
    };

    ns.add = {
        PANEL_TITLE: t.s('NEW APPLICATION')
    };

    ns.permissions = {
        TITLE: t.s('APPLICATIONS PERMISSIONS')
    };

    ns.list = {
        ROW_ITEM_LABEL_ORGANIZATION: t.s('ORG'),
        ROW_ITEM_LABEL_MODIFIED: t.s('LAST MODIFIED')
    };
}

ApplicationsStrings.$inject = ['BaseStringService'];

export default ApplicationsStrings;
