# Cloudflare Worker for BackBlaze B2

**项目地址:** [https://github.com/ThaneJoss/Cloudflare-Worker-for-BackBlaze-B2](https://github.com/ThaneJoss/Cloudflare-Worker-for-BackBlaze-B2)

这是一个 Cloudflare Worker，用于将 BackBlaze B2 存储桶作为 S3 兼容存储进行代理。它允许您通过 Cloudflare 的边缘网络访问您的 B2 存储桶，从而提高性能和安全性。

## 特性

- 将 BackBlaze B2 存储桶代理为 S3 兼容端点。
- 利用 Cloudflare 的全球网络加速内容交付。
- 通过 Cloudflare Worker 提供额外的安全层。

## 部署

1.  **克隆此仓库：**

    ```bash
    git clone https://github.com/ThaneJoss/Cloudflare-Worker-for-BackBlaze-B2.git
    cd Cloudflare-Worker-for-BackBlaze-B2
    ```

2.  **安装依赖：**

    ```bash
    npm install
    ```

3.  **配置环境变量：**

    在 `wrangler.toml` 文件中或通过 Cloudflare Worker 控制台设置以下环境变量：

    - `AWS_ACCESS_KEY_ID`: 您的 BackBlaze B2 应用程序密钥 ID。
    - `AWS_SECRET_ACCESS_KEY`: 您的 BackBlaze B2 应用程序密钥。
    - `AWS_S3_ENDPOINT`: 您的 BackBlaze B2 S3 兼容端点（例如：`https://s3.us-west-001.backblazeb2.com`）。

4.  **部署到 Cloudflare Workers：**

    ```bash
    npx wrangler deploy
    ```

## 使用方法

部署 Worker 后，您可以通过 Worker 的 URL 访问您的 B2 存储桶。例如，如果您的 Worker URL 是 `https://your-worker.your-username.workers.dev`，并且您的存储桶中有一个名为 `my-file.txt` 的文件，您可以通过 `https://your-worker.your-username.workers.dev/my-bucket/my-file.txt` 访问它。

## 注意事项

- 确保您的 BackBlaze B2 应用程序密钥具有访问所需存储桶的权限。
- 此 Worker 仅代理 S3 兼容请求。对于其他 B2 API 操作，您需要直接使用 B2 API。

## 贡献

欢迎贡献！如果您有任何改进建议或发现错误，请随时提交 Pull Request 或创建 Issue。

## 许可证

本项目采用 [MIT 许可证](https://opensource.org/licenses/MIT)。根据此许可证，您可以使用、复制、修改、合并、发布、分发、再许可和/或销售本软件的副本，但必须在所有副本或实质性部分中包含原始版权声明和本许可声明。这意味着您在使用本项目的代码时，需要保留原作者的署名信息。
