const transformDataTypes = require('./dataTypes');
const Schema = require('../models/schema');

module.exports = (parameters, pathParameters, requestBody) => {
  const res = [];
  res.push('##### Parameters\n');
  res.push('| Name | Located in | Description | Required | Schema |');
  res.push('| ---- | ---------- | ----------- | -------- | ---- |');
  const allParameters = [].concat(pathParameters, parameters);
  if (requestBody) {
    allParameters.push({
      name: 'Request body',
      in: 'body',
      description: requestBody.description,
      required: requestBody.required,
      schema: Object.entries(requestBody.content)[0].schema
    });
  }
  allParameters.forEach(param => {
    if (param) {
      const line = [];
      // Name first
      line.push(param.name || '');
      // Scope (in)
      line.push(param.in || '');
      // description
      if ('description' in param) {
        line.push(param.description.replace(/[\r\n]/g, ' '));
      } else {
        line.push('');
      }
      line.push(param.required ? 'Yes' : 'No');

      // Prepare schema to be transformed
      let schema = null;
      if ('schema' in param) {
        schema = new Schema(param.schema);
      } else {
        schema = new Schema();
        schema.setType('type' in param ? param.type : null);
        schema.setFormat('format' in param ? param.format : null);
        schema.setReference('$ref' in param ? param.$ref : null);
        schema.setItems('items' in param ? param.items : null);
      }

      line.push(transformDataTypes(schema));
      // Add spaces and glue with pipeline
      res.push(`|${line.map(el => ` ${el} `).join('|')}|`);
    }
  });
  return res.join('\n');
};
