'use babel';

export default class SpojRunner
{
  test_run = false;
  test_OK = 0;
  test_NOK = 0;
  test_UNKNOWN= 0;

  constructor()
  {
    console.log('spoj-runner constructor: ', this);
  }

  destructor()
  {
    console.log('spoj-runner destructor: ', this);
  }

  run(config, file_paths)
  {
    console.log('spoj-runner run: ', config, file_paths);

    if(this.test_run == true)
    {
      // TODO: test_run is running
      return;
    }
    this.test_run = true;

    this.test_OK = 0;
    this.test_NOK = 0;
    this.test_UNKNOWN= 0;
    this.SpojConsole.clear();

    if(config.build)
    {
      this.build(config, file_paths);
    }
    else if(config.test)
    {
      this.test(config, file_paths);
    }
    else
    {
      //TODO: no cofig
      this.test_run = false;
    }
  }

  build(config, file_paths)
  {
    console.log('spoj-runner build: ', file_paths);
    this.SpojAnalytics.pageview(config.ext, 'build');

    const { exec } = require('child_process');

    var file_dir = file_paths[1];
    var file_fullname = file_paths[2];
    var file_name = file_paths[3];
    var cmd = eval(config.build);

    this.SpojConsole.add(cmd);
    this.SpojConsole.add('\n');

    exec(cmd, {cwd: file_dir, env:{PATH: config.tool}}, (error, stdout, stderr) =>
    {
      console.log("spoj-runner exec_build: ", cmd, error, stdout, stderr);
      if(error)
      {
        this.SpojConsole.add(error);
        this.test_run = false;
      }
      else
      {
        this.test(config, file_paths);
      }
    });
  }


  test(config, file_paths)
  {
    console.log('spoj-runner test: ', file_paths);
    this.SpojAnalytics.pageview(config.ext, 'test');

    const { readdirSync } = require('fs');

    var test_cmd =
    {
      file_paths: file_paths,
      file_test: [],
    }

    var file_dir = file_paths[1];
    var test_files = readdirSync(file_dir);
    test_files.forEach(test_file =>
    {
      var test_input_ext = "in";
      var test_input_regex = new RegExp("(.+\\\\)*((.+)\\.(" + test_input_ext + "))$");
      var test_input = test_file.match(test_input_regex);
      var test_output_ext = "out";
      if(test_input != null)
      {
        console.log("spoj-runner test_path.match: ", test_input_regex, test_input);
        var test_output = test_input[3] + '.' + test_output_ext;
        test_cmd.file_test.push({test_input: test_input[2], test_output: test_output});
      }
    });

    this.run_test(config, test_cmd);
  };


  run_test(config, test_cmd)
  {
    console.log('spoj-runner run_test: ', test_cmd);
    const { readFileSync } = require('fs');
    const { exec } = require('child_process');

    var test = test_cmd.file_test.shift();
    if(test != undefined)
    {
      var file_dir = test_cmd.file_paths[1];
      var file_fullname = test_cmd.file_paths[2];
      var file_name = test_cmd.file_paths[3];
      var file_test = test.test_input;
      var cmd = eval(config.test);

      this.SpojConsole.add(cmd);

      exec(cmd, {cwd: file_dir, env:{PATH: config.tool}}, (error, stdout, stderr) =>
      {
        console.log("spoj-runner exec_test: ", cmd, error, stderr);
        try
        {
          var test_output = readFileSync(file_dir + test.test_output);
          if(this.compare(test_output.toString(), stdout))
          {
            console.log("spoj-runner run_test OK");
            this.SpojConsole.add(' OK');
            this.test_OK++;
          }
          else
          {
            console.log("spoj-runner run_test NOK");
            this.SpojConsole.add(' NOK');
            this.test_NOK++;
          }

        }
        catch (e)
        {
            console.log("spoj-runner run_test UNKNOWN", e);
            this.test_UNKNOWN++;
        }
        this.SpojConsole.add('\n');

        this.run_test(config, test_cmd);
      });
    }
    else
    {
      console.log("spoj-runner run_test end");
      this.SpojConsole.add('OK: ' + this.test_OK + ' ');
      this.SpojConsole.add('NOK: ' + this.test_NOK + ' ');
      this.SpojConsole.add('UNKNOWN: ' + this.test_UNKNOWN + ' ');
      this.SpojConsole.add('\n');
      this.test_run = false;
    }
  };


  compare(test_output, file_output)
  {
    console.log("spoj-runner compare: ", test_output.length, file_output.length);
    console.log("spoj-runner compare: ", test_output, file_output);

    if((test_output.length === file_output.length) && (test_output == file_output))
    {
        return true;
    }
    return false;
  };
}
