const pluginRss = require("@11ty/eleventy-plugin-rss");
const renderContent = require("./bookshop/renderContent.js")

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
          name: 'components/snippets/video/video',
          file: 'src/_includes/components/snippets/video/video.liquid',
        },
        {
          name: 'components/snippets/tint/tint',
          file: 'src/_includes/components/snippets/tint/tint.liquid',
        },
        {
          name: 'components/snippets/file/file',
          file: 'src/_includes/components/snippets/file/file.liquid',
        },
        {
          name: 'components/snippets/alert/alert',
          file: 'src/_includes/components/snippets/alert/alert.liquid',
        },
        {
          name: 'components/left-right/left-right',
          file: 'src/_includes/components/left-right/left-right.liquid',
        },
        {
          name: 'components/image/image',
          file: 'src/_includes/components/image/image.liquid',
        },
        {
          name: 'components/icon/icon',
          file: 'src/_includes/components/icon/icon.liquid',
        },
        {
          name: 'components/hero/hero',
          file: 'src/_includes/components/hero/hero.liquid',
        },
        {
          name: 'components/buttons/secondary/secondary',
          file: 'src/_includes/components/buttons/secondary/secondary.liquid',
        },
        {
          name: 'components/buttons/primary/primary',
          file: 'src/_includes/components/buttons/primary/primary.liquid',
        }
      ],
      shortcodes: [
        {
          name: 'image',
          file: '_11ty_config/image_fallback.js'
        }
      ],
      filters: [
        {
          name: 'renderContent',
          file: 'bookshop/renderContent.js'
        }
      ]
    }
  });

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(RenderPlugin);
  eleventyConfig.addFilter("renderContent", renderContent)

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
