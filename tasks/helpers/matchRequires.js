import re from 'requires-regex';

export default function matchRequires(str, options) {
  options = options || {};

  if (typeof options === 'boolean' || typeof options === 'function') {
    options = { stripComments: options };
  }

  // Note: strip-comments is an optional dependency that would need to be handled
  // For now, we'll skip the stripComments functionality or handle it differently
  if (options.stripComments === true) {
    // TODO: Handle strip-comments import if needed
    console.warn('stripComments option not yet supported in ESM version');
  }

  if (typeof options.stripComments === 'function') {
    str = options.stripComments(str);
  }

  var matches = [];
  var regex = re();
  let match;

  while ((match = regex.exec(str))) {
    var tok = { string: match[0].trim(), variable: match[2] || '', name: match[4] };

    Object.defineProperty(tok, 'match', {
      enumerable: false,
      value: match
    });

    matches.push(tok);
  }

  return matches;
}
