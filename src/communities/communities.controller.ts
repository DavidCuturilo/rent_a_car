import { UgovorRequestDto } from './../dto/request/ugovor-request.dto';
import { RacunRequestDto } from './../dto/request/racun-request.dto';
import { VoziloRequestDto } from './../dto/request/vozilo-request.dto';
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

  @Get('allVozilo')
  async getAllVozilo() {
    return await this.communitiesService.getAllVozilo();
  }

  @Post('insertVozilo')
  async insertVozilo(@Body() vozilo: VoziloRequestDto) {
    return await this.communitiesService.insertVozilo(vozilo);
  }

  @Get('vozilaByMarka/:marka')
  async getVoziloByMarka(@Param('marka') marka: string) {
    return await this.communitiesService.getVoziloByMarka(marka);
  }

  @Get('allRacun')
  async getAllRacuni() {
    return await this.communitiesService.getAllRacuni();
  }

  @Get('allRadnik')
  async getAllRadnik() {
    return await this.communitiesService.getAllRadnik();
  }

  @Get('allKlijent')
  async getAllKlijent() {
    return await this.communitiesService.getAllKlijent();
  }

  @Put('updateRacunById')
  async updateRacunById(@Body() racun: RacunRequestDto) {
    return await this.communitiesService.updateRacunById(racun);
  }

  @Delete('deleteRacunById/:racunID')
  async deleteRacunById(
    @Param('racunID') racunID: Pick<RacunRequestDto, 'racunID'>,
  ) {
    return await this.communitiesService.deleteRacunById(racunID);
  }

  @Get('allRacunTekuceGodine')
  async getAllTekuciRacuni() {
    return await this.communitiesService.getAllTekuciRacuni();
  }

  @Get('allRacunPrethodneGodine')
  async getAllPrethodniRacuni() {
    return await this.communitiesService.getAllPrethodniRacuni();
  }

  @Get('allRacunRanijihGodina')
  async getAllRanijiRacuni() {
    return await this.communitiesService.getAllRanijiRacuni();
  }

  @Get('allDrzava')
  async getAllDrzave() {
    return await this.communitiesService.getAllDrzave();
  }

  @Get('ponudaByID/:ponudaID')
  async getPonudaByID(@Param('ponudaID') ponudaID: number) {
    return await this.communitiesService.getPonudaByID(ponudaID);
  }

  @Get('allRezervacija')
  async getAllRezervacije() {
    return await this.communitiesService.getAllRezervacije();
  }

  @Get('allUgovor')
  async getAllUgovori() {
    return await this.communitiesService.getAllUgovori();
  }

  @Get('allBitnijiDeloviUgovora')
  async allBitnijiDeloviUgovora() {
    return await this.communitiesService.allBitnijiDeloviUgovora();
  }

  @Get('allDetaljiUgovora')
  async allDetaljiUgovora() {
    return await this.communitiesService.allDetaljiUgovora();
  }

  @Put('updateUgovorById')
  async updateUgovorById(@Body() ugovor: UgovorRequestDto) {
    return await this.communitiesService.updateUgovorById(ugovor);
  }

  @Delete('deleteUgovorById/:ugovorID')
  async deleteUgovorById(
    @Param('ugovorID') ugovorID: Pick<UgovorRequestDto, 'ugovorID'>,
  ) {
    return await this.communitiesService.deleteUgovorById(ugovorID);
  }
}
