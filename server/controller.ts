import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Res,
  Query,
} from '@nestjs/common'
import type { Response } from 'express'
import { Store, DataError } from './store.js'
import { idSchema, projectListQuerySchema } from '../shared/contracts.js'
import { registerAsset, readAssetFile } from './assets.js'
@Controller('api/v1')
export class ApiController {
  constructor(@Inject(Store) private readonly store: Store) {}
  @Get('ready') ready() {
    if (!this.store.ready())
      throw new DataError(503, 'unavailable', 'Storage unavailable')
    return { status: 'ready', contractVersion: 1 }
  }
  @Get('projects') list(@Query() query: unknown) {
    return this.store.list(projectListQuerySchema.parse(query).after)
  }
  @Get('projects/:id') read(@Param('id') id: string) {
    return this.store.read(idSchema.parse(id))
  }
  @Get('projects/:id/history') history(@Param('id') id: string) {
    return this.store.history(idSchema.parse(id))
  }
  @Post('projects') create(@Body() body: unknown) {
    return this.store.create(body)
  }
  @Post('projects/:id/changes') update(
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    return this.store.apply(idSchema.parse(id), body)
  }
  @Post('projects/:id/assets') register(
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    return registerAsset(this.store, id, body)
  }
  @Get('projects/:id/assets/:assetId') asset(
    @Param('id') id: string,
    @Param('assetId') assetId: string,
    @Res() response: Response,
  ) {
    const asset = this.store.asset(idSchema.parse(id), idSchema.parse(assetId))
    response.setHeader('Content-Type', asset.mediaType)
    response.setHeader('Content-Security-Policy', "default-src 'none'; sandbox")
    response.send(readAssetFile(this.store.dir, asset.key))
  }
}
