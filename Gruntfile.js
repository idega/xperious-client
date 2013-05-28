module.exports = function(grunt) { 

    grunt.initConfig({

    	/* Validate javascript files syntax */
    	jsvalidate: {
    	    files: ['app/**/*.js', 'test/**/*.js', 'lib/**/*.js']
    	},
	  

    	/* Precompile HTML templates.*/
        jst: {
            "dist/temp/templates.js": [
                "app/templates/**/*.html"
            ]
        },
    

        /* Server configurations */
        connect: {
        	dev: {
        		options: {
        			port: 8000,
        			base: '.',
    	    		middleware: _middleware
        		},
        	},
        	dist: {
        		options: {
        			port: 8000,
        			base: 'dist/release',
    	    		middleware: _middleware
        		},
        	}
        },


        /* Run jasmine unit tests */
        jasmine: {
        	src: ['app/config.js'],
    	    options: {
    	        specs: 'test/spec/**/*.spec.js',
    	        helpers: ['test/helper/responses.helper.js', 'test/lib/sinon/sinon.js'],
    	        host: 'http://localhost:8000',
    	        template: require('grunt-template-jasmine-requirejs')
    	    }
        },


        /**
         * Use requirejs optimization tool to merge all 
         * javascript files and CSS into one minified file.
         */
        requirejs: {
        	compile: {
    	    	options: {
    		    	mainConfigFile: 'app/config.js',
    		    	name: 'config',
    		    	baseUrl: 'app/',
    		    	out: "dist/temp/out.js",
    		    	include: ['requireLib'],
    		    	paths: {
    		    		requireLib: '../lib/require/require',
    		    		google: 'empty:'
    		    	}
    	    	}
        	},
        	css: {
        		options: {
        			cssIn: 'styles/main.css',
        			out: 'dist/temp/out.css',
        			cssPrefix: '/styles/'
        		}
        	}
        },


        /* Join precompiled templates and minified scripts. */
        concat: {
          dist: {
            src: [
              "dist/temp/templates.js",
              "dist/temp/out.js"
            ],
            dest: "dist/temp/out.js",
            separator: ";"
          }
        },

    
        /* Minify joint javascript file. */
        uglify: {
            dist: {
            	options: {
            		report: 'min',
            		// Turn off code optimizations because somehow it removes Backbone parse() method 
            		// and this results in unusable application.
            		compress: {
            			sequences     : false,  // join consecutive statemets with the “comma operator”
            			properties    : false,  // optimize property access: a["foo"] → a.foo
            			dead_code     : false,  // discard unreachable code
            			drop_debugger : false,  // discard “debugger” statements
            			unsafe        : false, // some unsafe optimizations (see below)
            			conditionals  : false,  // optimize if-s and conditional expressions
            			comparisons   : false,  // optimize comparisons
            			evaluate      : false,  // evaluate constant expressions
            			booleans      : false,  // optimize boolean expressions
            			loops         : false,  // optimize loops
            			unused        : false,  // drop unused variables/functions
            			hoist_funs    : false,  // hoist function declarations
            			hoist_vars    : false, // hoist variable declarations
            			if_return     : false,  // optimize if-s followed by return/continue
            			join_vars     : false,  // join var declarations
            			cascade       : false,  // try to cascade `right` into `left` in sequences
            			side_effects  : false,  // drop side-effect-free statements
            			warnings      : true,  // warn about potentially dangerous optimizations/code
            			global_defs   : {}     // global definitions
            		}
            	},
            	files: {
            		'dist/release/out.js' : ['dist/temp/out.js']
            	}
            }
        },

    
        /* Minify joint css file */
    	cssmin: {
            "dist/release/out.css": ["dist/temp/out.css"]
    	},

	
        /* Copy required files for the deployment artifact */
    	copy: {
            dist: {
    		    files: [
    		      {
    		    	  src: ['index.html'], 
    		    	  dest: 'dist/release/'
    		      },
    		      {
    		    	  src: ['styles/import/images/*'], 
    		    	  dest: 'dist/release/'
    		      },
    		      {
    		    	  src: [
                            'lib/google/maps.js',
                            'lib/require/async.js',
                            'lib/selectivizr/selectivizr.js',
                            'lib/pie/PIE.js'
                      ], 
    		    	  dest: 'dist/release/'
    		      }
    		    ]
            }
    	},
	

        /* Replace js and css files to optimized */
    	usemin: {
            html: ['dist/release/index.html']
    	},

	
        /* Use rsync over ssh for deployment */
    	rsync: {
            "test.xperious.com": {
    	        src: "dist/release/",
    	        dest: "/var/www/html/xperious",
    	        host: "idegaweb@test.xperious.com",
    	        recursive: true,
    	        syncDest: true
            }
    	},
	
	
    	/* Clean dist folder */
        clean: ["dist/"]
      });


    grunt.loadNpmTasks('grunt-contrib');
    grunt.loadNpmTasks('grunt-jsvalidate');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-rsync');


    grunt.registerTask("init", "Initialize environment", function(apihost) {
        var properties = {
            apihost: grunt.option('apihost') || 'http://core.test.xperious.com'
        };

        var file = "properties.json";
        var json = JSON.stringify(properties, undefined, 4);

        grunt.file.write(file, json);
        grunt.log.writeln("Initializing '" + file + "': ");
        grunt.log.writeln(json);
    });


    grunt.registerTask("run", "Run local server", [
        "connect:dev:keepalive"
    ]);

    
    grunt.registerTask("default", "Run local server", [
        "run"
    ]);


    grunt.registerTask("test", "Run Jasmine tests" [
        "connect:dev",
        "jasmine"
    ]);


    grunt.registerTask("dist", "Build dist artifacts", [
        "clean",
        "init",
        "jsvalidate",
        "connect:dev",
        "jasmine",
        "jst", 
        "requirejs",
        "concat", 
        "uglify",
        "cssmin",
        "copy",
        "usemin"
    ]);


    grunt.registerTask("dist:run", "Run dist build", [
        "connect:dist:keepalive"
    ]);

    
    grunt.registerTask("dist:rsync", "Deploy (rsync) dist build", [
        "rsync:test.xperious.com"
    ]);
};


/**
 * Custom middleware configuration for connect server
 * to enable mod_rewrite for images and urls.
 */
function _middleware(connect, options) {

	var connect = require('connect');
	var modRewrite = require('connect-modrewrite');

	return [
        // 1. Handle images from any folder
        // 2. Do not rewrite URL for html, js and css
        // 3. Everything else should map to index.html (backbone router)
	    modRewrite([
            '^.*images/(.+)$ /styles/import/images/$1 [L]',
            '(.*\\.html|\\.js|\\.css|\\.json|\\.gif|\\.jpg|\\.jpeg|\\.png)$ $1 [L]',
            '^/(.*)$ /index.html [L]'
	     ]),
     	connect.static(options.base),
        connect.directory(options.base)
     ];
}
