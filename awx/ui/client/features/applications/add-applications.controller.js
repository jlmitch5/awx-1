function AddApplicationsController (models, $state, strings) {
    const vm = this || {};

    const { application, organization } = models;

    vm.mode = 'add';
    vm.strings = strings;
    vm.panelTitle = strings.get('add.PANEL_TITLE');

    vm.tab = {
        details: { _active: true },
        permissions: { _disabled: true },
        users: { _disabled: true }
    };

    vm.form = application.createFormSchema('post');

    vm.form.disabled = !application.isCreatable();

    vm.form.organization._resource = 'organization';
    vm.form.organization._route = 'applications.add.organization';
    vm.form.organization._model = organization;
    vm.form.organization._placeholder = strings.get('SELECT AN ORGANIZATION');

    vm.form.name.required = true;
    vm.form.organization.required = true;
    delete vm.form.name.help_text;
    delete vm.form.description.help_text;

    vm.form.uri = {
        required: true,
        label: 'URI',
        help_text: 'Space-separated list of URIs for authenticating applications'
    };

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
