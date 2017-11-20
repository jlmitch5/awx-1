function ListTemplatesController (models, strings) {
    console.log("got in the list templates controller");
    const vm = this || {};

    const { unifiedJobTemplate } = models;

    console.log(unifiedJobTemplate);

    vm.templates = unifiedJobTemplate.model.GET;

    // const omit = ['user', 'team', 'inputs'];

    // vm.strings = strings;
    // TODO: pull from strings file
    vm.panelTitle = 'Templates';
}

ListTemplatesController.$inject = [
    'resolvedModels',
    'TemplatesStrings'
];

export default ListTemplatesController;
