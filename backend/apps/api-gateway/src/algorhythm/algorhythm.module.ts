import { Module } from '@nestjs/common';
import { AlgorhythmService } from './algorhythm.service';
import { AlgorhythmController } from './algorhythm.controller';
import { PrismaModule } from '../shared/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AlgorhythmController],
  providers: [AlgorhythmService],
})
export class AlgorhythmModule {}
