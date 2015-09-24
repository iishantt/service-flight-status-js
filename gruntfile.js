module.exports = function(grunt) {
	grunt.initConfig({
		appConfig: grunt.file.readJSON('bower.json') || {},
		sass: {
			dist: {
				options: {
					style: 'expanded',
					noCache: true
				},
				files: [
					{'./dist/flight-status.css': './src/flight-status.sass'}
				]
			}
		},
		uglify: {
			dist: {
				options: {
					sourceMap: true
				},
				files: {
					'./dist/flight-status.min.js': './src/flight-status.js'
				}
			}
		},
		usebanner: {
			dist: {
				options: {
					position: 'top',
					banner: '/*\n * jQuery Flight Status Widget\n' +
					' * <%= grunt.template.today("yyyy") %> <%= appConfig.authors[0] %> \n' +
					' * License: <%= appConfig.license %>\n */\n '
				},
				files: {
					src: ['dist/flight-status.min.js', 'dist/flight-status.js']
				}
			}
		},
		copy: {
			main: {
				src: 'src/flight-status.js',
				dest: 'dist/flight-status.js'
			}
		},
		watch: {
			scripts: {
				files: ['./src/**/*.js', './src/**/*.sass'],
				tasks: ['sass', 'copy', 'uglify', 'usebanner']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-banner');

	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['sass', 'copy', 'uglify', 'usebanner']);

};