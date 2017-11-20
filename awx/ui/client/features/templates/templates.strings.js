function TemplatesStrings (BaseString) {
    BaseString.call(this, 'templates');

    const { t } = this;
    const ns = this.templates;

    ns.state = {
        LIST_BREADCRUMB_LABEL: t.s('TEMPLATES')
    }

    ns.list = {
        PANEL_TITLE: t.s('TEMPLATES')
    }
}

TemplatesStrings.$inject = ['BaseStringService'];

export default TemplatesStrings;
