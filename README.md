# WFM Component Client

> WAFER VIEW 制造执行系统 (WFM) 的客户端组件，提供设备状态监控、可视化管理及系统配置功能。

## 项目概览

| 属性 | 说明 |
|------|------|
| **Group ID** | `com.ibm.waferview.wfm` |
| **Artifact ID** | `wfm-componet-client` |
| **版本** | `1.0.1` |
| **构建工具** | Maven |
| **打包方式** | Spring Boot 可执行 JAR |

## 技术栈

### 后端
- **Spring Boot 2.4.1** — 核心框架
- **Spring Security** — 安全认证与授权
- **JWT (JSON Web Token)** — 无状态身份认证
- **MyBatis 2.1.4** — ORM 持久层
- **Druid 1.2.4** — 数据库连接池与监控
- **IBM DB2** — 企业级关系型数据库
- **Log4j2** — 日志管理
- **Lombok** — 代码简化
- **Fastjson / Apache POI / HttpClient** — 工具库

### 前端
- **JSP + JSTL** — 服务端页面渲染
- **jQuery / jQuery UI** — DOM 操作与交互组件
- **Bootstrap** — UI 响应式框架
- **Bootstrap Table / DateTimePicker** — 表格与日期组件
- **Handsontable** — 类 Excel 表格编辑
- **zTree** — 树形结构组件
- **D3.js** — 数据可视化
- **自定义 SVG** — 厂图 (FabView) 可视化展示

## 功能模块

| 模块 | 说明 |
|------|------|
| **设备监控 (Monitor)** | 实时查看设备状态、WIP 信息、报警历史、OHT 状态 |
| **厂图可视化 (FabView)** | 基于 SVG 的楼层设备布局与状态可视化 |
| **用户认证 (Auth)** | JWT + Spring Security 登录鉴权，支持会话管理 |
| **系统管理 (SysAdmin)** | 菜单管理、用户权限、角色配置 |
| **颜色定义 (ColorDefine)** | 设备状态颜色规则自定义 |
| **楼层定义 (FloorDef)** | 厂区楼层与设备布局配置 |
| **文件管理 (Upload)** | SVG 厂图文件上传与管理 |
| **多语言 (i18n)** | 支持简体中文、繁体中文、英文 |

## 项目结构

```
wfm-componet-client/
├── pom.xml                          # Maven 构建配置
├── lib/
│   └── db2jcc4.jar                  # DB2 JDBC 驱动（本地依赖）
├── src/main/
│   ├── java/com/ibm/waferview/wfm/
│   │   ├── WfmSpringBootApplication.java   # 启动类
│   │   ├── controller/              # REST / MVC 控制器
│   │   ├── service/                 # 业务逻辑层
│   │   ├── dao/                     # MyBatis Mapper 接口
│   │   ├── security/                # JWT + Spring Security 配置
│   │   ├── config/                  # Spring 配置类
│   │   ├── vo/                      # 视图/值对象
│   │   └── utils/                   # 工具类
│   ├── resources/
│   │   ├── mapper/                  # MyBatis XML 映射文件
│   │   ├── application.yml          # 主配置（多环境开关）
│   │   ├── application-dev.yml      # 开发环境配置
│   │   ├── application-tst.yml      # 测试环境配置
│   │   ├── application-prod.yml     # 生产环境配置
│   │   ├── log4j.xml                # 日志配置
│   │   └── i18n/                    # 国际化资源文件
│   └── webapp/                      # 前端静态资源与 JSP 页面
│       ├── WEB-INF/jsp/             # JSP 视图模板
│       ├── script/                  # JavaScript 业务脚本
│       ├── css/                     # 样式文件
│       ├── svg/                     # 厂图 SVG 文件
│       └── zTree / d3 / bootstrap-* # 第三方前端库
├── wfm_file/                        # 运行时数据文件目录
│   ├── svg/                         # 楼层 SVG 厂图
│   └── data/                        # 状态/颜色 JSON 缓存
└── target/                          # 构建输出目录
```

## 快速开始

### 环境要求
- JDK 1.8+
- Maven 3.6+
- IBM DB2 数据库

### 编译打包
```bash
mvn clean package
```

### 运行应用
```bash
java -jar target/wfm-componet-client-1.0.1.jar
```

或直接启动主类：
```bash
mvn spring-boot:run
```

### 访问地址
默认开发环境启动后：
- **应用根路径**: `http://localhost:6080/wfm-component-client`
- **登录页面**: `http://localhost:6080/wfm-component-client/service/auth/preLogin`
- **监控大屏**: `http://localhost:6080/wfm-component-client/service/api/wfm_monitor`


## 快速上手

以下步骤帮助新人快速跑通项目：

1. **克隆仓库**  
   ```bash
   git clone <repo-url> MyWFM
   cd MyWFM
   ```

2. **环境准备**（已在 “快速开始” 中列出）  
   - JDK 1.8+
   - Maven 3.6+
   - IBM DB2（可选本地 H2 进行开发测试）

3. **编译打包**  
   ```bash
   mvn clean package
   ```

4. **运行应用**  
   ```bash
   java -jar target/wfm-componet-client-1.0.1.jar
   ```

5. **访问系统**  
   打开浏览器访问 `http://localhost:6080/wfm-component-client`，登录页面路径为 `/service/auth/preLogin`。

> **提示**：若希望在 IDE 中直接运行，可使用 `mvn spring-boot:run`，系统会自动加载 `src/main/webapp` 下的前端资源。
> 所有 API 接口前缀为 `/service/*`，由 `DispatcherServlet` 统一映射。

## 配置说明

### 多环境配置 (`application-*.yml`)

| 文件 | 用途 |
|------|------|
| `application.yml` | 激活指定环境（默认 `dev`） |
| `application-dev.yml` | 开发环境（端口 6080，DB2 开发库） |
| `application-tst.yml` | 测试环境 |
| `application-prod.yml` | 生产环境 |

### 关键配置项

```yaml
server:
  port: 6080
  servlet:
    context-path: /wfm-component-client

spring:
  datasource:
    driver-class-name: com.ibm.db2.jcc.DB2Driver
    url: jdbc:db2://<host>:50001/<DB>?currentSchema=WFM
    username: <username>
    password: <password>
    type: com.alibaba.druid.pool.DruidDataSource

jwt:
  secret: mySecret
  expiration: 3600000        # Token 有效期（毫秒）
  tokenHead: Bearer
  header: Authorization

eqpstatusupdate:
  schedules: 0 */1 * * * ?   # 设备状态更新定时任务（每1分钟）

updateVehicleData:
  schedules: 1/5 * * * * ?   # 车辆数据更新定时任务（每5秒）
```

## 安全机制

- **认证方式**: JWT Token + Session 双重机制
- **密码加密**: BCrypt
- **Remember Me**: 支持自动登录（Token 有效期同步）
- **权限控制**: 基于 Spring Security 的方法级安全注解 (`@PreAuthorize`)
- **Session 管理**: 登录后重新生成 Session，设置最大存活时间

### 公开接口（无需认证）
- `/service/auth/**` — 登录相关
- `/service/api/wfm_monitor` — 监控大屏
- `/service/api/getEqpStatusMaps` — 设备状态地图
- `/service/api/listEqpStatusInfo` — 设备状态列表
- `/service/api/getColorMap` — 颜色定义
- `/service/api/getOHTStatus` — OHT 状态
- 静态资源文件（JS / CSS / 图片 / SVG / 字体）

## 数据库

- **数据库类型**: IBM DB2
- **默认 Schema**: `WFM`
- **连接池**: Alibaba Druid（支持 SQL 监控与连接检测）

### 主要数据表领域
- 设备定义 (`EQP_DEF`)
- 设备状态 (`EQP_STATUS`)
- 用户与权限 (`USER`, `USER_PRIVILEGE`)
- 楼层定义 (`WFM_FLOOR_DEF`)
- 颜色定义 (`COLOR_DEFINE`)
- 报警历史 (`ALRM_HIS`)
- WIP 在制品信息 (`WIP`)

## 国际化 (i18n)

支持以下语言资源文件：
- `messages.properties` — 默认（简体中文）
- `messages_zh_CN.properties` — 简体中文
- `messages_zh_TW.properties` — 繁体中文
- `messages_en_US.properties` — 英文

语言切换通过请求参数 `?lang=zh_CN` 或 Session 属性 `wfm-language` 控制。

## 定时任务

| 任务名称 | Cron 表达式 | 说明 |
|----------|-------------|------|
| `eqpstatusupdate` | `0 */1 * * * ?` | 每小时更新设备状态缓存到 JSON 文件 |
| `updateVehicleData` | `1/5 * * * * ?` | 每 5 秒更新车辆 (OHT) 数据 |

## 注意事项

## 贡献指南

我们欢迎社区贡献。提交 PR 前请确保：

- 运行 `npm test`（若前端）或 `mvn test`（后端）通过。
- 代码符合项目的代码风格（遵循 Checkstyle、ESLint）。
- 在 `src/main/resources/application-dev.yml` 中使用本地数据库进行测试。

### 步骤

1. Fork 本仓库。
2. 创建 feature 分支 `git checkout -b feature/your-feature`。
3. 完成代码编写并添加相应单元测试。
4. 提交并推送到你的仓库，发起 Pull Request。

## 常见问题 (FAQ)

**Q: 如何更换数据库？**  
A: 修改 `application-*.yml` 中的 `spring.datasource.url`、`username`、`password`，并确保相应驱动在 `lib/` 目录。

**Q: 前端资源修改后需要重新打包吗？**  
A: 开发时使用 `mvn spring-boot:run` 即可实时加载 `src/main/webapp` 目录下的资源。生产部署请执行 `mvn clean package`。

**Q: 如何开启多语言支持？**  
A: 在请求 URL 加上 `?lang=zh_TW` 或在 Session 中设置 `wfm-language`。

1. **本地依赖**: `lib/db2jcc4.jar` 为 IBM DB2 驱动，已配置为系统依赖打包进 BOOT-INF/lib。
2. **外部文件**: `wfm_file/` 目录用于存放 SVG 厂图及运行时 JSON 缓存数据，部署时请确保该目录存在且有读写权限。
3. **JSP 支持**: 使用嵌入式 Tomcat 的 `tomcat-embed-jasper` 引擎渲染 JSP，生产环境建议预编译。
4. **Maven 编译参数**: 通过 `extdirs` 引入 `lib/` 目录下的本地 JAR。

## 联系方式

如有问题，请联系项目维护团队。
