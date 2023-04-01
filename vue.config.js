const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/Vue-Timezone-Weather-Compare/",
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();
    svgRule.delete('type');
    svgRule.delete('generator');

    svgRule
     .oneOf('inline')
     .resourceQuery(/inline/)
     .use('babel-loader')
     .loader('babel-loader')
     .end()
     .use('vue-svg-loader')
     .loader('vue-svg-loader')
     .end()
     .end()
     .oneOf('external')
     .use('file-loader')
     .loader('file-loader')
     .options({
       name: 'assets/[name].[hash:8].[ext]',
     });
   },
})
