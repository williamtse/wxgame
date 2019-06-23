## quickstart

## 源码目录介绍
```
./js
├── base                                   // 定义游戏开发基础类
│   ├── animatoin.js                       // 帧动画的简易实现
│   ├── pool.js                            // 对象池的简易实现
│   ├── ui.js                              // 页面元素
│   ├── app.js                             // 基础类
│   ├── page.js                            // 页面基类
│   ├── base.js                            // 基础素
│   └── sprite.js                          // 游戏基本元素精灵类 
├── libs
│   ├── symbol.js                          // ES6 Symbol简易兼容
│   └── weapp-adapter.js                   // 小游戏适配器
├── runtime
│   ├── loading.js                          // 加载资源页面
│   ├── login.js                           // 获取授权登陆页面
│   ├── levels.js                          // 数独关卡页面
│   ├── grids.js                           // 数独游戏主游戏页面
│   ├── gameinfo.js                          // 游戏结束页面
│   ├── group.js                          // 群排行榜页面
│   ├── rank.js                             // 好友排行页面
│   └── home.js                            // 首页
├── config.js                              // 配置类
└── main.js                                // 游戏入口主函数
//开放数据域
./src/myOpenDataContext
├── base                                    // 开放数据域基础类
│   ├── app.js                              // app总控
│   ├── scene.js                            // 场景基类
│   ├── ui.js                              // UI类
│   ├── util.js                             // 工具
│   ├── weapp-adapter.js                   // 小游戏适配器
├── scenes
│   ├── allranks.js                        // 好友排名
│   ├── gameover.js                        // 游戏结束后更新数据
│   ├── gameoverrank.js                    // 游戏结束后的结果页渲染
│   ├── grouprank.js                       // 朋友圈排名
│   ├── loading.js                         // 数据的预加载类
│   ├── rank.js                            // 排序处理类
│   ├── rankitem.js                        // 排名项目渲染类
│   └── ranklist.js                        // 排名渲染基类
├── index.js                               //开放域入口主函数

```
