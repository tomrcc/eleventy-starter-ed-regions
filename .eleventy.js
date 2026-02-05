const pluginRss = require("@11ty/eleventy-plugin-rss");

/* 11ty config imports */
const image_shortcode = require("./_11ty_config/image_shortcode");

// biome-ignore lint/complexity/useArrowFunction: <explanation>
module.exports = async function (eleventyConfig) {
  const { RenderPlugin } = await import("@11ty/eleventy");
  const { default: editableRegions } = await import("@cloudcannon/editable-regions/eleventy");

  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/videos");
  eleventyConfig.addPassthroughCopy("src/assets/documents");
  eleventyConfig.addPassthroughCopy(
    "node_modules/@fortawesome/fontawesome-free/css/all.min.css"
  );
  eleventyConfig.addPassthroughCopy(
    "node_modules/@fortawesome/fontawesome-free/webfonts"
  );
  eleventyConfig.addPassthroughCopy(
    "node_modules/@11ty/eleventy"
  );

  eleventyConfig.addWatchTarget("tailwind.config.js");
  eleventyConfig.addWatchTarget("src/assets/styles/**/*.{css,scss}");
  eleventyConfig.addWatchTarget("component-library/");

  eleventyConfig.addPlugin(editableRegions, {
    output: "_site/live-editing.js",
    verbose: true,
    liquid: {
      component_dirs: ["src/_includes"],
      component_extensions: [".liquid", ".html"],
      components: [
        {
          name: 'snippets/video/video.liquid',
          file: 'src/_includes/components/snippets/video/video.liquid',
        },
        {
          name: 'snippets/tint/tint.liquid',
          file: 'src/_includes/components/snippets/tint/tint.liquid',
        },
        {
          name: 'snippets/file/file.liquid',
          file: 'src/_includes/components/snippets/file/file.liquid',
        },
        {
          name: 'snippets/alert/alert.liquid',
          file: 'src/_includes/components/snippets/alert/alert.liquid',
        },
        {
          name: 'left-right/left-right.liquid',
          file: 'src/_includes/components/left-right/left-right.liquid',
        },
        {
          name: 'image/image.liquid',
          file: 'src/_includes/components/image/image.liquid',
        },
        {
          name: 'icon/icon.liquid',
          file: 'src/_includes/components/icon/icon.liquid',
        },
        {
          name: 'hero/hero.liquid',
          file: 'src/_includes/components/hero/hero.liquid',
        },
        {
          name: 'buttons/secondary/secondary.liquid',
          file: 'src/_includes/components/buttons/secondary/secondary.liquid',
        },
        {
          name: 'buttons/primary/primary.liquid',
          file: 'src/_includes/components/buttons/primary/primary.liquid',
        }
      ]
    }
  });

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(RenderPlugin);

  // Custom Shortcodes
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  eleventyConfig.addShortcode("image", image_shortcode);
  eleventyConfig.addPairedLiquidShortcode(
    "tint",
    function (content, tint_color) {
      return `<span style="color: ${tint_color}">${content}</span>`;
    }
  );

  // Custom Collection
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/blog/**/*.md");
  });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
};
