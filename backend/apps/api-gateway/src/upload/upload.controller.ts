import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload an image to Cloudinary' })
  @ApiOkResponse({
    description: 'Image uploaded successfully.',
    schema: {
      example: {
        url: 'https://res.cloudinary.com/...',
        public_id: 'insidethestack/...',
      },
    },
  })
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/.*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadService.uploadImage(file);
  }

  @Post('cleanup')
  @ApiOperation({ summary: 'Delete unused images from Cloudinary' })
  @ApiOkResponse({ description: 'Images deleted successfully.' })
  async cleanupImages(@Body('publicIds') publicIds: string[]) {
    if (!publicIds || publicIds.length === 0) {
      return { success: true, message: 'No images to clean up' };
    }
    await this.uploadService.cleanupImages(publicIds);
    return { success: true, count: publicIds.length };
  }
}
