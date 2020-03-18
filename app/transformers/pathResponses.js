const Schema = require('../models/schema');
const transformDataTypes = require('./dataTypes');

function formatExample(value, contentType, name) {
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value, null, '  ');
  const formattedValue = stringValue.replace(/\r?\n/g, '<br>');
  const label = contentType ? `(*${contentType}*)` : '';
  return `<br><br>**Example${name ? ` ${name}` : ''}** ${label}:<br><pre>${formattedValue}</pre>`;
}

/**
 * Build responses table
 * @param {object} responses
 * @returns {null|string}
 */
module.exports = responses => {
  const res = [];
  // Check if schema somewhere
  const hasSchemas =
    Object.values(responses).some(response => 'schema' in response) ||
    Object.values(responses).some(
      response =>
        'content' in response && Object.values(response.content).some(content => content.schema)
    );
  Object.entries(responses).forEach(([responseCode, response]) => {
    // Description
    let description = '';
    if ('description' in response) {
      description += response.description.replace(/[\r\n]/g, ' ');
    }
    if ('example' in response) {
      description += formatExample(response.example);
    }
    if ('content' in response) {
      Object.entries(response.content).forEach(([contentType, responseContent]) => {
        if (responseContent.example) {
          description += formatExample(responseContent.example, contentType);
        }
        if (responseContent.examples) {
          Object.entries(responseContent.examples).forEach(([name, example]) => {
            description += formatExample(example.value, contentType, name);
          });
        }
      });
    }
    // Schema
    let schema = '';
    if ('schema' in response) {
      schema = transformDataTypes(new Schema(response.schema));
    } else if ('content' in response) {
      // this takes only the last schema
      Object.values(response.content).forEach(content => {
        if (content.schema) {
          schema = transformDataTypes(new Schema(content.schema));
        }
      });
    }
    // Combine all together
    res.push(`| ${responseCode} | ${description} |${hasSchemas ? ` ${schema} |` : ''}`);
  });
  res.unshift(`| ---- | ----------- |${hasSchemas ? ' ------ |' : ''}`);
  res.unshift(`| Code | Description |${hasSchemas ? ' Schema |' : ''}`);
  res.unshift('##### Responses\n');

  return res.join('\n');
};
