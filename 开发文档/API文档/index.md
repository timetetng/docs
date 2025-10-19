### 插件API开发文档 (经济, 商店, 股票, 产业, 昵称 & 好感度)

#### 概述

本文档旨在为其他插件的开发者提供与 **经济系统 (`EconomyAPI`)**、 **商店系统 (`ShopAPI`)**、 **股票市场 (`StockMarketAPI`)**、 **虚拟产业 (`IndustryAPI`)**、 **昵称系统 (`NicknameAPI`)** 和 **好感度系统 (`FavourProAPI`)** 进行交互的指南。

**核心要点：**

  * 所有API方法均为**异步函数 (`async def`)**。
  * 在调用任何API方法时，**必须**使用 `await` 关键字。
  * 所有API实例均通过全局服务字典 `shared_services` 获取。

### 1\. 获取API实例 (推荐实践)

为了应对不同插件加载顺序可能导致API暂时无法获取的问题，强烈建议在插件初始化时采用异步等待的方式来获取API实例。这种方式可以确保您的插件在依赖的服务准备就绪后再执行核心逻辑。

以下是在插件主类中安全获取API的推荐模板：

```python
import asyncio
from ..common.services import shared_services
from astrbot.core.plugin import Star
from astrbot.core.config import AstrBotConfig
from astrbot.core.context import Context
from astrbot.utils.logger import logger

# 假设这是您的插件主类
class MyAwesomePlugin(Star):
    def __init__(self, context: Context, config: AstrBotConfig):
        super().__init__(context)
        # 声明API实例变量
        self.economy_api = None
        self.shop_api = None
        self.stock_api = None
        self.industry_api = None
        self.nickname_api = None
        self.favour_pro_api = None
        # 创建一个异步任务来安全地初始化API
        asyncio.create_task(self.initialize_apis())

    async def wait_for_api(self, api_name: str, timeout: int = 30):
        """通用API等待函数"""
        logger.info(f"正在等待 {api_name} 加载...")
        start_time = asyncio.get_event_loop().time()
        while True:
            api_instance = shared_services.get(api_name)
            if api_instance:
                logger.info(f"{api_name} 已成功加载。")
                return api_instance
            if asyncio.get_event_loop().time() - start_time > timeout:
                logger.warning(f"等待 {api_name} 超时，相关功能将受限！")
                return None
            await asyncio.sleep(1) # 每隔1秒重试一次

    async def initialize_apis(self):
        """
        异步初始化所有依赖的API。
        """
        # 获取经济系统API
        self.economy_api = await self.wait_for_api("economy_api")

        # 获取商店系统API
        self.shop_api = await self.wait_for_api("shop_api")
        
        # 获取股票市场API
        self.stock_api = await self.wait_for_api("stock_market_api")

        # 获取虚拟产业API
        self.industry_api = await self.wait_for_api("industry_api")

        # 获取昵称系统API (可选)
        self.nickname_api = await self.wait_for_api("nickname_api")

        # 获取好感度系统API (可选)
        self.favour_pro_api = await self.wait_for_api("favour_pro_api")

        # --- 在这里可以继续执行需要API的插件初始化逻辑 ---
        if self.economy_api and self.shop_api:
             logger.info("核心API加载完成，插件功能已就绪。")
        else:
             logger.error("一个或多个核心API未能加载，插件无法正常运行！")

```

-----

### 2\. 经济系统 (EconomyAPI)

`EconomyAPI` 由 `astrbot_plugin_sign` 插件提供，负责管理用户的金币余额和相关数据。

#### `async def get_coins(self, user_id: str) -> int`

查询指定用户的金币余额。

  * **参数:**
      * `user_id (str)`: 用户的唯一ID。
  * **返回:** `int` - 用户的金币数量。如果用户不存在，返回 `0`。可以返回负数。

#### `async def add_coins(self, user_id: str, amount: int, reason: str) -> bool`

**[重要更新]** 为指定用户增加或减少金币。此版本支持负数金币（欠款），即使余额不足，扣款操作也**会成功**并导致余额变为负数。

  * **参数:**
      * `user_id (str)`: 用户的唯一ID。
      * `amount (int)`: 要变动的数量。正数为增加，负数为减少。
      * `reason (str)`: 本次金币变动的原因，将用于记录日志。
  * **返回:** `bool` - 操作是否成功。除非传入的 `amount` 格式错误，否则通常返回 `True`。

#### `async def set_coins(self, user_id: str, amount: int, reason: str) -> bool`

**[慎用]** 直接将用户的金币设置为一个特定值。出于安全考虑，此方法**禁止**直接将用户金币设置为负数。

  * **参数:**
      * `user_id (str)`: 用户的唯一ID。
      * `amount (int)`: 要设定的目标金额，必须大于等于 `0`。
      * `reason (str)`: 操作原因。
  * **返回:** `bool` - 操作是否成功。

#### `async def get_user_profile(self, user_id: str) -> Optional[dict]`

获取用户的公开签到信息。

  * **参数:**
      * `user_id (str)`: 用户的唯一ID。
  * **返回:** `dict` 或 `None`。成功时返回包含用户信息的字典（如 `user_id`, `nickname`, `coins`, `total_days` 等），用户不存在则返回 `None`。

#### `async def get_ranking(self, limit: int = 10) -> list`

获取金币排行榜。

  * **参数:**
      * `limit (int)`: (可选) 希望获取的榜单长度，默认为 `10`。
  * **返回:** `list` - 一个由字典组成的列表，每个字典代表一位榜上的用户。

#### `async def get_coin_history(self, user_id: str, limit: int = 5) -> list`

获取指定用户最近的金币变动历史。

  * **参数:**
      * `user_id (str)`: 用户的唯一ID。
      * `limit (int)`: (可选) 希望获取的记录条数，默认为 `5`。
  * **返回:** `list` - 一个由字典组成的列表，每个字典代表一条金币变动记录。

-----

### 3\. 商店系统 (ShopAPI)

`ShopAPI` 由 `shop_plugin` 插件提供，负责管理商品定义、用户库存以及物品的消耗。

#### `async def register_item(self, owner_plugin: str, item_id: str, name: str, description: str, price: int, daily_limit: int = 0)`

用于插件向商店注册一个可供出售的商品。

  * **参数:**
      * `owner_plugin (str)`: 注册该物品的插件名称。
      * `item_id (str)`: 物品的唯一英文ID。
      * `name (str)`: 物品的显示名称。
      * `description (str)`: 物品的功能描述。
      * `price (int)`: 物品的售价。
      * `daily_limit (int)`: (可选) 每日限购数量，`0` 表示不限制。默认为 `0`。
  * **返回:** 无。

#### `async def get_item_details(self, identifier: str) -> Optional[Dict[str, Any]]`

根据物品的ID或名称获取其详细信息。

  * **参数:**
      * `identifier (str)`: 物品的唯一英文ID或中文名称。
  * **返回:** `dict` 或 `None` - 成功时返回包含商品所有属性的字典，如果找不到则返回 `None`。

#### `async def get_user_inventory(self, user_id: str) -> list`

获取指定用户的整个背包（物品列表）。

  * **参数:**
      * `user_id (str)`: 用户的唯一ID。
  * **返回:** `list` - 一个由字典组成的列表，每个字典代表用户拥有的一个物品。

#### `async def has_item(self, user_id: str, item_id: str) -> bool`

检查用户是否拥有至少一个指定的物品。

  * **参数:**
      * `user_id (str)`: 用户的唯一ID。
      * `item_id (str)`: 要检查的物品的唯一ID。
  * **返回:** `bool` - 如果用户拥有该物品，返回 `True`，否则返回 `False`。

#### `async def consume_item(self, user_id: str, item_id: str, quantity: int = 1) -> bool`

消耗（移除）用户背包中的指定物品。

  * **参数:**
      * `user_id (str)`: 用户的唯一ID。
      * `item_id (str)`: 要消耗的物品的唯一ID。
      * `quantity (int)`: (可选) 要消耗的数量，默认为 `1`。
  * **返回:** `bool` - 如果用户拥有足够数量的物品并成功消耗，返回 `True`。如果物品数量不足，返回 `False`。

#### `async def get_today_purchase_count(self, user_id: str, item_id: str) -> int`

**[新增]** 查询用户今日已购买某限购商品的数量。

  * **参数:**
      * `user_id (str)`: 用户的唯一ID。
      * `item_id (str)`: 限购商品的唯一ID。
  * **返回:** `int` - 用户今天已购买该商品的数量。

#### `async def log_purchase(self, user_id: str, item_id: str, quantity: int)`

**[新增]** 记录用户的购买行为，用于限购统计。当其他插件通过非商店途径（如直接调用`economy_api.add_coins`）让用户获得限购商品时，应调用此API来消耗额度。

  * **参数:**
      * `user_id (str)`: 用户的唯一ID。
      * `item_id (str)`: 限购商品的唯一ID。
      * `quantity (int)`: 购买的数量。
  * **返回:** 无。

-----

### 4\. 股票市场 (StockMarketAPI)

`StockMarketAPI` 由模拟炒股插件提供，用于与其他系统（如虚拟产业）进行交互，管理股票的生命周期和价格。

#### `async def register_stock(self, ticker: str, company_name: str, initial_price: float, total_shares: int, owner_id: str) -> bool`

注册一支新的股票到市场 (通常由公司IPO时调用)。

  * **参数:**
      * `ticker (str)`: 股票代码 (如 "APPL")。
      * `company_name (str)`: 公司名称。
      * `initial_price (float)`: 初始发行价。
      * `total_shares (int)`: 总股本。
      * `owner_id (str)`: 公司所有者的用户ID。
  * **返回:** `bool` - 注册是否成功。

#### `async def delist_stock(self, ticker: str) -> bool`

当公司破产或倒闭时，将其从市场退市。

  * **参数:**
      * `ticker (str)`: 股票代码。
  * **返回:** `bool` - 操作是否成功。

#### `async def is_ticker_available(self, ticker: str) -> bool`

检查一个股票代码是否可用（未被注册）。

  * **参数:**
      * `ticker (str)`: 股票代码。
  * **返回:** `bool` - 如果可用返回 `True`，否则 `False`。

#### `async def set_intrinsic_value(self, ticker: str, value: float)`

**[关键接口]** 设置或更新一只股票的内在价值（基本面价值）。此价值是股价的“锚”，股价会围绕它波动。通常由公司插件在公司升级、资产变动后调用。

  * **参数:**
      * `ticker (str)`: 股票代码。
      * `value (float)`: 新的内在价值。
  * **返回:** 无。

#### `async def get_stock_price(self, ticker: str) -> Optional[float]`

获取指定股票的当前市场价格。

  * **参数:**
      * `ticker (str)`: 股票代码。
  * **返回:** `float` 或 `None` - 股票的当前价格，如果股票不存在则返回 `None`。

#### `async def get_market_cap(self, ticker: str) -> Optional[float]`

获取指定股票的总市值（当前价格 \* 总股本）。

  * **参数:**
      * `ticker (str)`: 股票代码。
  * **返回:** `float` 或 `None` - 股票的总市值，如果股票不存在则返回 `None`。

#### `async def report_earnings(self, ticker: str, performance_modifier: float)`

上报公司的业绩表现，用于驱动股价大幅波动（如财报季）。

  * **参数:**
      * `ticker (str)`: 股票代码。
      * `performance_modifier (float)`: 业绩修正因子，正数大利好，负数大利空。
  * **返回:** 无。

#### `async def report_event(self, ticker: str, price_impact_percentage: float)`

上报一个能即时影响股价的随机事件（如公司被攻击、政策变动等）。

  * **参数:**
      * `ticker (str)`: 股票代码。
      * `price_impact_percentage (float)`: 价格影响百分比，例如 `0.1` 表示上涨10%，`-0.05` 表示下跌5%。
  * **返回:** 无。

#### `async def get_user_total_asset(self, user_id: str) -> Dict[str, Any]`

获取单个用户的详细总资产信息（包含现金和股票持仓）。

  * **参数:**
      * `user_id (str)`: 用户的唯一ID。
  * **返回:** `dict` - 包含用户资产详情的字典。

#### `async def get_total_asset_ranking(self, limit: int = 10) -> List[Dict[str, Any]]`

获取总资产（现金+股票）排行榜。

  * **参数:**
      * `limit (int)`: (可选) 榜单长度，默认为 `10`。
  * **返回:** `list` - 包含用户资产排名的字典列表。

-----

### 5\. 虚拟产业系统 (IndustryAPI)

`IndustryAPI` 由虚拟产业插件提供，用于查询用户的公司资产信息。

#### `async def get_company_asset_value(self, user_id: str) -> int`

获取单个用户的公司总资产净值。

  * **参数:**
      * `user_id (str)`: 用户的唯一ID。
  * **返回:** `int` - 用户的公司资产净值。如果用户没有公司，则返回 `0`。

#### `async def get_top_companies_by_value(self, limit: int = 10) -> List[Dict[str, Any]]`

获取公司资产价值排行榜。该榜单会实时计算所有公司的总价值（包括固定资产和股票市值）。

  * **参数:**
      * `limit (int)`: (可选) 希望获取的榜单长度，默认为 `10`。
  * **返回:** `list` - 一个字典列表，每个字典包含 `'user_id'`, `'company_name'`, `'asset_value'`。

-----

### 6\. 昵称系统 (NicknameAPI)

`NicknameAPI` 由 `astrbot_plugin_nickname` 插件提供，用于获取用户设置的自定义昵称。

#### `async def get_nickname(self, user_id: str) -> Optional[str]`

获取单个用户的自定义昵称。

  * **参数:**
      * `user_id (str)`: 用户的唯一ID。
  * **返回:** `str` 或 `None` - 如果用户设置了自定义昵称，则返回该昵称字符串；否则返回 `None`。

#### `async def get_nicknames_batch(self, user_ids: List[str]) -> Dict[str, str]`

批量获取多个用户的自定义昵称，适用于排行榜等场景以提高效率。

  * **参数:**
      * `user_ids (List[str])`: 一个包含多个用户ID的列表。
  * **返回:** `Dict[str, str]` - 一个字典，键是用户ID，值是对应的自定义昵称。只包含在列表中找到了昵称的用户。

-----

### 7\. 好感度系统 (FavourProAPI)

`FavourProAPI` 由 `FavourPro` 插件提供，负责管理机器人对用户的多维度好感度状态。

#### `async def get_user_state(self, user_id: str, session_id: Optional[str] = None) -> Optional[Dict[str, Any]]`

获取用户的完整好感度状态。

  * **参数:**
      * `user_id (str)`: 用户的唯一ID。
      * `session_id (Optional[str])`: (可选) 会话ID，用于区分不同场景。
  * **返回:** `dict` 或 `None`。成功时返回包含 `favour`, `attitude`, `relationship` 的字典，如果用户无记录则返回 `None`。

#### `async def add_favour(self, user_id: str, amount: int, session_id: Optional[str] = None)`

为指定用户增加或减少好感度。

  * **参数:**
      * `user_id (str)`: 用户的唯一ID。
      * `amount (int)`: 要变动的数量。正数为增加，负数为减少。
      * `session_id (Optional[str])`: (可选) 会话ID。
  * **返回:** 无。

#### `async def set_favour(self, user_id: str, amount: int, session_id: Optional[str] = None)`

**[慎用]** 直接将用户的好感度设置为一个特定值。

  * **参数:**
      * `user_id (str)`: 用户的唯一ID。
      * `amount (int)`: 要设定的目标好感度值。
      * `session_id (Optional[str])`: (可选) 会话ID。
  * **返回:** 无。

#### `async def set_attitude(self, user_id: str, attitude: str, session_id: Optional[str] = None)`

设置机器人对用户的印象描述。

  * **参数:**
      * `user_id (str)`: 用户的唯一ID。
      * `attitude (str)`: 新的印象描述文本。
      * `session_id (Optional[str])`: (可选) 会话ID。
  * **返回:** 无。

#### `async def set_relationship(self, user_id: str, relationship: str, session_id: Optional[str] = None)`

设置机器人与用户的关系描述。

  * **参数:**
      * `user_id (str)`: 用户的唯一ID。
      * `relationship (str)`: 新的关系描述文本。
      * `session_id (Optional[str])`: (可选) 会话ID。
  * **返回:** 无。

#### `async def get_favour_ranking(self, limit: int = 10) -> List[Dict[str, Any]]`

获取好感度排行榜。

  * **参数:**
      * `limit (int)`: (可选) 希望获取的榜单长度，默认为 `10`。
  * **返回:** `list` - 一个由字典组成的列表，每个字典包含 `user_id` 和 `favour`。

#### `async def get_dislike_ranking(self, limit: int = 10) -> List[Dict[str, Any]]`

**[新增]** 获取厌恶度排行榜（好感度从低到高排序）。

  * **参数:**
      * `limit (int)`: (可选) 希望获取的榜单长度，默认为 `10`。
  * **返回:** `list` - 一个由字典组成的列表，每个字典包含 `user_id` 和 `favour`。

### 8\.成就插件 (`AchievementAPI`) 

#### 概述

本API允许其他插件动态地注册成就，或主动为用户解锁成就。

#### 1. 获取API实例

首先，在你的插件主类的 `__init__` 方法中，通过 `shared_services` 获取API实例。强烈建议使用异步等待函数来确保获取成功。

```python
import asyncio
from ..common.services import shared_services
# ...

class YourOtherPlugin(Star):
    def __init__(self, context: Context, config: AstrBotConfig):
        super().__init__(context)
        self.achievement_api = None
        asyncio.create_task(self.initialize_apis())

    async def initialize_apis(self):
        self.achievement_api = await self.wait_for_api("achievement_api")
        if self.achievement_api:
            logger.info("成功连接到成就系统API。")
        else:
            logger.warning("未能连接到成就系统API，相关功能将受限。")
    
    async def wait_for_api(self, api_name: str, timeout: int = 30):
        # ... (通用API等待函数的实现) ...
```

---
#### 2. API 方法详解

##### `async def register_achievement(...) -> (bool, str)`

在插件启动或特定时机，向成就系统动态注册一个新成就。

* **参数**:
    * `owner_plugin (str)`: 你的插件名称，如 `"shop_plugin"`。
    * `ach_id (str)`: 成就的全局唯一ID，如 `"shop_first_legendary_item"`。
    * `title (str)`: 成就的显示名称，如 `"传说中的工匠"`。
    * `description (str)`: 成就的描述，如 `"第一次购买了传说品质的物品。"`。
    * `icon_path (str)`: 成就图标的**绝对路径**或**相对于AstrBot根目录的路径**。
    * `rarity (str)`: 稀有度，依次递增为 `rarity_list = ['common', 'rare', 'epic', 'legendary', 'mythic', 'miracle', 'flawless']`。
    * `reward_coins (int)`: (可选) 奖励的金币数量，默认为 `0`。
    * `check_func (Callable)`: (可选) 一个异步检查函数，用于被动检查。如果你的成就只需要主动解锁，此项可为 `None`。
    * `"unique"`:（可选）是否为唯一成就，该成就被首次解锁后不再可被触发。
    * `hidden (bool)`: (可选) 是否为隐藏成就，默认为 `False`。隐藏成就只有在解锁后才对用户可见。


* **返回**: `(bool, str)` - 一个元组，`(是否成功, 附带信息)`。

* **示例**:
    ```python
    # 在你的插件的某个初始化逻辑里
    if self.achievement_api:
        success, message = await self.achievement_api.register_achievement(
            owner_plugin="my_shop_plugin",
            ach_id="buy_sword",
            title="剑术大师",
            description="在商店购买了第一把剑。",
            icon_path="data/plugins/my_shop_plugin/assets/sword_icon.png",
            rarity="rare",
            reward_coins=200
        )
        if success:
            logger.info("自定义商店成就注册成功！")
        else:
            logger.error(f"商店成就注册失败: {message}")
    ```

##### `async def unlock_achievement(user_id: str, achievement_id: str, event: Optional[AstrMessageEvent] = None) -> bool`

当你的插件内部逻辑判断用户达成了某个条件时，调用此方法为用户**立即解锁**一个成就。

* **参数**:
    * `user_id (str)`: 目标用户的ID。
    * `achievement_id (str)`: 要解锁的成就的ID。
    * `event (Optional[AstrMessageEvent])`: **非常重要**。
        * 如果你**传入**了当前事件的 `event` 对象，插件会自动为用户发送解锁通知（合并转发消息）。
        * 如果你**不传入** (或传入 `None`)，插件将**静默解锁**，只记录数据和发放奖励，不发送任何通知。

* **返回**: `bool` - `True` 表示成功解锁, `False` 表示用户之前已解锁或成就ID不存在。

* **示例 (在你的某个指令处理器中)**:
    ```python
    # 假设这是一个购买物品的指令
    @filter.command("buy")
    async def buy_item(self, event: AstrMessageEvent, item_name: str):
        # ... 购买逻辑 ...
        
        # 假设用户购买了“圣剑”，我们想立即为他解锁成就
        if item_name == "圣剑" and self.achievement_api:
            user_id = event.get_sender_id()
            
            # 调用API，传入event对象以发送通知
            was_unlocked = await self.achievement_api.unlock_achievement(
                user_id=user_id,
                achievement_id="buy_sword",
                event=event 
            )
            
            if was_unlocked:
                logger.info(f"用户 {user_id} 通过主动调用API解锁了成就 buy_sword。")
    ```