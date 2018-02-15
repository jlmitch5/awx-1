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
            _params: { appication_id: application.get('id') }
        },
        permissions: {
            _go: 'applications.edit.permissions',
            _params: { appication_id: application.get('id') }
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

    vm.form.organization._resource = 'organization';
    vm.form.organization._route = 'applications.edit.organization';
    vm.form.organization._model = organization;
    vm.form.organization._placeholder = strings.get('inputs.ORGANIZATION_PLACEHOLDER');
    vm.form.organization._value = application.get('summary_fields.organization.id');
    vm.form.organization._displayValue = application.get('summary_fields.organization.name');

    vm.form.uri.help_text = application.get('inputs.URI_HELP_TEXT');

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
