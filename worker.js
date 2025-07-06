import { AwsClient } from 'aws4fetch'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // 从环境变量中检索配置
    const awsAccessKeyId = env.AWS_ACCESS_KEY_ID
    const awsSecretAccessKey = env.AWS_SECRET_ACCESS_KEY
    const s3Endpoint = env.AWS_S3_ENDPOINT

    // 验证必要的环境变量
    if (!awsAccessKeyId || !awsSecretAccessKey || !s3Endpoint) {
      return new Response('缺少必要的环境变量。请确保已设置 AWS_ACCESS_KEY_ID、AWS_SECRET_ACCESS_KEY 和 AWS_S3_ENDPOINT。', { status: 500 })
    }

    // 创建一个 AWS 客户端实例用于签名请求
    const aws = new AwsClient({
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
      service: 's3', // 为 S3 兼容存储指定 's3' 服务
    })

    // 构造指向 S3 端点的上游请求 URL
    const upstreamUrl = new URL(s3Endpoint)
    if (url.pathname === '/') {
      return new Response('Access to root directory is forbidden.', { status: 403 });
    }
    upstreamUrl.pathname += url.pathname.slice(1) // 附加传入请求的路径

    // 创建一个新请求发送到 S3 服务，只保留必要的请求头以最小化签名范围
    const excludeHeaders = new Set([
      'x-forwarded-proto',
      'x-real-ip',
      'accept-encoding',
      'if-match',
      'if-modified-since',
      'if-none-match',
      'if-range',
      'if-unmodified-since',
    ]);

    const newHeaders = new Headers();
    for (const [key, value] of request.headers.entries()) {
      if (!excludeHeaders.has(key.toLowerCase()) && !key.toLowerCase().startsWith('cf-')) {
        newHeaders.set(key, value);
      }
    }

    const upstreamRequest = new Request(upstreamUrl, {
      method: request.method,
      headers: newHeaders,
      body: request.body, // 确保请求体也被传递，例如对于 PUT/POST 请求
    });

    // 使用 AWS Signature Version 4 签署上游请求
    const signedRequest = await aws.sign(upstreamRequest)

    // 从 S3 服务获取资源并将响应返回给客户端
    console.log(`正在访问的真实地址: ${signedRequest.url}`);
    return fetch(signedRequest)
  }
}
