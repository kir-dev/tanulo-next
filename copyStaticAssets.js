import * as shell from 'shelljs'

shell.cp('-R', 'public/js/', 'dist/public/')
shell.cp('-R', 'public/images', 'dist/public/')
shell.cp('knexfile.js', 'dist/')
shell.cp('-R', 'views', 'dist/')
