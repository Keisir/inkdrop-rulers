'use babel';
import 'codemirror/addon/display/rulers.js';

class RulersPlugin {
    editor = undefined;

    activate = () => {
        const e = global.inkdrop.getActiveEditor();
        if (e === undefined) {
            global.inkdrop.onEditorLoad(this.activateEditor.bind(this));
        } else {
            this.activateEditor(e);
        }
    }

    deactivate = () => {
        const e = global.inkdrop.getActiveEditor();
        if (e && e.cm) {
            e.cm.setOption('rulers', {});
        }
    }

    activateEditor = (editor) => {
        this.editor = editor;
        this.observeConfiguration();
        this.drawRulers();
    }

    drawRulers = () => {
        const columns = this.parseCSVSetting(inkdrop.config.get('rulers.columns'));
        const colors = this.parseCSVSetting(inkdrop.config.get('rulers.colors'));
        const lineStyles = this.parseCSVSetting(inkdrop.config.get('rulers.lineStyles'));

        let rulers = [];
        for (var i = 0; i < columns.length; i++) {
            rulers.push({ color: colors[i], column: parseInt(columns[i]), lineStyle: lineStyles[i], width: 1 });
        }
        this.editor.cm.setOption('rulers', rulers);
    }

    parseCSVSetting = (setting) => {
        let settingArray = [];
        if (setting !== undefined) {
            settingArray = setting.split(',').map(s => s.trim());
        }
        return settingArray;
    }

    observeConfiguration = () => {
        inkdrop.config.observe('rulers.columns', this.drawRulers.bind(this));
        inkdrop.config.observe('rulers.colors', this.drawRulers.bind(this));
        inkdrop.config.observe('rulers.lineStyles', this.drawRulers.bind(this));
    }
}

const plugin = new RulersPlugin();

module.exports = {
    config: {
        columns: {
            title: 'Columns',
            description: 'A comma separated list of columns where rulers should be displayed.',
            type: 'string',
            default: '80',
        },
        colors: {
            title: 'Colors',
            description: 'A comma separated list of colors in hex format for rulers. If no color is specified, the color is based on the current theme.',
            type: 'string',
            default: '',
        },
        lineStyles: {
            title: 'Line Styles',
            description: "A comma separated list of styles for rulers. Options are 'solid', 'dashed' or 'dotted'",
            type: 'string',
            default: 'solid',
        }
    },
    activate() {
        plugin.activate();
    },
    deactivate() {
        plugin.deactivate();
    }
};
