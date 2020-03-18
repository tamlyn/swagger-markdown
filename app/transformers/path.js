const transformResponses = require('./pathResponses');
const transformParameters = require('./pathParameters');
const security = require('./security');

/**
 * Allowed methods
 * @type {string[]}
 */
const ALLOWED_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'options'];

module.exports = (path, pathSpec) => {
  const res = [];
  let pathParameters = null;

  if (path && pathSpec) {
    // Make path as a header
    res.push(`### ${path}\n`);

    // Check if parameter for path are in the place
    if ('parameters' in pathSpec) {
      pathParameters = pathSpec.parameters;
    }

    // Go further method by methods
    Object.keys(pathSpec).map(method => {
      if (ALLOWED_METHODS.includes(method)) {
        // Set method as a subheader
        res.push(`#### ${method.toUpperCase()}`);
        const methodSpec = pathSpec[method];

        // Set summary
        if ('summary' in methodSpec) {
          res.push(`##### Summary:\n\n${methodSpec.summary}\n`);
        }

        // Set description
        if ('description' in methodSpec) {
          res.push(`##### Description:\n\n${methodSpec.description}\n`);
        }

        // Build parameters
        if ('parameters' in methodSpec || pathParameters) {
          res.push(`${transformParameters(methodSpec.parameters, pathParameters, methodSpec.requestBody)}\n`);
        }

        // Build responses
        if ('responses' in methodSpec) {
          res.push(`${transformResponses(methodSpec.responses)}\n`);
        }

        // Build security
        if ('security' in methodSpec) {
          res.push(`${security(methodSpec.security)}\n`);
        }
      }
    });
  }
  return res.length ? res.join('\n') : null;
};
