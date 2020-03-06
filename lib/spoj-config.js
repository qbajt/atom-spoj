'use babel';

export default class SpojConfig
{
  configs =
  [
    {
      ext:    'c',
      tool:   'C:\\MinGW\\bin\\',
      build:  '`gcc ${file_fullname} -o ${file_name}`',
      test:   '`${file_name} < ${file_test}`',
    },
    {
      ext:    'cpp',
      tool:   'C:\\MinGW\\bin\\',
      build:  '`g++ ${file_fullname} -o ${file_name}`',
      test:   '`${file_name} < ${file_test}`',
    },
    {
      ext:    'java',
      tool:   'C:\\Program Files\\Java\\jdk-13.0.1\\bin\\',
      build:  '`javac ${file_fullname}`',
      test:   '`java ${file_name} < ${file_test}`',
    },
    {
      ext:    'py',
      tool:   '',
      build:  '',
      test:   'py `${file_fullname} < ${file_test}`',
    },
  ];

  constructor()
  {
    console.log('spoj-config constructor: ', this);
    this.load();
    this.create();
    this.panel = atom.workspace.addModalPanel({item: this.div_config, visible: false});
  }

  destructor()
  {
    console.log('spoj-config destructor: ', this);
    this.panel.destroy();
  }

  create()
  {
    console.log('spoj-config create: ', this);
    var that = this;

    this.div_config = document.createElement('div');
    this.div_config.classList.add('config');

    this.div_items = document.createElement('div');
    this.div_items.classList.add('config_items');
    this.div_config.appendChild(this.div_items);

    this.configs.forEach(config => this.add_item(this.div_items, config));

    var div_add = document.createElement('span');
    div_add.classList.add('inline-block', 'status-added', 'icon', 'icon-diff-added');
    div_add.onclick = function() { that.button_add(); };
    this.div_config.appendChild(div_add);

    var div_save = document.createElement('span');
    div_save.classList.add('inline-block', 'status-renamed', 'icon', 'icon-checklist');
    div_save.onclick = function() { that.button_save(); };
    this.div_config.appendChild(div_save);
  }

  add_item(root, config)
  {
    console.log('spoj-config add_item: ', this);
    var that = this;

    var div_item = document.createElement('div');
    div_item.classList.add('config_item');

      var div_del = document.createElement('span');
      div_del.classList.add('inline-block', 'status-removed', 'icon', 'icon-diff-removed');
      div_del.onclick = function() { that.button_del(div_item); };
      div_item.appendChild(div_del);

      var div_item_ext_input = document.createElement('input');
      div_item_ext_input.classList.add('config_item_elem', 'input-text', 'native-key-bindings');
      div_item_ext_input.setAttribute('placeholder', 'file extension');
      div_item_ext_input.setAttribute('value', config.ext);
      div_item.appendChild(div_item_ext_input);

      var div_item_tool = document.createElement('input');
      div_item_tool.classList.add('config_item_elem', 'input-text', 'native-key-bindings');
      div_item_tool.setAttribute('placeholder', 'tool path');
      div_item_tool.setAttribute('value', config.tool);
      div_item.appendChild(div_item_tool);

      var div_item_build = document.createElement('input');
      div_item_build.classList.add('config_item_elem', 'input-text', 'native-key-bindings');
      div_item_build.setAttribute('placeholder', 'build command');
      div_item_build.setAttribute('value', config.build);
      div_item.appendChild(div_item_build);

      var div_item_test = document.createElement('input');
      div_item_test.classList.add('config_item_elem', 'input-text', 'native-key-bindings');
      div_item_test.setAttribute('placeholder', 'test command');
      div_item_test.setAttribute('value', config.test);
      div_item.appendChild(div_item_test);

    root.appendChild(div_item);
  }

  add_empty()
  {
    console.log('spoj-config add_empty: ', this);
    this.add_item(this.div_items, {ext: '', tool: '', build: '',test: ''});
  }

  toggle()
  {
    console.log('spoj-config toggle: ', this);
    if(this.panel.isVisible())
    {
      this.panel.hide();
    }
    else
    {
      this.panel.show();
    }
  }

  load()
  {
    var config = atom.config.get('atom-spoj.config');
    if(config)
    {
      this.configs = config;
    }
  }

  save()
  {
    console.log('spoj-config save: ', this);
    this.configs = [];
    this.div_items.childNodes.forEach(item =>
    {
      this.configs.push(
      {
        'ext':    item.childNodes[1].value,
        'tool':   item.childNodes[2].value,
        'build':  item.childNodes[3].value,
        'test':   item.childNodes[4].value,
      });
    });

    atom.config.set('atom-spoj.config', this.configs);
  }

  button_add()
  {
    console.log('spoj-config button_add: ', this);
    this.add_empty();
  }

  button_del(that)
  {
    console.log('spoj-config button_del: ', this, that);
    this.div_items.removeChild(that);
  }

  button_save()
  {
    console.log('spoj-config button_save: ', this);
    this.save();
    this.toggle();
  }

};
