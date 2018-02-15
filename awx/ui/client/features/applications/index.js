import AddController from './add-applications.controller';
import EditController from './edit-applications.controller';
import ListController from './list-applications.controller';
import ApplicationsStrings from './applications.strings';

const MODULE_NAME = 'at.features.applications';

const addEditTemplate = require('~features/applications/add-edit-applications.view.html');
const listTemplate = require('~features/applications/list-applications.view.html');
const indexTemplate = require('~features/applications/index.view.html');

function ApplicationsDetailResolve ($q, $stateParams, Me, Application, Organization) {
    const id = $stateParams.application_id;

    const promises = {
        me: new Me('get').then((me) => me.extend('get', 'admin_of_organizations'))
    };

    if (!id) {
        promises.application = new Application('options');
        promises.organization = new Organization();

        return $q.all(promises);
    }

    promises.application = new Application(['get', 'options'], [id, id]);

    return $q.all(promises)
        .then(models => {
            const orgId = models.credential.get('organization');

            const dependents = {
                organization: new Organization('get', orgId)
            };

            return $q.all(dependents)
                .then(related => {
                    models.organization = related.organization;

                    return models;
                });
        });
}

ApplicationsDetailResolve.$inject = [
    '$q',
    '$stateParams',
    'MeModel',
    'ApplicationModel',
    'OrganizationModel'
];

function ApplicationsRun ($stateExtender, strings) {
    $stateExtender.addState({
        name: 'applications',
        route: 'applications',
        ncyBreadcrumb: {
            label: strings.get('state.LIST_BREADCRUMB_LABEL')
        },
        data: {
            activityStream: true,
            // TODO: double-check activity stream works
            activityStreamTarget: 'application'
        },
        views: {
            '@': {
                templateUrl: indexTemplate,
            },
            'list@applications': {
                templateUrl: listTemplate,
                controller: ListController,
                controllerAs: 'vm'
            }
        },
        searchPrefix: 'application',
        resolve: {
            resolvedModels: [
                'ApplicationModel',
                (Application) => new Application(['options'])
            ],
            Dataset: [
                '$stateParams',
                'Wait',
                'GetBasePath',
                'QuerySet',
                ($stateParams, Wait, GetBasePath, qs) => {
                    const searchParam = $stateParams.application_search;
                    // TODO: get actual search path
                    const searchPath = GetBasePath('projects');

                    Wait('start');
                    return qs.search(searchPath, searchParam)
                        .finally(() => Wait('stop'));
                }
            ],
        }
    });

    $stateExtender.addState({
        name: 'applications.add',
        route: '/add',
        ncyBreadcrumb: {
            label: strings.get('state.ADD_BREADCRUMB_LABEL')
        },
        data: {
            activityStream: true,
            // TODO: double-check activity stream works
            activityStreamTarget: 'application'
        },
        views: {
            'add@applications': {
                templateUrl: addEditTemplate,
                controller: AddController,
                controllerAs: 'vm'
            }
        },
        resolve: {
            resolvedModels: ApplicationsDetailResolve
        }
    });

    $stateExtender.addState({
        name: 'applications.edit',
        route: '/:credential_id',
        ncyBreadcrumb: {
            label: strings.get('state.EDIT_BREADCRUMB_LABEL')
        },
        data: {
            activityStream: true,
            activityStreamTarget: 'application',
            activityStreamId: 'application_id'
        },
        views: {
            'edit@applications': {
                templateUrl: addEditTemplate,
                controller: EditController,
                controllerAs: 'vm'
            }
        },
        resolve: {
            resolvedModels: ApplicationsDetailResolve
        }
    });
}

ApplicationsRun.$inject = [
    '$stateExtender',
    'ApplicationsStrings'
];

angular
    .module(MODULE_NAME, [])
    .controller('AddController', AddController)
    .controller('EditController', EditController)
    .service('ApplicationsStrings', ApplicationsStrings)
    .run(ApplicationsRun);

export default MODULE_NAME;
