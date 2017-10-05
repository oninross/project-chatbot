'use strict';

import path from 'path';

export default function(gulp, plugins, args, config, taskTarget, browserSync) {
  let dirs = config.directories;
  let dest = path.join(taskTarget, dirs.media.replace(/^_/, ''));

  // Copy Media
  gulp.task('copyMedia', function() {
    gulp.src(path.join(dirs.source, '_assets/chatbot/media/**/*.*'))
      .pipe(gulp.dest(dest))
});
}
