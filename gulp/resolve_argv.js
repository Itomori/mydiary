/* yargs has a wonderful README. */

module.exports = 
	require('yargs')
	.usage('Usage: gulp <task> <command> [options]\r\nFor gulp tasks: \n\rserve, clean, <default>, release(not yet ready)')
	.command('serve', 'Build and serve it through browsersync')
	.command('default', 'Default task, build only')
	.command('clean', 'Clean dist directory')
	.alias('m', 'preset-misc')
	.describe('preset-misc', 'Preset JSON string for window.diaryPresetOpts.misc')
	.help('h')
	.alias('h', 'help')
	.epilog(`MyDiary  Copyright (C) 2017-  AkimotoAkari
This program comes with ABSOLUTELY NO WARRANTY.
This is free software, and you are welcome to redistribute it
 under certain conditions.`)
	.argv;