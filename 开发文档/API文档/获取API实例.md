# 获取API实例

为了应对不同插件加载顺序可能导致API暂时无法获取的问题，强烈建议在插件初始化时采用异步等待的方式来获取API实例。这种方式可以确保您的插件在依赖的服务准备就绪后再执行核心逻辑。

以下是在插件主类中安全获取API的推荐模板：

```python
import asyncio
# 重点!!!统一规范 API 注册字典位置，示例中的common是plugins目录下一个子目录，和其他插件同级
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

        # 获取昵称系统API
        self.nickname_api = await self.wait_for_api("nickname_api")

        # 获取好感度系统API
        self.favour_pro_api = await self.wait_for_api("favour_pro_api")

        # --- 在这里可以继续执行需要API的插件初始化逻辑 ---
        if self.economy_api and self.shop_api:
             logger.info("核心API加载完成，插件功能已就绪。")
        else:
             logger.error("一个或多个核心API未能加载，插件无法正常运行！")

```
