import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';

@Controller('github')
export class GithubController {
  @Post('user')
  async getGithubUser(@Body('token') token?: string) {
    if (!token?.trim()) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }

    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (response.status === 401) {
      throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
    }

    if (!response.ok) {
      throw new HttpException(`GitHub API error: ${response.status}`, HttpStatus.BAD_GATEWAY);
    }

    return response.json();
  }
}
