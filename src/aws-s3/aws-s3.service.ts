import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AwsS3Service {
  private bucketName;
  private s3;

  constructor() {
    this.bucketName = process.env.AWS_BUCKET_NAME;
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      region: process.env.AWS_REGION,
    });
  }

  async uploadFile(fileId, file) {
    if (!fileId || !file) {
      throw new BadRequestException('file is required');
    }
    const config = {
      Key: fileId,
      Body: file.buffer,
      Bucket: this.bucketName,
      ContentType: file.mimetype,
    };

    const uploadCommand = new PutObjectCommand(config);
    await this.s3.send(uploadCommand);
    return {
      message: 'file uploaded successfully',
      data: fileId,
    };
  }

  async getFileById(fileId) {
    if (!fileId) throw new BadRequestException('fileId is required');
    const config = {
      Key: fileId,
      Bucket: this.bucketName,
    };
    const getCommand = new GetObjectCommand(config);
    const fileStream = await this.s3.send(getCommand);
    console.log(fileStream, 'filestrewam');
  }

  async deleteFileById(fileId) {
    if (!fileId) throw new BadRequestException('fileId is required');
    const config = {
      Key: fileId,
      Bucket: this.bucketName,
    };
    const deleteCommand = new DeleteObjectCommand(config);
    await this.s3.send(deleteCommand);
    return fileId;
  }
}
