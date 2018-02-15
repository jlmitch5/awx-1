function AddApplicationsController (models, $state, strings) {
    const vm = this || {};

    const { application, organization } = models;

    vm.mode = 'add';
    vm.strings = strings;
    vm.panelTitle = strings.get('add.PANEL_TITLE');

    vm.tab = {
        details: { _active: true },
        permissions: { _disabled: true }
    };

    vm.form = application.createFormSchema('post');

    vm.form.disabled = !application.isCreatable();

    vm.form.organization._resource = 'organization';
    vm.form.organization._route = 'applications.add.organization';
    vm.form.organization._model = organization;
    vm.form.organization._placeholder = strings.get('inputs.ORGANIZATION_PLACEHOLDER');

    vm.form.uri.help_text = application.get('inputs.URI_HELP_TEXT');

    vm.form.save = data => application.request('post', { data });

    vm.form.onSaveSuccess = res => {
        $state.go('applications.edit', { application_id: res.data.id }, { reload: true });
    };
}

AddApplicationsController.$inject = [
    'resolvedModels',
    '$state',
    'ApplicationsStrings'
];

export default AddApplicationsController;
