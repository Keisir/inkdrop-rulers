const { createRulersExtension } = require('./rulers-extension');
const { CompositeDisposable } = require('event-kit');
const { actions } = require('inkdrop');

class RulersPlugin {
    constructor() {
        this.disposables = new CompositeDisposable();
        this.extension = null;
    }

    activate() {
        this.extension = this.buildExtension();
        inkdrop.store.dispatch(actions.mde.addExtension(this.extension));

        const reload = () => this.reload();
        this.disposables.add(
            inkdrop.config.onDidChange('rulers.columns', reload),
        );
        this.disposables.add(
            inkdrop.config.onDidChange('rulers.colors', reload),
        );
        this.disposables.add(
            inkdrop.config.onDidChange('rulers.lineStyles', reload),
        );
    }

    deactivate() {
        this.disposables.dispose();
        if (this.extension) {
            inkdrop.store.dispatch(actions.mde.removeExtension(this.extension));
            this.extension = null;
        }
    }

    reload() {
        if (this.extension) {
            inkdrop.store.dispatch(actions.mde.removeExtension(this.extension));
        }
        this.extension = this.buildExtension();
        inkdrop.store.dispatch(actions.mde.addExtension(this.extension));
    }

    buildExtension() {
        const columns = this.parseCSVSetting(
            inkdrop.config.get('rulers.columns'),
        );
        const colors = this.parseCSVSetting(
            inkdrop.config.get('rulers.colors'),
        );
        const lineStyles = this.parseCSVSetting(
            inkdrop.config.get('rulers.lineStyles'),
        );

        const rulers = columns.map((col, i) => ({
            column: parseInt(col, 10),
            color: colors[i] || '',
            lineStyle: lineStyles[i] || 'solid',
        }));

        return [createRulersExtension(rulers)];
    }

    parseCSVSetting(setting) {
        if (!setting) return [];
        return setting
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
    }
}

const plugin = new RulersPlugin();

module.exports = {
    config: {
        columns: {
            title: 'Columns',
            description:
                'A comma separated list of columns where rulers should be displayed.',
            type: 'string',
            default: '80',
        },
        colors: {
            title: 'Colors',
            description:
                'A comma separated list of colors in hex format for rulers. If no color is specified, the color is based on the current theme.',
            type: 'string',
            default: '',
        },
        lineStyles: {
            title: 'Line Styles',
            description:
                "A comma separated list of styles for rulers. Options are 'solid', 'dashed' or 'dotted'",
            type: 'string',
            default: 'solid',
        },
    },
    activate() {
        plugin.activate();
    },
    deactivate() {
        plugin.deactivate();
    },
};
