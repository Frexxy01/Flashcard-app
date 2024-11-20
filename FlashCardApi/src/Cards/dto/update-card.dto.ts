import { PartialType } from '@nestjs/mapped-types';
import {CreateStudyCardDto } from './create-card.dto';

export class UpdateStudyCardDto extends PartialType(CreateStudyCardDto) {}
