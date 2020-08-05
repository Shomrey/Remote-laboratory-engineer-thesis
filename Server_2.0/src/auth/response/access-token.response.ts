import {ApiProperty} from "@nestjs/swagger";

export class AccessTokenResponse {

    @ApiProperty()
    access_token: string;
}