const path = require('path')
const replace = require('rollup-plugin-replace')
const flow = require('rollup-plugin-flow-no-whitespace')
const rollupTypescript = require('rollup-plugin-typescript');
const version = process.env.VERSION || require('../package.json').version

const banner =
  '/*!\n' +
  ' * testjs v' + version + '\n' +
  ' * (c) 2018-' + new Date().getFullYear() + ' yangcheng\n' +
  ' * Released under the ISC License.\n' +
  ' */'

const resolve = p => {
    return path.resolve(__dirname, '../', p)
}

const builds = {
  // Runtime+compiler CommonJS build (CommonJS)
  'web-full-cjs': {
    entry: resolve('src/main.ts'),
    dest: resolve('dist/test.common.js'),
    format: 'cjs',
    alias: { he: './entity-decoder' },
    banner
  },
  // Runtime+compiler CommonJS build (ES Modules)
  'web-full-esm': {
    entry: resolve('src/main.ts'),
    dest: resolve('dist/test.esm.js'),
    format: 'es',
    alias: { he: './entity-decoder' },
    banner
  },
  // Runtime+compiler development build (Browser)
  'web-full-prod': {
    entry: resolve('src/main.ts'),
    dest: resolve('dist/test.js'),
    format: 'umd',
    env: 'production',
    alias: { he: './entity-decoder' },
    banner
  }
}

function genConfig (name) {
  const opts = builds[name]
  const config = {
    input: opts.entry,
    external: opts.external,
    plugins: [
      replace({
        __VERSION__: version
      }),
      flow(),
      rollupTypescript()
    //   buble(),
    //   alias(Object.assign({}, opts.alias))
    ].concat(opts.plugins || []),
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName || 'test'
    }
  }

  if (opts.env) {
    config.plugins.push(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }

  Object.defineProperty(config, '_name', {
    enumerable: false,
    value: name
  })

  return config
}

if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET)
} else {
  exports.getBuild = genConfig
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}