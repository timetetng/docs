# 虚拟股票市场 API 文档

欢迎使用虚拟股票市场 API。本 API 提供了查询股票行情、管理用户资产和执行交易等一系列功能，允许开发者基于此构建自己的交易客户端、数据看板或其他应用。

## 1\. 基础信息

### 1.1. Base URL

所有 API 的请求都应基于以下 URL：

```
https://stock.leewater.online
```

如果您是自己部署此插件在你的服务器上，则应该根据插件目录里的 IP 和端口号具体填写。当然插件也支持自定义域名。

### 1.2. 认证机制

本 API 对涉及用户个人数据和交易操作的接口采用 `JWT Bearer Token` 认证。

**认证流程**:

1.  **注册**: 用户需通过与 AstrBot 交互，使用网页前端注册账号，并通过QQ机器人发送 `/验证` 指令来激活和绑定账号。
2.  **登录**: 通过调用 `POST /api/auth/login` 接口，使用网页端注册的用户名和密码换取 `access_token`。
3.  **发起请求**: 在访问需要认证的接口时，将获取到的 `access_token` 放入 HTTP 请求头的 `Authorization` 字段中。
    ```
    Authorization: Bearer <your_access_token>
    ```

**token获取**：

方式一：直接在[`webk`](https://stock.leewater.online/)界面注册并登录，然后点击页面左上角的`获取token`获取；

方式二：使用下面的[认证 API 接口](##2\.-认证 (Authentication))获取.

-----

## 2\. 认证 (Authentication)

### 2.1. 用户登录

此接口用于获取访问私有资源所需的 `access_token`。

  * **Endpoint**: `POST /api/auth/login`

  * **请求体 (Request Body)**: `application/json`

    ```json
    {
      "user_id": "YourLoginId",
      "password": "YourPassword"
    }
    ```

  * **成功响应 (200 OK)**:

    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "bearer",
      "user_id": "1481273488",
      "login_id": "TimeXingjian"
    }
    ```

  * **失败响应 (401 Unauthorized)**:

    ```json
    {
      "error": "登录名或密码错误"
    }
    ```

  * **示例**

    **cURL 示例**

    ```bash
    curl -X POST "https://stock.leewater.online/api/auth/login" \
         -H "Content-Type: application/json" \
         -d '{"user_id": "TimeXingjian", "password": "your_password"}'
    ```

    **Python 示例**

    ```python
    import requests

    BASE_URL = "https://stock.leewater.online"
    auth_payload = {
        "user_id": "TimeXingjian",
        "password": "your_password"
    }

    response = requests.post(f"{BASE_URL}/api/auth/login", json=auth_payload)

    if response.status_code == 200:
        token_data = response.json()
        access_token = token_data["access_token"]
        print(f"登录成功! Token: {access_token}")
        
        # 后续请求需要使用此 token
        auth_headers = {"Authorization": f"Bearer {access_token}"}
    else:
        print(f"登录失败: {response.json()}")
    ```

-----

## 3\. 公开接口 (Public Endpoints)

以下接口无需认证即可访问。

### 3.1. 获取所有股票列表

获取当前市场上所有可交易股票的简要列表。

  * **Endpoint**: `GET /api/v1/stocks`

  * **成功响应 (200 OK)**:

    ```json
    [
      {
        "stock_id": "CY",
        "name": "晨宇科技",
        "current_price": 37.9
      },
      {
        "stock_id": "DL",
        "name": "大立农业",
        "current_price": 74.79
      }
    ]
    ```

  * **示例**

    **cURL 示例**

    ```bash
    curl "https://stock.leewater.online/api/v1/stocks"
    ```

    **Python 示例**

    ```python
    import requests
    response = requests.get("https://stock.leewater.online/api/v1/stocks")
    print(response.json())
    ```

### 3.2. 获取股票基本信息 (轻量级)

**推荐用于快速查询实时价格。**

  * **Endpoint**: `GET /api/v1/stock/{stock_id}`

  * **路径参数 (Path Parameter)**:

      * `stock_id` (string, required): 股票的唯一代码，例如 `CY`。

  * **成功响应 (200 OK)**:

    ```json
    {
      "stock_id": "CY",
      "name": "晨宇科技",
      "current_price": 37.9,
      "previous_close": 38.0,
      "industry": "科技",
      "volatility": 0.02
    }
    ```

  * **示例**

    **cURL 示例**

    ```bash
    curl "https://stock.leewater.online/api/v1/stock/CY"
    ```

### 3.3. 获取股票详细信息 (含K线)

获取单支股票的完整详细信息，包括用于绘制图表的24小时K线数据。**此接口数据包较大，请勿高频调用。**

  * **Endpoint**: `GET /api/v1/stock/{identifier}/details`

  * **路径参数 (Path Parameter)**:

      * `identifier` (string, required): 股票的标识符，可以是代码 (`CY`)、名称 (`晨宇科技`) 或编号 (`1`)。

  * **成功响应 (200 OK)**:

    ```json
    {
      "index": 1,
      "stock_id": "CY",
      "name": "晨宇科技",
      "current_price": 37.9,
      "change": -0.1,
      "change_percent": -0.26,
      "day_open": 38.0,
      "day_close": 37.9,
      "short_term_trend": "盘整",
      "kline_data_24h": [
        {
          "date": "2025-09-26T21:00:00.123Z",
          "open": 38.0,
          "high": 38.1,
          "low": 37.9,
          "close": 38.05
        }
      ]
    }
    ```

  * **示例**

    **cURL 示例**

    ```bash
    curl "https://stock.leewater.online/api/v1/stock/CY/details"
    ```

### 3.4. 获取总资产排行榜

获取全服用户的总资产排名。

  * **Endpoint**: `GET /api/v1/ranking`

  * **查询参数 (Query Parameter)**:

      * `limit` (integer, optional, default: 10): 返回排行的长度。

  * **成功响应 (200 OK)**: 响应为一个包含用户资产详情对象的数组。

  * **示例**

    **cURL 示例**

    ```bash
    curl "https://stock.leewater.online/api/v1/ranking?limit=3"
    ```

-----

## 4\. 私有接口 (Private Endpoints)

以下接口**必须**在请求头中提供 `Authorization: Bearer <token>`。

### 4.1. 获取个人持仓与资产

获取当前登录用户的完整资产报告，包括现金、股票市值、公司资产、银行存款/贷款以及详细的持仓列表。

  * **Endpoint**: `GET /api/v1/portfolio`

  * **成功响应 (200 OK)**:

    ```json
    {
      "user_id": "1481273488",
      "total_assets": 155205.98,
      "coins": 25,
      "stock_value": 104980.98,
      "company_assets": 50000,
      "bank_deposits": 200.0,
      "bank_loans": 0.0,
      "holdings_count": 2,
      "holdings_detailed": [
        {
          "stock_id": "CY",
          "name": "晨宇科技",
          "quantity": 2766,
          "avg_cost": 38.0,
          "market_value": 104831.4,
          "pnl": -276.6,
          "pnl_percent": -0.26
        }
      ],
      "total_pnl": -274.46,
      "total_pnl_percent": -0.26,
      "user_name": "TimeXingjian"
    }
    ```

  * **示例**

    **cURL 示例**

    ```bash
    TOKEN="your_access_token_here"
    curl -H "Authorization: Bearer $TOKEN" "https://stock.leewater.online/api/v1/portfolio"
    ```

    **Python 示例**

    ```python
    import requests
    # 假设 auth_headers 已通过登录获取
    # auth_headers = {"Authorization": "Bearer ..."}
    response = requests.get("https://stock.leewater.online/api/v1/portfolio", headers=auth_headers)
    print(response.json())
    ```

### 4.2. 交易接口

所有交易接口的响应格式均为：

```json
// 成功
{ "success": true, "message": "操作成功的提示信息..." }
// 失败
{ "success": false, "message": "操作失败的原因..." }
```

#### 4.2.1. 买入股票

  * **Endpoint**: `POST /api/v1/trade/buy`

  * **请求体 (Request Body)**:

    ```json
    {
      "stock_id": "CY",
      "quantity": 100
    }
    ```

  * **示例**

    **Python 示例**

    ```python
    payload = {"stock_id": "CY", "quantity": 100}
    response = requests.post("https://stock.leewater.online/api/v1/trade/buy", headers=auth_headers, json=payload)
    print(response.json())
    ```

#### 4.2.2. 卖出股票

  * **Endpoint**: `POST /api/v1/trade/sell`
  * **请求体 (Request Body)**:
    ```json
    {
      "stock_id": "CY",
      "quantity": 50
    }
    ```

#### 4.2.3. 梭哈 (买入)

  * **Endpoint**: `POST /api/v1/trade/buy_all_in`
  * **请求体 (Request Body)**:
    ```json
    {
      "stock_identifier": "CY"
    }
    ```

#### 4.2.4. 全抛 (单支)

  * **Endpoint**: `POST /api/v1/trade/sell_all_stock`
  * **请求体 (Request Body)**:
    ```json
    {
      "stock_identifier": "CY"
    }
    ```

#### 4.2.5. 清仓 (所有)

  * **Endpoint**: `POST /api/v1/trade/sell_all_portfolio`
  * **请求体 (Request Body)**: 无

-----

## 5\. 速率限制 (Rate Limiting)

为保证服务稳定和公平，API 设有请求速率限制。超过限制将返回 `429 Too Many Requests` 错误。

| 接口类型 | 限制路径 (正则表达式) | 限制额度 | 限制维度 |
| :--- | :--- | :--- | :--- |
| **认证接口** | `^/api/auth/.*` | 10 次 / 分钟 | 按 IP 地址 |
| **交易接口** | `^/api/v1/trade/.*` | 30 次 / 分钟 | 按用户 ID |
| **K线详情** | `^/api/v1/stock/[^/]+/details$` | 5 次 / 分钟 | 按 IP 地址 |
| **通用API** | `^/api/.*` | 60 次 / 分钟 | 按 IP 地址 |

-----

## 6\. HTTP 状态码

  * **`200 OK`**: 请求成功。
  * **`400 Bad Request`**: 请求体格式错误，或因业务逻辑（如金币不足、股票锁仓）导致操作失败。
  * **`401 Unauthorized`**: 未提供有效的 `access_token` 或 token 已过期。
  * **`404 Not Found`**: 请求的资源不存在（如股票代码错误）。
  * **`429 Too Many Requests`**: 请求频率超过限制。
  * **`500 Internal Server Error`**: 服务器内部发生未知错误。