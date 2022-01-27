import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    HttpStatus
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
    CustomApiCreateOperations,
    CustomApiDeleteOperations,
    CustomApiUpdateOperations,
    getCustomApiGetResponse,
    postCustomApiPostResponse,
    SharedService,
} from 'src/shared/shared.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthorService } from './author.service';
import { AuthorEntity } from './dto/author.entity';
import { LoginDto } from '../auth/dto/login.dto';

@ApiUnauthorizedResponse({ description: 'please provide a valid token' })

@ApiBearerAuth('token')
@UseGuards(JwtAuthGuard)
@ApiTags('Author')
@Controller('author')
export class AuthorController {
    constructor(
        private authorService: AuthorService,
        private sharedService: SharedService,
        private authService: AuthService
    ) { }

    // =================================================================
    //                  GET REQUESTS
    // =================================================================

    // ------------------------------------------------
    // GET get all authors
    // protected
    // ------------------------------------------------
    @ApiOperation({ summary: 'get author by id' })
    @ApiResponse(getCustomApiGetResponse(AuthorEntity))
    @Get('/id/:id')
    async findOne(@Param('id') id: number) {
        try {
            var data = await this.authorService.findOneByConditions(id);
            return this.sharedService.handleSuccess(data);
        } catch (error) {
            return this.sharedService.handleError(error);
        }
    }

    // ------------------------------------------------
    // GET get all authors
    // protected
    // ------------------------------------------------
    @ApiOperation({ summary: 'get list of all authors' })
    @ApiResponse(getCustomApiGetResponse(AuthorEntity))
    @Get()
    async findAll() {
        try {
            var data = await this.authorService.findAll();
            console.log(data)
        } catch (error) {
            return this.sharedService.handleError(error);
        }
        return this.sharedService.handleSuccess(data);
    }
    //create author is handled in auth controller
    //when a user register he is considered author by default
    // =================================================================
    //                  PUT REQUESTS
    // =================================================================

    // ------------------------------------------------
    // Update author
    // protected
    // ------------------------------------------------
    @ApiCreatedResponse({
        description: 'author updated successfully',
    })
    @ApiResponse(postCustomApiPostResponse('author'))
    @ApiBody({ type: AuthorEntity, required: false })
    @ApiOperation(CustomApiUpdateOperations('author'))
    @Put(':id')
    async updateOne(@Param('id') id: number, @Body() data: AuthorEntity) {
        try {
            await this.authorService.updateOne(id, data);
        } catch (error) {
            return this.sharedService.handleError(error);
        }
        return this.sharedService.handleSuccess(
            null,
            'author updated successfully',
        );
    }

    // =================================================================
    //                  DELETE REQUESTS
    // =================================================================

    // ------------------------------------------------
    // DELETE author by id
    // protected
    // ------------------------------------------------
    @ApiCreatedResponse({
        description: 'author deleted  successfully',
    })
    @ApiResponse(postCustomApiPostResponse('author'))
    @ApiOperation(CustomApiDeleteOperations('author'))
    @Delete(':id')
    async deleteOne(@Param('id') id: number) {
        try {
            await this.authorService.deleteOne(id);
        } catch (error) {
            return this.sharedService.handleError(error);
        }
        return this.sharedService.handleSuccess(
            null,
            'author deleted successfully',
        );
    }

}