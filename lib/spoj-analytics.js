'use babel';

export default class SpojAnalytics
{
  url = 'https://www.google-analytics.com/collect';
  //url = 'https://www.google-analytics.com/debug/collect';

  parameters =
  {
    v:    '1',
    tid:  'UA-156983547-1',
    cid:  '',
  }

  constructor()
  {
    console.log('spoj-analytics constructor: ', this);
    this.parameters.cid = this.uuidv4();
  }

  destructor()
  {
    console.log('spoj-analytics destructor: ', this);
  }

  uuidv4()
  {
    var A = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0');
    var B = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0');
    var C = Math.floor(Math.random() * 0x0fff).toString(16).padStart(4, '4000');
    var D = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0');
    var E = Math.floor(Math.random() * 0xffffffffffff).toString(16).padStart(12, '0');

    return A + '-' + B + '-' + C + '-' + D + '-' + E;
  }

  send(url, data)
  {
    if(atom.config.get('atom-spoj.analytics') == false)
    {
      return;
    }

    console.log('spoj-analytics send: ', url, data);
    xhtml = new XMLHttpRequest();
    xhtml.open('POST', url, true);
    xhtml.onreadystatechange = function(e)
    {
      if (xhtml.readyState == 4)
      {
         if(xhtml.status == 200)
         {
           console.log('spoj-analytics resp: ', xhtml);
         }
      }
    };
    xhtml.send(data);
  }

  payload(data)
  {
    var temp = [];
    for(key in data)
    {
    	temp.push(key + '=' + data[key]);
    }
    return temp.join('&');
  }

  //  Hit type https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#t
  //  'pageview', 'screenview', 'event', 'transaction', 'item', 'social', 'exception', 'timing'.
  pageview(path, title)
  {
    console.log('spoj-analytics pageview: ', this);
    this.parameters.t = 'pageview';
    var param =
    {
      dp: path,
      dt: title,
    }
    this.send(this.url, this.payload({...this.parameters, ...param}));
  }

  event(category, action, label, value)
  {
    console.log('spoj-analytics event: ', this);
    this.parameters.t = 'event';

    var param =
    {
      ec: category,
      ea: action,
    }
    this.send(this.url, this.payload({...this.parameters, ...param}));
  }

}
