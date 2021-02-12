const execSync = require('child_process').execSync;

module.exports = () => {
  const configuration = {};
  const terraformFolder = process.env.SERVERLESS_ENVIRONMENT == 'production' ? 'production' : 'staging';
  const cwd = '../terraform/env/dev';

  const output = execSync('terraform output -json', {
    cwd,
    encoding: 'utf-8',
  });

  const parsedTerraform = JSON.parse(output);
  Object.keys(parsedTerraform).forEach(key => {
    configuration[key] = parsedTerraform[key].value;
  });

  return configuration;
};