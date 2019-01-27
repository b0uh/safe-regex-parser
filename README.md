[![npm version](https://badge.fury.io/js/safe-regex-parser.svg)](https://badge.fury.io/js/safe-regex-parser) [![CircleCI](https://circleci.com/gh/b0uh/safe-regex-parser.svg?style=svg)](https://circleci.com/gh/b0uh/safe-regex-parser)

> :warning: Warning: This module is still experimental. It should not be used in production.


# safe-regex-parser

Parse javascript files to find unsafe regex (a.k.a. potentially catastrophic exponential-time regular expressions)

## Getting Started

```
srp path/to/my/awsome/project/*.js
```

### Prerequisites

- `nodejs`
- `npm`

### Installing

```
npm i
```

### Options

```
-n, --include-node-modules    include `node_modules` directory (default: false)
-o, --output-format <format>  output format (text|json) (default: text)
-a, --all                     include safe and unsafe regex in the output, by default only the unsafe regex are included
-v, --version                 output version information
-h, --help                    output usage information
```

### API
```
const { srp } = require('safe-regex-parser');

const config = {
    pathes: ['./path/to/my/awsome/project/*.js'],
};

const result = srp(config);
```


## TODO

- Tests
- Handle multiple regex analyzer
- Support multiple parser
- Declare options in a file (including for acorn options)

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
