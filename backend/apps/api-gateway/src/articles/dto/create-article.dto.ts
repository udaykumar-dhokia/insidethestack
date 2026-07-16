import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from '../../../../../generated/prisma/client';

export class CreateArticleDto {
  @ApiProperty({ description: 'Title of the article' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'Brief description of the article' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ enum: Category, description: 'Category of the article' })
  @IsEnum(Category)
  @IsNotEmpty()
  category!: Category;

  @ApiPropertyOptional({ description: 'Subcategory' })
  @IsOptional()
  @IsString()
  subCategory?: string;

  @ApiPropertyOptional({ description: 'Cover image URL' })
  @IsOptional()
  @IsUrl()
  image?: string;

  @ApiPropertyOptional({ description: 'Platform URL (e.g. original source)' })
  @IsOptional()
  @IsUrl()
  platformUrl?: string;

  @ApiProperty({ description: 'The MDX content of the article' })
  @IsString()
  @IsNotEmpty()
  content!: string;
}
