import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomApiCreateOperations, postCustomApiPostResponse, SharedService } from 'src/shared/shared.service';
import { AuthorService } from '../author/author.service';
import { AuthorEntity } from '../author/dto/author.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authorService: AuthorService,
        private authService: AuthService,
        private sharedService: SharedService
    ) { }


    // =================================================================
    //                  POST REQUESTS
    // =================================================================

    // ------------------------------------------------
    // POST login
    // protected
    // ------------------------------------------------

    @Post('login')
    async login(@Body() authorDto: LoginDto) {
        // verify author email
        let author;
        try {
            author = await this.authorService.findOneByConditions({ where: { email: authorDto.email } })
            if (!author) {
                return this.sharedService.handleError({ message: 'No Author with the given credentials', status: HttpStatus.NOT_FOUND })
            }
        } catch (error) {
            return this.sharedService.handleError(error)
        }

        // verify author password
        try {
            const comparePasswordResult = await this.authService.comparePassword(authorDto.password, author.password)
            if (!comparePasswordResult) {
                return this.sharedService.handleError({ message: 'invalid credentials', status: HttpStatus.NOT_FOUND })
            }

        } catch (error) {
            return this.sharedService.handleError(error)
        }

        // generate JWT and return
        const payload = {
            email: author.email,
            author_id: author.id
        }

        try {
            const token = await this.authService.signPayload(payload);
            let { password, ...authorfinal } = author;
            return this.sharedService.handleSuccess({ authorfinal, token });
        } catch (error) {
            return this.sharedService.handleError(error);
        }
    }

    // ------------------------------------------------
    // POST register new author
    // protected
    // ------------------------------------------------
    @ApiCreatedResponse({
        description: 'author registered successfully',
    })
    @ApiResponse(postCustomApiPostResponse('author'))
    @ApiBody({ type: AuthorEntity, required: true })
    @ApiOperation(CustomApiCreateOperations('author'))
    @Post('register')
    async register(@Body() authorEntity: AuthorEntity) {
        // check if author already registered
        // send error
        const authorCheck = await this.authorService.findOneByConditions({ where: { email: authorEntity.email } })
        if (authorCheck) {
            return this.sharedService.handleError(`Author already registered with these credentials`)
        }

        try {
            authorEntity.password = await this.authService.hashPassword(authorEntity.password)
        } catch (error) {
            return this.sharedService.handleError(error)
        }

        //create author with encrypted password
        const author = await this.authorService.create(authorEntity)

        //sign jwt
        try {
            const payload = {
                email: author.email,
                id: author.id,
                name: author.name
            }

            const token = await this.authService.signPayload(payload)

            return this.sharedService.handleSuccess({ author, token })
        } catch (error) {
            return this.sharedService.handleError(error)
        }
    }

}
