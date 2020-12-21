require('dotenv').config()

const emojiReadTime = require("@11tyrocks/eleventy-plugin-emoji-readtime");

module.exports = (config) => {
  config.addLayoutAlias('base', 'layouts/base.njk')
  config.addLayoutAlias('post', 'layouts/post.njk')

  config.addPassthroughCopy("./src/img");

  // Add some utility filters
  config.addFilter("dateDisplay", require("./src/utils/filters/date.js"));
  config.addFilter("postBlurb", require("./src/utils/filters/post.js"));

  // Add read time utility filters
  config.addPlugin(emojiReadTime, { wpm: 100 });

  // minify the html output
  config.addTransform('htmlmin', require('./src/utils/minify-html.js'))

  // compress and combine css files
  const pluginTailwind = require('eleventy-plugin-tailwindcss')
  config.addPlugin(pluginTailwind, {
    src: "src/css/styles.css",
    dest: ".",
    keepFolderStructure: false,
    minify: true
  })

  // compress and combine js files
  config.addFilter('jsmin', function (code) {
    const UglifyJS = require('uglify-js')
    let minified = UglifyJS.minify(code)
    if (minified.error) {
      console.log('UglifyJS error: ', minified.error)
      return code
    }
    return minified.code
  })

  return {
    dir: {
      input: 'src',
      output: 'public',
    },
  }
}
