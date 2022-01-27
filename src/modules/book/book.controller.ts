import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards
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
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthorService } from '../author/author.service';
import { BookService } from './book.service';
import { BookEntity } from './dto/book.entity';

@ApiUnauthorizedResponse({ description: 'please provide a valid token' })

@ApiBearerAuth('token')
@UseGuards(JwtAuthGuard)
@ApiTags('Book')
@Controller('book')
export class BookController {
    constructor(
        private bookService: BookService,
        private authorService: AuthorService,
        private sharedService: SharedService,) { }

    // =================================================================
    //                  GET REQUESTS
    // =================================================================

    // ------------------------------------------------
    // GET get book by id
    // protected
    // ------------------------------------------------
    @ApiOperation({ summary: 'get book by id' })
    @ApiResponse(getCustomApiGetResponse(BookEntity))
    @Get('/id/:id')
    async findOne(@Param('id') id: number) {
        try {
            var data = await this.bookService.findOneByConditions(id);
            return this.sharedService.handleSuccess(data);
        } catch (error) {
            return this.sharedService.handleError(error);
        }
    }

    // ------------------------------------------------
    // GET get all books
    // protected
    // ------------------------------------------------
    @ApiOperation({ summary: 'get list of all books' })
    @ApiResponse(getCustomApiGetResponse(BookEntity))
    @Get()
    async findAll() {
        try {
            var data = await this.bookService.findAll();
            return this.sharedService.handleSuccess(data);
        } catch (error) {
            return this.sharedService.handleError(error);
        }
    }

    // =================================================================
    //                  POST REQUESTS
    // =================================================================

    // ------------------------------------------------
    // POST create new book
    // protected
    // ------------------------------------------------
    @ApiCreatedResponse({
        description: 'book created successfully',
    })
    @ApiResponse(postCustomApiPostResponse('book'))
    @ApiBody({ type: BookEntity, required: true })
    @ApiOperation(CustomApiCreateOperations('book'))
    @Post('create')
    async create(@Body() bookEntity: BookEntity, @GetUser() author) {
        try {
            const author_result = await this.authorService.findOneByConditions({ id: author.author_id })
            if (author_result.id !== +bookEntity.author) return this.sharedService.handleError("You are not authorized to create book for this author")
            const result = await this.bookService.create(bookEntity)
            return this.sharedService.handleSuccess(result, 'Book created successfully')
        } catch (error) {
            return this.sharedService.handleError(error);
        }

    }

    // =================================================================
    //                  PUT REQUESTS
    // =================================================================

    // ------------------------------------------------
    // Update book
    // protected
    // ------------------------------------------------
    @ApiCreatedResponse({
        description: 'book updated successfully',
    })
    @ApiResponse(postCustomApiPostResponse('book'))
    @ApiBody({ type: BookEntity, required: false })
    @ApiOperation(CustomApiUpdateOperations('book'))
    @Put(':id')
    async updateOne(@Param('id') id: number, @Body() data: BookEntity) {
        try {
            await this.bookService.updateOne(id, data);
            return this.sharedService.handleSuccess(
                null,
                'book updated successfully',
            );
        } catch (error) {
            return this.sharedService.handleError(error);
        }
    }

    // =================================================================
    //                  DELETE REQUESTS
    // =================================================================

    // ------------------------------------------------
    // DELETE book by id
    // protected
    // ------------------------------------------------
    @ApiCreatedResponse({
        description: 'book deleted  successfully',
    })
    @ApiResponse(postCustomApiPostResponse('book'))
    @ApiOperation(CustomApiDeleteOperations('book'))
    @Delete(':id')
    async deleteOne(@Param('id') id: number) {
        try {
            await this.bookService.deleteOne(id);
            return this.sharedService.handleSuccess(
                null,
                'book deleted successfully',
            );
        } catch (error) {
            return this.sharedService.handleError(error);
        }
    }

}