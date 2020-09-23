import { relative } from 'path';

export default {
  '*.{json,md,ts,yml,yaml}': ['prettier --write'],
  '*.ts': ["eslint --cache --cache-location './.cache/eslint' --fix'"],
  '*': (filenames) =>
    `cspell ${filenames
      .map((filename) => `'${relative(__dirname, filename)}'`)
      .join(' ')}`,
};
