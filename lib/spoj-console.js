'use babel';

export default class SpojConsole
{
  constructor()
  {
    console.log('spoj-console constructor: ', this);
    this.create();
    var visible = atom.config.get('atom-spoj.visible');
    this.visible = visible ? visible[0] : true;
    this.panel = atom.workspace.addBottomPanel({item: this.div_console, visible: this.visible});
  }

  destructor()
  {
    console.log('spoj-console destructor: ', this);
    this.panel.destroy();
  }

  create()
  {
    console.log('spoj-console create: ', this);
    var that = this;

    this.div_console = document.createElement('div');
    this.div_console.classList.add('console');

      var div_resizer = document.createElement('div');
      div_resizer.classList.add('console_resizer');
      div_resizer.onmousedown = function(e) { that.resize(e); };
      document.onmousemove = function(e) { that.resize(e); };
      document.onmouseup = function(e) { that.resize(e); };
      this.div_console.appendChild(div_resizer);

      var div_tool = document.createElement('div');
      div_tool.classList.add('console_tool');
      this.div_console.appendChild(div_tool);

        var div_button_build = document.createElement('div');
        div_button_build.classList.add('btn', 'btn-default', 'icon', 'icon-playback-play');
        div_button_build.onclick = function() { that.button_build(); };
        div_tool.appendChild(div_button_build);

        var div_button_config = document.createElement('div');
        div_button_config.classList.add('btn', 'btn-default', 'btn-default', 'icon', 'icon-tools');
        div_button_config.onclick = function() { that.button_config(); };
        div_tool.appendChild(div_button_config);

        var div_button_clear = document.createElement('div');
        div_button_clear.classList.add('btn', 'btn-default', 'icon', 'icon-trashcan');
        div_button_clear.onclick = function() { that.button_clear(); };
        div_tool.appendChild(div_button_clear);

        var div_button_exit = document.createElement('div');
        div_button_exit.classList.add('btn', 'btn-default', 'icon', 'icon-x');
        div_button_exit.onclick =  function() { that.button_exit(); };
        div_tool.appendChild(div_button_exit);

    this.message = document.createElement('div');
    this.message.textContent = '';
    this.message.classList.add('console_message');
    this.div_console.appendChild(this.message);
  }

  add(text)
  {
    console.log('spoj-console add: ', text);
    this.toggle(true);
    this.message.textContent += text;
    this.message.scrollTop = this.message.scrollHeight;
  }

  clear()
  {
    console.log('spoj-console clear:');
    this.message.textContent = '';
  }

  toggle(show)
  {
    console.log('spoj-console toggle: ', this);
    if(show)
    {
      this.panel.show();
      atom.config.set('atom-spoj.visible', [true]);
    }
    else if(this.panel.isVisible())
    {
      this.panel.hide();
      atom.config.set('atom-spoj.visible', [false]);
    }
    else
    {
      this.panel.show();
      atom.config.set('atom-spoj.visible', true);
    }
  }

  button_build()
  {
    console.log('spoj-console button_build:');
    this.SpojAnalytics.event('button', 'button_build');
    atom.commands.dispatch(atom.views.getView(atom.workspace.getActiveTextEditor()), 'spoj:run');
  }

  button_config()
  {
    console.log('spoj-console button_config:');
    this.SpojAnalytics.event('button', 'button_config');
    //atom.workspace.open(`atom://config/packages/atom-spoj`);
    if(this.SpojConfig != null)
    {
      this.SpojConfig.toggle();
    }
  }

  button_clear()
  {
    console.log('spoj-console button_clear:');
    this.SpojAnalytics.event('button', 'button_clear');
    this.clear();
  }

  button_exit()
  {
    console.log('spoj-console button_exit:');
    this.SpojAnalytics.event('button', 'button_exit');
    this.toggle(false);
  }

  resize(e)
  {
    switch(e.type)
    {
      case 'mousedown':
      {
        this.resized = true;
        this.height = this.message.offsetHeight;
        this.y = e.y;
        break;
      }
      case 'mousemove':
      {
          if(this.resized)
          {
            this.message.style.height = this.height - e.y + this.y + 'px';
          }
          break;
      }
      case 'mouseup':
      {
        this.resized = false;
        break;
      }
    }
  }

}
