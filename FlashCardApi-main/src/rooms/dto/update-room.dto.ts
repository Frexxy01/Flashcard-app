import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto, CreateStudyCardDto } from './create-room.dto';

export class UpdateStudyCardDto extends PartialType(CreateStudyCardDto) {}
