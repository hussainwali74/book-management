import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ type: String, example: 'hussainadmin@ds.com' })
    email: string;

    @ApiProperty({ type: String, description: "password", example: 'hussainadmin' })
    password: string;
}
