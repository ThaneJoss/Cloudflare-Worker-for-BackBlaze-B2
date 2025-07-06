import { AwsClient } from 'aws4fetch'

export default {
  async fetch(request, env) {
    return await handleRequest(request, env)
  }
}

async function handleRequest(request, env) {
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
  upstreamUrl.pathname += url.pathname // 附加传入请求的路径

  // 创建一个新请求发送到 S3 服务，保留原始请求头和请求体
  const upstreamRequest = new Request(upstreamUrl, request)

  // 使用 AWS Signature Version 4 签署上游请求
  const signedRequest = await aws.sign(upstreamRequest)

  // 从 S3 服务获取资源并将响应返回给客户端
  return fetch(signedRequest)
}