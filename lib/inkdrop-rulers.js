'use babel';
const app = require('@electron/remote').app;
const modulePath = app.getAppPath() + '/node_modules/'
require(modulePath + 'codemirror/addon/display/rulers.js')

module.exports = {

  config: {
    columns: {
      title: 'Columns',
      description: 'The columns to display rulers.',
      type: 'string',
      default: '80',
    },
    colors: {
      title: 'Colors',
      description: 'The colors for rulers',
      type: 'string',
    },
    lineStyles: {
      title: 'Line Styles',
      description: 'Line styles for rulers',
      type: 'string',
    }
  },

  editor: undefined,

  activate() {
    var e = global.inkdrop.getActiveEditor();
    if (e === undefined) {
      global.inkdrop.onEditorLoad(this.activateEditor.bind(this));
    } else {
      this.activateEditor(e)
    }
  },

  deactivate() {
    var e = global.inkdrop.getActiveEditor();
    if(e && e.cm) {
      e.cm.setOption('rulers', {})
    }
  },

  activateEditor(editor) {
    this.editor = editor;
    this.observeConfiguration();
    this.drawRulers()
  },

  drawRulers() {
    var cm = this.editor.cm;
    var columns = inkdrop.config.get('rulers.columns');
    var colors = inkdrop.config.get('rulers.colors');
    var lineStyles = inkdrop.config.get('rulers.lineStyles')

    columns = this.parseCSVSetting(columns);
    colors = this.parseCSVSetting(colors);
    lineStyles = this.parseCSVSetting(lineStyles);

    var rulers = [];

    for(var i = 0; i < columns.length; i++) {
      rulers.push({color: colors[i], column: parseInt(columns[i]), lineStyle: lineStyles[i], width: 1 })
    }
    cm.setOption('rulers', rulers);
  },

  parseCSVSetting(setting) {
    var settingArray = []
    if (setting !== undefined) {
      settingArray = setting.replaceAll(' ', '').split(',');
    }
    return settingArray;
  },

  observeConfiguration() {
    inkdrop.config.observe('rulers.columns', this.drawRulers.bind(this));
    inkdrop.config.observe('rulers.colors', this.drawRulers.bind(this));
    inkdrop.config.observe('rulers.lineStyles', this.drawRulers.bind(this));
  }
};
