<template>
  <div class="wrapper">
     <div class="pic no-phone">
        <img src="../../static/sidebar.svg" alt="" width="125%">
    </div>
    <nav id="sidebar"
        :class="{'sidebar-image': sidebarUrl !== ''}">
      <div class="profile" v-if="false">
        <a href="/">
          <img :src="logoUrl" :alt="siteInfo.title.value">
        </a>
        <span :style="{'color': sidebarUrl ? option.sidebarFontColor : ''}">{{siteInfo.title.value}}</span>
      </div>
      <ul class="sidebar-link" v-if="option && option.menu">
        <li v-for="menu of option.menu" :key="menu.label">
          <router-link class="sidebar-link-item" :to="{path: menu.url}" :title="menu.label">
            <span class="rotate-1">{{menu.label[0]}}</span><span class="rotate-2">{{menu.label[1]}}</span>
          </router-link>
        </li>
      </ul>
      <ul class="sidebar-buttons" v-if="siteInfo && siteInfo.weiboUrl">
        <li>
          <a :href="'https://github.com' + siteInfo.githubUrl.value"
            target="_blank"
            class="inline"
            v-if="siteInfo.githubUrl.value"
            ref="nofollow">
            <i title="GitHub"></i>
          </a>
        </li>
        <li>
          <a :href="siteInfo.weiboUrl.value"
            target="_blank"
            class="inline"
            v-if="siteInfo.weiboUrl.value"
            ref="nofollow">
            <i title="GitHub"></i>
          </a>
        </li>
        <li>
          <a href="/rss.xml" target="_blank" class="inline">
            <i title="RSS"></i>
          </a>
        </li>
        <li>
          <a :href="'https://www.google.com/webhp#newwindow=1&safe=strict&q=site:' + siteInfo.siteUrl.value"
            target="_blank"
            class="inline"
            v-if="siteInfo.siteUrl.value">
            <i title="Search"></i>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
  import mixin from '../mixin/image';

  export default {
    name: 'sideBar',
    mixins: [mixin]
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
@media only screen and (max-width: 768px)
  .wrapper
    font-family: 'special-for-me'
    a
      color: #fff
    .sidebar-link
      display: flex
      justify-content: space-around
      line-height: 2
      background: #000
      font-size: 2rem
@media only screen and (min-width: 769px)
  .wrapper 
    position: relative
    font-family: 'special-for-me'
    &::before
      position: absolute
      content: ''
      left: 0 
      right: 0
      top: 0
      bottom: 0
      background: black
      clip-path: polygon(0 0, 100% 0, calc(100% - 30vh) 100%, 0% 100%) 
    .pic 
      position: absolute
      font-size: 0
      bottom: 0
      left: calc(75% - 30vh)
      width: 100%
    #sidebar 
      height: 100vh
      position: relative
      &::before
        position: absolute
        content: ''
        left: 0 
        right: 0
        top: 0
        bottom: 0
        background: white
        clip-path: polygon(97% 0, 100% 0, calc(100% - 30vh) 100%, calc(97% - 30vh) 100%)
      a
        color: #fff
      .sidebar-link
        padding: 0
        text-align: center
        font-size: 4rem
        transform: rotate(20deg) translate(26%)
        line-height: 2
        .sidebar-link-item:hover 
          .rotate-1
            transform: rotate(-20deg) translate(-10%, 10%)
          .rotate-2
            transform: rotate(-20deg) translate(10%)
        .rotate-1 
          display: inline-block
          transition: all .2s ease-out
          transform: rotate(-40deg)
          -webkit-text-stroke: 2px black;
        .rotate-2 
          display: inline-block
          transition: all .2s ease-out
          color: black
          -webkit-text-stroke: 2px white;
          transform: rotate(15deg) translate(5%)


</style>
