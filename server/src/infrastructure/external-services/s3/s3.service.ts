import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { IS3Service } from "../../../domain/interfaces/services/IS3Service"
import { ILogger } from "../../../domain/interfaces/services/ILogger"
import { env } from "../../config/env"

export class S3Service implements IS3Service {
  private s3: S3Client
  private bucket: string
  private region: string

  constructor(private readonly logger: ILogger) {
    this.bucket = env.AWS_S3_BUCKET_NAME!
    this.region = env.AWS_REGION!

    this.s3 = new S3Client({
      region: this.region,
      requestChecksumCalculation: "WHEN_REQUIRED",
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
      },
    })
  }

  isPublicFile(key: string): boolean {
    return key.startsWith("profiles/") || key.startsWith("portfolios/")
  }

  async generateUploadUrl(key: string, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    })

    const uploadUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 3600, 
    })

    const fileUrl = this.isPublicFile(key)
      ? `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`
      : key 

    return { uploadUrl, fileUrl }
  }

  async generateDownloadUrl(key: string): Promise<string> {
    if (this.isPublicFile(key)) {
      return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })

    return await getSignedUrl(this.s3, command, {
      expiresIn: 3600,
    })
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const urlMatches = fileUrl.match(/amazonaws\.com\/(.+)$/);
      if (!urlMatches || urlMatches.length < 2) return;
      
      const key = decodeURIComponent(urlMatches[1]);
      
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3.send(command);
    } catch (error) {
      this.logger.error("Error deleting file from S3:", error);
    }
  }
}