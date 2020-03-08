import * as shell from 'shelljs'

shell.cp('-R', 'public/js/', 'dist/public/')
shell.cp('-R', 'public/fonts', 'dist/public/')
shell.cp('-R', 'public/images', 'dist/public/')
