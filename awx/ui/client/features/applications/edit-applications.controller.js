function AddApplicationsController (models, $state, strings, $scope) {
    const vm = this || {};

    const { me, application, organization } = models;

    // TODO: implement omitted fields
    const omit = [];
    const isEditable = application.isEditable();

    vm.mode = 'edit';
    vm.strings = strings;
    vm.panelTitle = application.get('name');

    vm.tab = {
        details: {
            _active: true,
            _go: 'applications.edit',
            _params: { application_id: application.get('id') }
        },
        permissions: {
            _go: 'applications.edit.permissions',
            _params: { application_id: application.get('id') }
        }
    };

    $scope.$watch('$state.current.name', (value) => {
        if (/applications.edit($|\.organization$)/.test(value)) {
            vm.tab.details._active = true;
            vm.tab.permissions._active = false;
        } else {
            vm.tab.permissions._active = true;
            vm.tab.details._active = false;
        }
    });

    // Only exists for permissions compatibility
    $scope.application_obj = application.get();

    if (isEditable) {
        vm.form = application.createFormSchema('put', { omit });
    } else {
        vm.form = application.createFormSchema({ omit });
        vm.form.disabled = !isEditable;
    }

    const isOrgAdmin = _.some(me.get('related.admin_of_organizations.results'), (org) => org.id === organization.get('id'));
    const isSuperuser = me.get('is_superuser');
    const isCurrentAuthor = Boolean(application.get('summary_fields.created_by.id') === me.get('id'));
    vm.form.organization._disabled = true;
    if (isSuperuser || isOrgAdmin || (application.get('organization') === null && isCurrentAuthor)) {
        vm.form.organization._disabled = false;
    }

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

    vm.form.save = data => {
        data.user = me.get('id');
        application.unset('inputs');
        return application.request('put', { data });
    };

    vm.form.onSaveSuccess = () => {
        $state.go('applications.edit', { application_id: application.get('id') }, { reload: true });
    };
}

AddApplicationsController.$inject = [
    'resolvedModels',
    '$state',
    'ApplicationsStrings',
    '$scope'
];

export default AddApplicationsController;
