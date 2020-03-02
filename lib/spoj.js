'use babel';

import SpojConfig from './spoj-config';
import SpojRunner from './spoj-runner';
import SpojConsole from './spoj-console';
import SpojAnalytics from  './spoj-analytics'

export default
{
  config: require('./config'),

  activate(state)
  {
    console.log('spoj activate: ', this);
    const {CompositeDisposable} = require('atom');
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-text-editor', {'spoj:run': () => this.spoj()}));

    this.SpojConfig = new SpojConfig();
    this.SpojRunner = new SpojRunner();
    this.SpojConsole = new SpojConsole();
    this.SpojAnalytics = new SpojAnalytics();

    this.SpojRunner.SpojConsole = this.SpojConsole;
    this.SpojRunner.SpojAnalytics = this.SpojAnalytics;

    this.SpojConsole.SpojConfig = this.SpojConfig;
    this.SpojConsole.SpojAnalytics = this.SpojAnalytics;

    const version = atom.packages.getLoadedPackage('atom-spoj').metadata.version;
    this.SpojAnalytics.event('core', 'activate');
    this.SpojAnalytics.event('version', version);
  },

  deactivate()
  {
    console.log('spoj deactivate: ', this);
    this.SpojAnalytics.event('core', 'deactivate');
    this.subscriptions.dispose();
    this.destructor();
  },

  constructor()
  {
    console.log('spoj constructor: ', this);
  },

  destructor()
  {
    console.log('spoj destructor: ', this);
    this.SpojConfig.destructor();
    this.SpojRunner.destructor();
    this.SpojConsole.destructor();
    this.SpojAnalytics.destructor();
    delete(this.SpojConfig);
    delete(this.SpojRunner);
    delete(this.SpojConsole);
    delete(this.SpojAnalytics);
  },

  keyf5()
  {
    this.SpojAnalytics.event('core', 'keyf5');
    this.spoj();
  },

  spoj()
  {
    var file_path = atom.workspace.getActiveTextEditor().getPath();
    console.log('spoj file_path', file_path);
    this.SpojAnalytics.event('core', 'spoj');

    this.SpojConfig.configs.forEach(configs =>
    {
      var file_ext = configs.ext;
      var file_regex = new RegExp("(.+\\\\)*((.+)\\.(" + file_ext + "))$");
      var file_paths = file_path.match(file_regex);

      if(file_paths != null)
      {
        console.log("spoj file_path.match: ", file_regex, file_paths);
        this.SpojRunner.run(configs, file_paths);
      }
      else
      {
        // TODO: no config for this file
      }
    });
  },

}
