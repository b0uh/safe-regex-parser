
> :warning: Warning: This module is still experimental. It should not be used in production.


# safe-regex-parser

Detects potential catastrophic backtracking regular expressions. It aims to be simple to use with sane defaults.

## Getting Started

```
node src/index.js path/to/my/awsome/project/*.js
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

## TODO

- Tests
- Handle multiple regex analyzer
- Support multiple parser
- Declare options in a file (including for acorn options)

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
