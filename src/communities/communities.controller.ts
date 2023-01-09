import { ZahtevRequestDto } from './../dto/request/zahtev-request.dto';
import { GradRequestDto } from './../dto/request/grad-request.dto';
import { AddressRequestDto } from './../dto/request/address-request.dto';
import { ResponseInterceptor } from './../db/response-interceptor';
import { CommunitiesService } from './communities.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { PonudaRequestDto } from 'src/dto/request/ponuda-request.dto';

@Controller('communities')
@UseInterceptors(ResponseInterceptor)
export class CommunitiesController {
  constructor(private communitiesService: CommunitiesService) {}

  @Get('allAddress')
  async getAllAddress() {
    return await this.communitiesService.getAllAddress();
  }

  @Post('insertAddress')
  async insertAddress(@Body() address: AddressRequestDto) {
    return await this.communitiesService.insertAddress(address);
  }

  @Put('updateAddressById')
  async updateAddressById(@Body() address: AddressRequestDto) {
    return await this.communitiesService.updateAddressById(address);
  }

  @Delete('deleteAddressById/:adresaID')
  async deleteAddressById(
    @Param('adresaID') adresaID: Pick<AddressRequestDto, 'adresaID'>,
  ) {
    return await this.communitiesService.deleteAddressById(adresaID);
  }

  @Get('allGrad')
  async getAllGrad() {
    return await this.communitiesService.getAllGrad();
  }

  @Post('insertGrad')
  async insertGrad(@Body() grad: GradRequestDto) {
    return await this.communitiesService.insertGrad(grad);
  }

  @Put('updateGradById')
  async updateGradById(@Body() grad: GradRequestDto) {
    return await this.communitiesService.updateGradById(grad);
  }

  @Delete('deleteGradById/:gradID')
  async deleteGradById(
    @Param('gradID') gradID: Pick<GradRequestDto, 'gradID'>,
  ) {
    return await this.communitiesService.deleteGradById(gradID);
  }

  @Get('allPonuda')
  async getAllPonuda() {
    return await this.communitiesService.getAllPonuda();
  }

  @Put('updatePonudaById')
  async updatePonudaById(@Body() ponuda: PonudaRequestDto) {
    return await this.communitiesService.updatePonudaById(ponuda);
  }

  @Delete('deletePonudaById/:ponudaID')
  async deletePonudaById(
    @Param('ponudaID') ponudaID: Pick<PonudaRequestDto, 'ponudaID'>,
  ) {
    return await this.communitiesService.deletePonudaById(ponudaID);
  }

  @Get('allZahtev')
  async getAllZahtev() {
    return await this.communitiesService.getAllZahtev();
  }

  @Put('updateZahtevById')
  async updateZahtevById(@Body() zahtev: ZahtevRequestDto) {
    return await this.communitiesService.updateZahtevById(zahtev);
  }

  @Delete('deleteZahtevById/:zahtevID')
  async deleteZahtevById(
    @Param('zahtevID') zahtevID: Pick<ZahtevRequestDto, 'zahtevID'>,
  ) {
    return await this.communitiesService.deleteZahtevById(zahtevID);
  }
}
