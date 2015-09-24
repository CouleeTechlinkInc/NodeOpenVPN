module.exports = function (grunt) {
  'use strict';
  grunt.initConfig({
    // Get package JSON
    pkg: grunt.file.readJSON('package.json'),
    jsdoc2md : {
         mainLibrarys : {
	    files : [
	        { src : "js/*.js" , dest : "docs/javascript.md" }
            ]
	 }
    },

    less: {
        development : {
            options : {
                paths : ["www/css/less"]
            },
            files : {
                "www/css/main.css" : "www/css/less/main.less"
            }
        },
    },
    jsdoc : {
        dist : {
            src : ["js/slimcrm.order.js"],
            dest : "doc/js"
        }
    },
    watch: {
      scripts: {
        files: ['css/theme/less/*.less', "css/theme/bootstrap/less/*.less"],
        tasks: ['less'],
        options: {
          spawn: false,
        },
      },
}
});
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', [ 'less' , 'watch' ]);

};
