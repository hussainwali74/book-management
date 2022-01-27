import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ApiProperty, ApiResponseOptions } from '@nestjs/swagger';
import {
    CallbacksObject,
    ExternalDocumentationObject,
    ParameterObject,
    ReferenceObject,
    RequestBodyObject,
    ResponsesObject,
    SecurityRequirementObject,
    ServerObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class SharedService {


    handleSuccess(data?: any, message?: string) {
        return {
            status: true,
            message: message || 'request completed successfully',
            data,
        };
    }

    handleError(error) {
        let query;
        if (error.response) {
            //checks for foreign key failure
            query = error.response.query;
            if (error['message']) {
                let errSplit = error['message']?.split('REFERENCES');
                if (errSplit.length > 1) {
                    error['message'] = "Foreign Key constraint failure error: " + errSplit[1]
                } else if (errSplit.length == 0) {
                    error['message'] = errSplit[0].split(':')[1]
                }
            }
        }

        return {
            status: false,
            message: 'request failed',
            error: error['message'] || error,
            // query: query,
            code: error['status'],
        };
    }

    async validate(data) {
        const errors: ValidationError[] = await validate(data, {
            validationError: { target: false, value: false },
        }).then((errors: ValidationError[]) => {
            // errors is an array of validation errors
            if (errors.length > 0) {
                errors.map((x) => {
                    return x.constraints;
                });
                return errors;
            }
        });
        if (errors) {
            errors['statusCode'] = 400;
            errors['error'] = 'Bad Request';
            throw errors;
        }
    }
}

export class CustomApiOkResponse<T> {
    @ApiProperty()
    status: true;
    @ApiProperty({
        example: 'request succeffully completed',
    })
    message: 'request succeffully completed';
    type: T;
}

export const CustomApiDeleteOperations = (type: string): OperationObject => {
    const obj: OperationObject = {
        summary: 'Delete ' + type,
        description: 'param: id',
        responses: undefined,
    };
    return obj;
};

export const CustomApiCreateOperations = (type: string): OperationObject => {
    const obj: OperationObject = {
        summary: 'Create ' + type,
        description: 'accepts application/json data',
        responses: undefined,
    };
    return obj;
};
export const CustomApiUpdateOperations = (type: string): OperationObject => {
    const obj: OperationObject = {
        summary: 'Update ' + type,
        description: 'accepts application/json data',
        responses: undefined,
    };
    return obj;
};

export const postCustomApiPostResponse = (type: string): ApiResponseOptions => {
    const obj = {
        status: 200,
        description: 'returns success object',
        type: CustomApiOkResponse,
    };
    return obj;
};

export const getCustomApiGetResponse = (
    dto,
    isArray: boolean = true,
    dtoType?: string,
): ApiResponseOptions => {
    class DtoClass {
        @ApiProperty({ example: true })
        status: true;

        @ApiProperty({
            example: 'list of ' + dto.toString().split(' ')[1] + ' objects',
        })
        message: string;

        @ApiProperty({ type: dto, isArray: isArray })
        data;
    }

    const respDescString: string =
        dtoType || dto.toString().split(' ')[1] + ' objects';

    const obj: ApiResponseOptions = {
        type: DtoClass,
        status: 200,
        description: 'returns ' + respDescString,
    };
    return obj;
};

export interface OperationObject {
    tags?: string[];
    summary?: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
    operationId?: string;
    parameters?: (ParameterObject | ReferenceObject)[];
    requestBody?: RequestBodyObject | ReferenceObject;
    responses: ResponsesObject;
    callbacks?: CallbacksObject;
    deprecated?: boolean;
    security?: SecurityRequirementObject[];
    servers?: ServerObject[];
}