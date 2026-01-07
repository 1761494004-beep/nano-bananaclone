# Nano Banana Clone (Next.js + Supabase + Creem)

本项目包含：
- 登录：Supabase Auth（Google OAuth）
- 支付：Creem（`/checkout` + Webhook：`/api/webhook/creem`）
- 图片生成：KIE API（`/api/generate`）

## 1) 本地开发

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

在 `.env.local` 里至少填写：
- `KIE_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `CREEM_API_KEY`
- `CREEM_WEBHOOK_SECRET`
- `CREEM_PRODUCT_ID_*`（你的产品 ID）

## 2) 配置登录（Supabase + Google）

1. Supabase 新建项目
2. Supabase 控制台 → **Project Settings** → **API**：
   - 复制 `Project URL` → 填到 `NEXT_PUBLIC_SUPABASE_URL`
   - 复制 `Publishable key` → 填到 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. Supabase 控制台 → **Authentication** → **Providers** → 启用 **Google**
4. Google Cloud Console 创建 OAuth Client（Web）
   - **Authorized redirect URIs** 填 Supabase 的回调（形如）：
     - `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - 把 Google 的 Client ID / Secret 填回 Supabase 的 Google Provider 设置里
5. Supabase 控制台 → **Authentication** → **URL Configuration**
   - `Site URL`：
     - 本地：`http://localhost:3000`
     - 线上：`https://你的域名`
   - `Redirect URLs`（至少加入）：
     - `http://localhost:3000/auth/callback`
     - `https://你的Vercel域名/auth/callback`
     - `https://你的自定义域名/auth/callback`（如果有）

> 代码里的登录入口：`/auth/signin/google`，回调：`/auth/callback`。

## 3) 配置支付（Creem）

1. Creem Dashboard 创建产品（获取 `prod_...` 这类 Product ID）
2. 在 Vercel / 本地环境变量中填写：
   - `CREEM_API_KEY`
   - `CREEM_WEBHOOK_SECRET`
   - `CREEM_TEST_MODE=true`（测试模式建议开启；生产环境改为 `false`）
   - `CREEM_PRODUCT_ID_*`（你的产品 ID）
3. Creem Dashboard → Webhooks：
   - Endpoint URL：`https://你的域名/api/webhook/creem`

> Pricing 页会把已登录用户的 `user.id` 作为 `referenceId` 传给 Creem（用于将来在 webhook 中做关联）。

## 4) 通过 GitHub 部署到 Vercel（保证登录/支付可用）

1. 把代码推到 GitHub（注意：`.env.local` 不会被提交，已在 `.gitignore` 忽略）
2. Vercel → Add New → Project → 选择 GitHub 仓库导入
3. Vercel → Project → Settings → **Environment Variables**
   - **Production**：填生产 key / 生产 webhook secret / 产品 ID
   - **Preview**：建议填测试 key（否则预览环境的支付/登录会因为缺少配置而不可用）
4. 绑定域名后，回到：
   - Supabase → URL Configuration：补上你的线上域名回调
   - Creem → Webhooks：把 endpoint 改成你的线上域名（或新增一个 Production endpoint）

## 5) 快速验收清单

- 登录：访问首页 → 点击 “Sign in with Google” → 能回到站点且 Header 显示邮箱
- 支付：访问 `/pricing` → 点击任一套餐 → 能跳转到 Creem Checkout
- Webhook：完成支付后，Creem Dashboard 能看到 webhook 事件成功投递到 `/api/webhook/creem`

