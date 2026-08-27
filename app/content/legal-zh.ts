import type { ProjectLegalLocaleMap } from "../lib/content/types";

const legal: ProjectLegalLocaleMap = {
  "celestial-insights": {
    privacy: {
      title: "隐私政策",
      effectiveDate: "最后更新：2026年6月7日",
      introduction: "本政策说明 Celestial Insights 收集哪些信息、收集原因、这些信息在 iOS 应用和网页体验中的使用方式，以及用户如何管理或删除自己的数据。",
      sections: [
        { title: "我们收集的信息", items: ["电子邮件地址、账户标识符和可选个人资料名称等账户信息。", "您选择保存的出生和本命盘资料，包括出生日期、出生时间、出生地点，以及根据这些信息生成的星盘快照。", "引导、偏好和设置数据，例如解读风格、关注领域、语言、通知和音频偏好。", "解读内容和产品使用数据，例如已保存记录、AI 聊天记录、配额计数和功能使用事件。", "从 RevenueCat 和 App Store 同步的订阅状态，包括方案等级、权益状态、续订状态和到期时间。", "IP 地址、设备或浏览器信息、请求日志以及防欺诈或防滥用信号等技术和安全数据。"] },
        { title: "我们为何收集这些信息", items: ["用于验证用户身份，并使同一账户可在移动端和网页端使用。", "用于生成星盘、解读、匹配结果和其他个性化占星内容。", "用于保存记录、同步账户状态，并在不同平台间保持订阅权益一致。", "用于发送验证码、密码恢复码等账户邮件。", "用于提高可靠性、调查滥用行为并监控产品性能。"] },
        { title: "第三方服务", items: ["Supabase 用于身份验证、数据库存储和服务器函数。", "RevenueCat 用于同步 App Store 订阅状态和权益变更。", "当您选择相应登录方式时，可能会使用 Google 和 Apple 身份验证服务。", "EmailJS 目前用于少量发送交易型身份验证邮件。", "在公开网站展示广告时，Google AdSense 可能会设置 Cookie 或收集浏览器层面的广告信号。"] },
        { title: "数据共享方式", paragraphs: ["我们不会出售您的个人数据。我们只会与协助产品运行的服务提供商共享数据，包括基础设施、身份验证、订阅、电子邮件和分析服务，并且仅用于本政策所述目的。"] },
        { title: "保留与删除", paragraphs: ["我们会在运营服务、履行法律义务、解决争议和维护安全所需的期限内保留账户和解读数据。当您申请删除账户时，我们会删除法律未要求保留的账户记录及相关数据。"] },
        { title: "您的选择", items: ["您可以在 Celestial Insights 应用的账户区域更新个人资料。", "您可以通过 Celestial Insights 应用的设置流程申请删除账户。", "您可以在 https://apps.apple.com/account/subscriptions 管理 Apple 订阅。", "如有隐私或删除相关问题，请联系 alurixofficial@gmail.com。"] },
        { title: "联系我们", paragraphs: ["如有隐私问题、数据请求或账户相关疑问，请联系 alurixofficial@gmail.com。"] },
      ],
    },
    terms: {
      title: "服务条款",
      effectiveDate: "生效日期：2026年6月7日",
      introduction: "本条款适用于访问 Celestial Insights 移动应用、网站及相关服务。",
      sections: [
        { title: "服务范围", paragraphs: ["Celestial Insights 提供占星、神谕、仪式和 AI 辅助解读工具，用于个人反思和娱乐。本服务不构成医疗、法律、财务、心理或紧急建议。"] },
        { title: "账户", items: ["您应对选择保存到账户中的信息准确性负责。", "您应负责保护登录凭据的机密性。", "如存在滥用、欺诈、违法使用或干扰服务的行为，我们可能暂停或终止访问权限。"] },
        { title: "订阅", items: ["Celestial Insights 付费订阅通过 iOS 应用中的 Apple App 内购买销售。", "计费、续订、取消和退款均受 Apple 系统和政策约束。", "您可以在 https://apps.apple.com/account/subscriptions 管理订阅。"] },
        { title: "已保存内容和记录", paragraphs: ["如果您保存解读、聊天记录或其他与账户关联的输出，这些记录将与账户绑定，以便在支持的平台上访问。您应对已保存输出的使用和分享方式负责。"] },
        { title: "可用性与变更", paragraphs: ["为了维护产品质量、安全或商业可持续性，我们可能随时更新、改进、限制或删除功能。我们不保证每项功能始终在所有平台可用。"] },
        { title: "责任限制", paragraphs: ["在法律允许的最大范围内，Celestial Insights 按现状和可用状态提供。对于因使用占星或 AI 生成内容而产生的决定、结果、损失或损害，我们不承担责任。"] },
        { title: "联系我们", paragraphs: ["如有支持或法律问题，请联系 alurixofficial@gmail.com。"] },
      ],
    },
  },
  strumai: {
    privacy: {
      title: "隐私政策",
      effectiveDate: "最后更新：2026年7月16日",
      introduction: "本政策说明 StrumAI 收集哪些信息、收集原因，以及您如何就隐私权与我们联系。",
      sections: [
        { title: "我们收集的信息", paragraphs: ["StrumAI 可能会处理 Apple 或 Google 登录提供的账户标识符、您选择添加的个人资料、社区帖子和评论、练习活动、应用设置、订阅状态、支持消息，以及运营服务所需的技术诊断数据。"] },
        { title: "信息使用方式", paragraphs: ["我们使用这些信息提供身份验证、订阅、练习跟踪、社区功能、AI 辅助吉他工具、通知、安全控制、支持和服务可靠性。"] },
        { title: "第三方服务", paragraphs: ["应用可能使用以下服务提供商：用于后端基础设施的 Supabase、用于订阅的 RevenueCat 和 Apple、用于登录的 Google 或 Apple、用于音乐相关回复的 AI 提供商，以及用于设备提醒的通知服务。"] },
        { title: "您的选择", paragraphs: ["您可以更新个人资料、管理通知偏好、恢复购买、屏蔽用户、在提供相应功能时删除内容，或发送邮件至 alurixofficial@gmail.com 提交隐私请求。"] },
        { title: "儿童", paragraphs: ["StrumAI 面向一般吉他学习用户，并非针对 13 岁以下儿童设计。"] },
      ],
    },
    terms: {
      title: "服务条款",
      effectiveDate: "最后更新：2026年7月16日",
      introduction: "本条款说明可接受的使用方式、订阅、社区内容、AI 指导和支持预期。",
      sections: [
        { title: "StrumAI 的使用", paragraphs: ["请合法使用 StrumAI 学习吉他、进行音乐练习、探索音色和参与社区分享。请勿滥用社区功能、冒充他人或上传您无权分享的内容。"] },
        { title: "订阅", paragraphs: ["StrumAI Plus 购买由 Apple 处理。续订、取消、退款和计费受 Apple 账户设置和 App Store 规则约束。"] },
        { title: "AI 指导", paragraphs: ["AI 回复属于音乐教育指导，并不保证音乐、技术、健康或职业结果。请始终运用自己的判断，并保护听力和设备。"] },
        { title: "社区内容", paragraphs: ["您应对自己发布的内容负责。对于违反安全、权利或社区规范的内容，我们可能予以删除或限制相关账户。"] },
        { title: "支持", paragraphs: ["如对本条款有疑问，请联系 alurixofficial@gmail.com。"] },
      ],
    },
  },
};

export default legal;
