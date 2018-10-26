const npsUtils = require('nps-utils');

const {
 series, concurrent, rimraf, crossEnv,
} = npsUtils;

module.exports = {
  scripts: {
    test: {
      default: crossEnv('NODE_ENV=test jest --coverage'),
      update: crossEnv('NODE_ENV=test jest --coverage'),
      watch: crossEnv('NODE_ENV=test jest --watch'),
      codeCov: crossEnv('cat ./coverage/lcov.info | ./node_modules/codecov.io/bin/codecov.io.js'),
    },
    watch: {
      description: 'delete the dist directory and run all builds in watch mode',
      default: series(
        rimraf('dist'),
        concurrent.nps(
          'build.esWatch',
          'build.cjsWatch',
          // 'build.umdWatch.main',
          // 'build.umdWatch.min',
        ),
      ),
    },
    build: {
      description: 'delete the dist directory and run all builds',
      default: series(rimraf('dist'), concurrent.nps('build.es', 'build.cjs')),
      es: {
        description: 'run the build with rollup (uses rollup.config.js)',
        script: 'rollup --config --environment FORMAT:es',
      },
      cjs: {
        description: 'run rollup build with CommonJS format',
        script: 'rollup --config --environment FORMAT:cjs',
      },
      esWatch: {
        description: 'run the build with rollup (uses rollup.config.js)',
        script: 'rollup --config --environment FORMAT:es --watch',
      },
      cjsWatch: {
        description: 'run rollup build with CommonJS format',
        script: 'rollup --config --environment FORMAT:cjs --watch',
      },
      umdWatch: {
        min: {
          description: 'run the rollup build with sourcemaps',
          script: 'rollup --config --sourcemap --environment MINIFY,FORMAT:umd --watch',
        },
        main: {
          description: 'builds the cjs and umd files',
          script: 'rollup --config --sourcemap --environment FORMAT:umd --watch',
        },
      },
      umd: {
        min: {
          description: 'run the rollup build with sourcemaps',
          script: 'rollup --config --sourcemap --environment MINIFY,FORMAT:umd',
        },
        main: {
          description: 'builds the cjs and umd files',
          script: 'rollup --config --sourcemap --environment FORMAT:umd',
        },
      },
      andTest: series.nps('build'),
    },
    copyTypes: series(npsUtils.copy('dist')),
    lint: {
      description: 'lint the entire project',
      script: 'eslint .',
    },
    validate: {
      description:
        'This runs several scripts to make sure things look good before committing or on clean install',
      default: concurrent.nps('build.andTest'),
    },
  },
  options: {
    silent: false,
  },
};
